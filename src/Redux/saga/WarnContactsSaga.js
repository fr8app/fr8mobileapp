import { put, call } from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';

export function* warnContactsApiSaga(action) {

  try {
    const result = yield call(FetchApi.warnContacts, action.phoneNo, action.terminlId,);
    console.log(result)
    if (result.status === 1) {
      yield put({ type: ApiConstants.constants.API_WARN_CONTACTS_SUCCESS, result: result,index:action.index, status: result.status, navigation: action.navigation });
    }
    else if (result.status === 3 || result.status === 4) {
      yield put({ type: ApiConstants.constants.API_WARN_CONTACTS_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
      result.status === 3 ?
      setTimeout(() => { alert(result.result.message) }, 800)
      :
      setTimeout(() => { alert(result.result.message) }, 800)
    }
    else {
      yield put({ type: ApiConstants.constants.API_WARN_CONTACTS_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_WARN_CONTACTS_ERROR, error: error });
        setTimeout(() => { alert(error.result) }, 800)
  }
}