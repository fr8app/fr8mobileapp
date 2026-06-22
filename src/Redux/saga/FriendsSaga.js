import { StackActions } from "@react-navigation/native";
import { Alert } from "react-native";
import { put, call } from "redux-saga/effects";
import { FetchApi } from "../../Components";
import { ApiConstants } from "../../Themes";

export function* FriendApiSaga(action) {
  try {
    const result = yield call(FetchApi.friendsList);
    // console.log(result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_FRIENDS_SUCCESS,
        result: result?.data,
        status: result.status,
        navigation: action.navigation
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_FRIENDS_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_FRIENDS_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_FRIENDS_ERROR, error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* MyFriendApiSaga(action) {
  // console.log(action);
  try {
    const result = yield call(FetchApi.myFriends, action.allContacts);
    if (result.status === 1) {
      // console.log('geting%%%%%%%%%%%%%%%%%%%%%%')
      yield put({
        type: ApiConstants.constants.API_MY_FRIENDS_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_MY_FRIENDS_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_MY_FRIENDS_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    // console.log(error);
    yield put({
      type: ApiConstants.constants.API_MY_FRIENDS_ERROR,
      error: error
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* pendingFreindRequestApiSaga(action) {
  try {
    const result = yield call(FetchApi.pendingFriendRequest);
    // console.log(result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_PENDING_FRIEND_REQUEST_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_PENDING_FRIEND_REQUEST_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_PENDING_FRIEND_REQUEST_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    // console.log(error);
    yield put({
      type: ApiConstants.constants.API_PENDING_FRIEND_REQUEST_ERROR,
      error: error
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* friendRequestApiSaga(action) {
  try {
    const result = yield call(FetchApi.friendRequest, action.id, action.status);
    console.log('result',result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_FRIEND_REQUEST_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        index: action.index,
        frontStatus:action.status
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_FRIEND_REQUEST_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else if (result.status == 6) {
      yield put({
        type: ApiConstants.constants.API_CANCEL_FRIEND_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        // alert("Operation failed. Please try again later.");
        alert(result.result.message);
      }, 800);
    } else {
      // console.log(result,'kjhsdajhdhdshdas');
      yield put({
        type: ApiConstants.constants.API_FRIEND_REQUEST_FAIL,
        result: result,
        index:action.index,
        status: result.status,
        isBlocked:result?.result?.data?.is_blocked,
        navigation: action.navigation
      });
      setTimeout(() => {
        if(result?.result?.data?.is_blocked){
          Alert.alert(
            'Alert',
            result.result.message,
            [
              {
                text:"OK",onPress:()=>{action?.navigation?.goBack()}
              }
            ]
          )
                  }
                  else{
        alert(result.result.message);
                  }
      }, 800);
    }
  } catch (error) {
    console.log(error);
    yield put({
      type: ApiConstants.constants.API_FRIEND_REQUEST_ERROR,
      error: error
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* addFriendApiSaga(action) {
  try {
    const result = yield call(FetchApi.addFriend, action.id);
    console.log('resultcdmnddfdfs',result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_ADD_FRIEND_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_ADD_FRIEND_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_ADD_FRIEND_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        if(result?.result?.data?.is_blocked){
Alert.alert(
  'Alert',
  result.result.message,
  [
    {
      text:"OK",onPress:()=>{action.navigation.goBack()}
    }
  ]
)
        }
        else{

          alert(result.result.message);
        }
      }, 800);
    }
  } catch (error) {
    // console.log(error);
    yield put({
      type: ApiConstants.constants.API_ADD_FRIEND_ERROR,
      error: error
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* cancelFriendApiSaga(action) {
  try {
    const result = yield call(FetchApi.cancelFriend, action.id);
    // console.log("cancelFriendApiSaga", result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_CANCEL_FRIEND_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        id: action.id
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_CANCEL_FRIEND_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else if (result.status == 6) {
      yield put({
        type: ApiConstants.constants.API_CANCEL_FRIEND_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        // alert("Operation failed. Please try again later.");
        alert(result.result.message);
      }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_CANCEL_FRIEND_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        if(result?.result?.data?.is_blocked){
          Alert.alert(
            'Alert',
            result.result.message,
            [
              {
                text:"OK",onPress:()=>{action.navigation.goBack()}
              }
            ]
          )
                  }
                  else{
        alert(result.result.message);
                  }
      }, 800);
    }
  } catch (error) {
    // console.log("cancelFriendApiSaga err", error);
    yield put({
      type: ApiConstants.constants.API_CANCEL_FRIEND_ERROR,
      error: error
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* removeFriendApiSaga(action) {
  try {
    const result = yield call(FetchApi.removeFriend, action.id);
    console.log(result,'on un frienf friend');
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_REMOVE_FRIEND_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        id: action.id
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_REMOVE_FRIEND_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      const resetAction= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetAction)
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_REMOVE_FRIEND_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      setTimeout(() => {
        if(result?.result?.data?.is_blocked){
          Alert.alert(
            'Alert',
            result.result.message,
            [
              {
                text:"OK",onPress:()=>{action.navigation.goBack()}
              }
            ]
          )
                  }
                  else{
        alert(result.result.message);
                  }
      }, 800);
    }
  } catch (error) {
    // console.log(error);
    yield put({
      type: ApiConstants.constants.API_REMOVE_FRIEND_ERROR,
      error: error
    });
    setTimeout(() => {
      console.log('error',error);
      alert(error.result);
    }, 800);
  }
}
