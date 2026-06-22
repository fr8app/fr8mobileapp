import { StackActions } from "@react-navigation/native";
import { put, call, delay } from "redux-saga/effects";
import { FetchApi } from "../../Components";
import { ApiConstants } from "../../Themes";

export function* chatHistorySaga(action) {
  try {
    const result = yield call(FetchApi.chatHistory,action.text);
    console.log(result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_CHAT_HISTORY_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        search:action.text
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_CHAT_HISTORY_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      const resetActions= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetActions)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_CHAT_HISTORY_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      if (result.result.message !== "No recent chat found") {
        setTimeout(() => {
          alert(result.result.message);
        }, 800);
      }
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_CHAT_HISTORY_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* chatUserHistorySaga(action) {
  try {
   
    const result = yield call(
      FetchApi.chatUserHistory,
      action.item.friendInfo
        ? action.item.friendInfo.id
        : action.item.other_user_detail.id,
      action.offset,
      action.limit,
      action.online
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_CHAT_USER_HISTORY_SUCCESS,
        result: result,
        status: result.status,
        online:action.online,
        navigation: action.navigation,
      });
      
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_CHAT_USER_HISTORY_UNAUTHENTICATED,
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
        type: ApiConstants.constants.API_CHAT_USER_HISTORY_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        !action.online && alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_CHAT_USER_HISTORY_ERROR,
      error: error,
    });
    error.result == "empty Data"
      ? null
      : setTimeout(() => {
          alert(error.result);
        }, 800);
  }
}
export function* NotifyChatAppend(action) {
  try {
    delay(500);
    const result = yield call(
      FetchApi.chatUserHistory,
      action.payload.sender_id,
      1
    );
    // console.log('yup',result.result.data.data)
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.NOTIFICATION_CHAT_SUCCESS,
        payload: result.result.data.data,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else {
      yield put({
        type: ApiConstants.constants.NOTIFICATION_CHAT_ERROR,
        paylod: "nodata",
      });
      setTimeout(() => {
        alert(result.message);
      }, 800);
    }
  } catch (e) {
    yield put({
      type: ApiConstants.constants.NOTIFICATION_CHAT_ERROR,
      paylod: e,
    });
    setTimeout(() => {
      e.message;
    });
  }
}
export function* oneToOneChatSaga(action) {
  try {
    const result = yield call(
      FetchApi.oneToOneChat,
      action.receiver_id,
      action.message,
      action.chatType
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_ONE_TO_ONE_CHAT_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_ONE_TO_ONE_CHAT_UNAUTHENTICATED,
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
        type: ApiConstants.constants.API_ONE_TO_ONE_CHAT_FAIL,
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
      type: ApiConstants.constants.API_ONE_TO_ONE_CHAT_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* terminalChatSaga(action) {
  try {
    const result = yield call(FetchApi.terminalChat, action.id, action.message);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_TERMINAL_CHAT_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_TERMINAL_CHAT_UNAUTHENTICATED,
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
        type: ApiConstants.constants.API_TERMINAL_CHAT_FAIL,
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
      type: ApiConstants.constants.API_TERMINAL_CHAT_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* terminalChatHistorySaga(action) {
  try {
    const result = yield call(
      FetchApi.terminalChatHistory,
      action.id,
      action.offset,
      action.limit
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_UNAUTHENTICATED,
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
        type: ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_FAIL,
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
      type: ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
