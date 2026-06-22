import { createStore, applyMiddleware } from 'redux'
import rootReducer from './src/Redux/reducer';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './src/Redux/saga';

const sagaMiddleware = createSagaMiddleware()

// export default function configureStore() {
  export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga)
// }

// import { createStore, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import rootReducer from '../reducers';
// import { rootSaga } from '../sagas';

// const sagaMiddleware = createSagaMiddleware();
// export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
// sagaMiddleware.run(rootSaga);