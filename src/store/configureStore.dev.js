import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import DevTools from '../components/DevTools';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

export default function configureStore(browserHistory, initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, routerMiddleware(browserHistory), reduxImmutableStateInvariant()),
      DevTools.instrument()
    )
  );
}
