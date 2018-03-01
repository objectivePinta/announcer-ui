// This component handles the App template used on every page.
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import moment from 'moment';
import Header from '../components/common/Header';
import * as style from './app.dino.css';

class App extends React.Component {

  static globals() {
    toastr.options.closeMethod = 'hide';
    //setting moment locale globally
    moment.locale(window.locale);
  }

  constructor(props, context) {
    super(props, context);
    toastr.options.preventDuplicates = true;
    toastr.options.timeOut = '1000';
  }



  componentDidMount() {
    document.documentElement.setAttribute("data-browser", navigator.userAgent);
  }

  render() {
    App.globals();
    return (
      <div className={style.app}>
                <Header/>
        {this.props.loading && <img className="ajax-loader" src={require('../images/ajax-loader.gif')} />}
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  loading: PropTypes.bool.isRequired,
};

App.childContextTypes  = {
  openDMInfo: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loading: state.loading,
  };
}


export default connect(mapStateToProps)(App);
