import { StackActions } from "@react-navigation/native";
import { put, call } from "redux-saga/effects";
import { FetchApi } from "../../Components";
import { ApiConstants } from "../../Themes";

export function* searchTerminalSaga(action) {
  try {
    const result = yield call(FetchApi.searchTerminal, action.terminal_name);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_SEARCH_TERMINAL_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_SEARCH_TERMINAL_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_SEARCH_TERMINAL_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_SEARCH_TERMINAL_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* searchUserSaga(action) {
  try {
    const result = yield call(
      FetchApi.searchUser,
      action.user_name,
      action.page
    );

    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_SEARCH_USER_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      const resetActions = StackActions.replace("FavouriteTerminal2");
      action.navigation.dispatch(resetActions);

      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_SEARCH_USER_FAIL,
        result: result,
        status: result.status,
        // navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_SEARCH_USER_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* nearByTerminalsSaga(action) {
  try {
    const result = yield call(
      FetchApi.nearByTerminals,
      action.lat,
      action.long
    );

    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_NEAR_TERMINALS_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_NEAR_TERMINALS_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_NEAR_TERMINALS_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_NEAR_TERMINALS_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
