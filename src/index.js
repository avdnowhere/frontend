import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import storage from "localforage";
import { persistReducer, persistStore } from 'redux-persist';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { PersistGate } from "redux-persist/integration/react";

// import user from './redux/userReducer';
import snackbar from './redux/SnackbarReducer';
// import organization from './redux/organizationReducer';
// import viewingList from './redux/viewingListReducer';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const appReducer = combineReducers(
  {
    snackbar
  }
)

const persistConfig = {
  key: 'crsm',
  storage,
  debug: (process.env.NODE_ENV === 'development')
}

// const rootReducer = appReducer;
const rootReducer = (state, action) => {
  if (action.type === 'SIGN_OUT'){
    storage.removeItem('persist:cpiwrk');
    state = undefined;
  }

  return appReducer(state, action);
};

const middlewares = [
  thunk, createStateSyncMiddleware({
    blacklist: [
      'persist/PERSIST',
      'persist/REHYDRATE'
    ]
  }),
];

const composeEnhancers = composeWithDevTools({})

const enhancer = process.env.NODE_ENV === 'development' ? composeEnhancers(
  applyMiddleware(...middlewares),
) : applyMiddleware(...middlewares);


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, enhancer)
let persistor = persistStore(store)
initMessageListener(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
