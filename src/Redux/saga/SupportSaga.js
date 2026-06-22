import { put, call } from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';

export function* supportApiSaga(action) {

  try {
    const result = yield call(FetchApi.support, action.tittle, action.descrption);
    if (result.status === 1) {
      
      yield put({ type: ApiConstants.constants.API_SUPPORT_SUCCESS, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)
    }
    else if (result.status === 3 || result.status === 4) {
    
      yield put({ type: ApiConstants.constants.API_SUPPORT_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
      result.status === 3 ?
      setTimeout(() => { alert(result.result.message) }, 800)
      :
      setTimeout(() => { alert(result.result.message) }, 800)
    }
    else {
      yield put({ type: ApiConstants.constants.API_SUPPORT_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_SUPPORT_ERROR, error: error });
        setTimeout(() => { alert(error.result) }, 800)
  }
}

export function* reportUserApiSaga(action) {

  try {
    const result = yield call(FetchApi.reportUser, action.id, action.message);
    if (result.status === 1) {
      
      yield put({ type: ApiConstants.constants.API_REPORT_USER_SUCCESS, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)
    }
    else if (result.status === 3 || result.status === 4) {
    
      yield put({ type: ApiConstants.constants.API_REPORT_USER_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
      result.status === 3 ?
      setTimeout(() => { alert(result.result.message) }, 800)
      :
      setTimeout(() => { alert(result.result.message) }, 800)
    }
    else {
      yield put({ type: ApiConstants.constants.API_REPORT_USER_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_REPORT_USER_ERROR, error: error });
        setTimeout(() => { alert(error.result) }, 800)
  }
}