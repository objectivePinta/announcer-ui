import React, {Component, PropTypes} from 'react';
import URI from 'urijs';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as loginActions from '../../actions/loginActions';
import * as logoutActions from '../../actions/logoutActions';
import * as styles from '../styles/common/header.dino.css';
import {Glyphicon} from 'react-bootstrap';

class Header extends Component {

  constructor(context,props) {
    super(context, props);
    this.logOut = this.logOut.bind(this);
  }

  componentWillMount() {
    this.props.loginActions.getUser();
  }

  logOut(event) {
    this.props.logoutActions.doLogout();
    this.context.router.push({ pathname: new URI('/login').toString()});
  }

  render() {
    const isLogged = this.props.user !== '';
    return(
      <div className={styles.header}>
        {!isLogged && <ul>
          <Link to={`/register`} activeClassName="active">Register</Link>
        </ul> }
        {isLogged && 
          <p className={styles.headerParagraph}>
          <button onClick={() => this.logOut()} className={styles.button}>
            <Glyphicon glyph="log-out" style={{color:'blue'}} />  Sign Out 
          </button>
           </p> }
      </div>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.object.isRequired,
};


Header.propTypes = {
  loginActions: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {user : state.loggedUser};
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
    logoutActions: bindActionCreators(logoutActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);


