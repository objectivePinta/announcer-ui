/* eslint-disable import/default */
import URI from 'urijs';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { IntlProvider, addLocaleData } from 'react-intl';
import configureStore from './store/configureStore';
import DevTools from './components/DevTools';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/toastr/build/toastr.min.css';
import * as constants from './constants/constants';
import routes from './routes';

const browserHistory = useRouterHistory(createHistory)({
  basename: URI.parse(constants.ROOT).path
});

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <IntlProvider locale={window.locale}>
      <div style={{ height: '100%' }}>
        <Router history={history} routes={routes(store)} />
        {false && <DevTools />}
      </div>
    </IntlProvider>
  </Provider>,
  document.getElementById('app')
);

/* eslint-enable import/default */
