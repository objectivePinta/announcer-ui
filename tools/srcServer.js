import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import URI from 'urijs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import https from 'https';
import LocalStrategy from 'passport-local';
import proxy from 'express-http-proxy';
import passport from 'passport';
import session from 'express-session';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);
const loginUri = process.env.LOGIN_URI || '/login';
const getUserUri = process.env.USER_URI || '/user';

const dummyUri = process.env.LOGIN_URI || '/dummy';

const registrationUri = process.env.LOGIN_URI || '/register';
const timeout = process.env.TIMEOUT || 10000;

const logoutUri = process.env.LOGOUT_URI || '/logout';
const baseUri = process.env.BASE_URI || '/';
const apiUri = process.env.API_URI || '/api';
const apiUrl = process.env.API_URL || 'http://localhost:8080';

const cookieSecret = process.env.COOKIE_SECRET || 'secret';
const cookieMaxAge = process.env.COOKIE_MAX_AGE || 15 * 60000;

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
// copy pasta
const asBase64 = function (value) {
    return Buffer.from(value).toString('base64');
};

passport.use(new LocalStrategy(function (username, password, done) {
    console.log("alo");
    const authUri = new URI(apiUrl + "/login").username(username).password(password);
    const request = (authUri.protocol() === 'http' ? http : https).request({
        method: 'GET',
        protocol: `${authUri.protocol()}:`,
        host: authUri.hostname(),
        port: authUri.port(),
        path: authUri.resource(),
        auth: authUri.userinfo(),
        headers: {
            'X-Authorization': 'Basic ' + asBase64(authUri.userinfo())
        },
    }, (response) => {
        response.setEncoding('utf8');
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
            switch (response.statusCode) {
                case 200: {
                    done(null, {
                        username: username,
                        password: password,
                        roles: body
                    });
                    break;
                }
                case 401: {
                    done(null, false);
                    break;
                }
                default: {
                    if (response.statusText) {
                        done(new Error(`${response.statusCode}: ${response.statusText}`));
                    } else {
                        done(new Error(`${response.statusCode}`));
                    }
                    break;
                }
            }
        });
    });
    request.on('error', (error) => {
        done(error);
    });
    request.end();
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const isMultipartRequest = function (req) {
    let contentTypeHeader = req.headers['content-type'];
    return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
};

const bodyParserJsonMiddleware = function () {
    return function (req, res, next) {

        if (isMultipartRequest(req)) {
            return next();
        }
        return bodyParser.json()(req, res, next);
    };
};

const bodyParserUrlencodedMiddleware = function () {
    return function (req, res, next) {
        process.stdout.write(`bodyParserUrlencodedMiddleware: ${req.url}\n`);
        if (isMultipartRequest(req)) {
            return next();
        }
        return bodyParser.urlencoded({extended: true})(req, res, next);
    };
};

const proxyMiddleware = function (settings) {
    process.stdout.write(`proxyMiddleware: ${settings.url}\n`);
    return function (req, res, next) {
        process.stdout.write(`proxyMiddleware: ${req.url}\n`);
        let reqAsBuffer = false;
        let reqBodyEncoding = true;
        if (isMultipartRequest(req)) {
            reqAsBuffer = true;
            reqBodyEncoding = null;
        }
      if (!settings.authenticate || req.isAuthenticated() || req.url.includes('registration')) {
            process.stdout.write(`proxyMiddleware1: ${req.url}\n`);

            return proxy(settings.url, {
                reqAsBuffer,
                reqBodyEncoding,
                timeout: timeout,
                limit: '10mb',
                decorateRequest: function (proxyReq, originalReq) {
                    process.stdout.write(`fowarded: ${originalReq.url}\n`);
                    if (!req.url.includes('registration') && settings.authenticate) {
                        const user = originalReq.user;
                        if (!proxyReq.headers)
                            proxyReq.headers = {};
                        proxyReq.headers['X-Authorization'] = 'Basic ' + asBase64(`${user.username}:${user.password}`);
                    }
                    return proxyReq;
                }
            })(req, res, next);
        } else {
            process.stdout.write(`proxyMiddleware2: ${req.url}\n`);
            return res.status(204).end();
        }
    };
};


// view engine setup
if (process.env.NODE_ENV === 'production') {
    app.set('views', path.join(__dirname, '/../dist'));
    app.use('/assets/', express.static(path.join(__dirname, '/../dist/assets')));
} else {
    app.set('views', path.join(__dirname, '/../src'));
    app.use('/assets/', express.static(path.join(__dirname, '/../node_modules')));
}

app.set('view engine', 'jade');
app.use(cookieParser(cookieSecret));
app.use(bodyParserJsonMiddleware());
app.use(bodyParserUrlencodedMiddleware());
app.use(session({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: cookieMaxAge
    }
}));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV !== 'production') {
    const bundler = webpack(config);
    app.use(webpackDevMiddleware(bundler, {
        stats: {
            colors: true,
            chunks: false
        },
        noInfo: true,
    }));

    app.use(webpackHotMiddleware(bundler, {
        log: console.log
    }));
}

app.post(loginUri, passport.authenticate('local'), (req, res) => {
    res.status(200).end();
});

app.post(logoutUri, (req, res) => {
  req.logout();
  res.status(200).end();
});

app.get('/user', (req,res) => {
 if (req.isAuthenticated()) {
     res.send(`{"user":"${req.user.username}"}`);
 } else {
     res.send('{"user":""}');
 }
});

app.use(apiUri, proxyMiddleware({url: apiUrl, authenticate: true, timeout}));


function serve(req, res) {
    process.stdout.write(`serve: ${req.url}\n`);
    let locale = 'pl'; //acceptLanguageParser.pick(supportLanguages, req.headers['accept-language']) || defaultLocale;
    res.render('index');
}

function redirectUnauthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        process.stdout.write(`authenticated: ${req.url}\n`);
        return next();
    }
    if (req.url.includes('register')) {
        return next();
    }
    process.stdout.write(`redirect unauthenticated: ${req.url}\n`);
    res.redirect(loginUri);
}

app.get(loginUri, serve);


app.get('*', redirectUnauthenticated, serve);

app.listen(port, (error) => {
    if (error) {
        process.stderr.write(error);
    }
});
