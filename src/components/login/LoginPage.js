import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../actions/loginActions';
import * as logoutActions from '../../actions/logoutActions';
import URI from 'urijs';
import {LoginFormObject} from '../../constants/LoginFormObject';
import bg1 from '../../images/sea.jpeg';
import IntelligentForm from '../common/IntelligentForm';
import toastr from 'toastr';
import * as styles from '../styles/login/loginPage.dino.css';
import {Glyphicon} from 'react-bootstrap';


const background = bg1;

class LoginPage extends Component {

  constructor(context,props) {
    super(context, props);
    this.state = {
      username: this.props.location.state ? this.props.location.state.username : '',
      password: this.props.location.state ? this.props.location.state.password : '',
    };
    this.onFieldsChange = this.onFieldsChange.bind(this);
    console.log(this.state);
  }

  componentWillMount() {
    this.props.loginActions.getUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user && nextProps.user !== '' ) {
      this.context.router.push({ pathname: new URI('/dummy').toString()});
    }
  }

  onSubmit() {
    this.props.loginActions.doLogin(this.state.username, this.state.password).then(response => {
      if (response.status === 200) {
        toastr.info('You\'re signed in!');
        this.context.router.push({ pathname: new URI('/dummy').toString()});
      } else {
        toastr.warning('Credentials are wrong.');
      }
    });
  }

  onFieldsChange(id, value) {
    if (id === 'username') {
      this.setState({username: value});
    } else {
      this.setState({password: value});
    }
  }


  render() {
    const values={username: this.state.username, password: this.state.password};
    return (
      <div className={styles.loginPage}>
        <h1>Log in</h1>
        <IntelligentForm
          title={LoginFormObject.title}
          onSubmit={() => {this.onSubmit()}}
          object={LoginFormObject.object}
          onFieldsChange={this.onFieldsChange}
          initialValues={values}
          submitCaption={<span> <Glyphicon glyph="log-in" style={{color:'blue'}} /> Sign in </span>}
          cancelCaption={<span> <Glyphicon glyph="record" style={{color:'blue'}} /> Register</span>}
          onCancel={() => this.context.router.push({ pathname: new URI('/register').toString()})}
        />
      </div>
    );
  }

}

LoginPage.contextTypes = {
  router: PropTypes.object,
};

LoginPage.propTypes = {
  loginActions: PropTypes.object,
  logoutActions: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  return {user: state.loggedUser};
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
    logoutActions: bindActionCreators(logoutActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

