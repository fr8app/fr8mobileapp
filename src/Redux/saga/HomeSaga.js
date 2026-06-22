import { put, call, delay, select } from "redux-saga/effects";
import { FetchApi } from "../../Components";
import { ApiConstants } from "../../Themes";
import {
  onReachEndterminalSucess,
  onReachEndTerminal,
  onReachEndTerminalError,
} from "../actions/Home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { StackActions } from "@react-navigation/native";
export function* homeApiSaga(action) {
  try {
    yield delay(500);
    const result = yield call(FetchApi.home, action.lat, action.long);
    // console.log('homeddd',result)
    yield delay(500);
    if (result.status === 1) {
      console.log("home_Success", result);
      yield put({
        type: ApiConstants.constants.API_HOME_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // yield put({ type: ApiConstants.constants.SET_HOME_CHAT_COUNT, result: result});
    }
    // else if (result.status === 3 || result.status == 4) {
    //   yield put({ type: ApiConstants.constants.API_HOME_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
    //   result.status === 3 ?
    //     setTimeout(() => { alert("Session timed out.") }, 800)
    //     :
    //     setTimeout(() => { alert(result.result.message) }, 800)
    // }
    else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      const resetActions = StackActions.replace("FavouriteTerminal2");
      action.navigation.dispatch(resetActions);
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_HOME_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_HOME_ERROR, error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* homeDetailApiSaga(action) {
  try {
    yield delay(500);
    const result = yield call(FetchApi.homeDetail);
    console.log("homedddetail", result);
    yield delay(500);
    if (result.status === 1) {
      console.log("home_Success", result);
      yield put({
        type: "API_HOME_DETAIL_SUCCESS",
        result: result,
        navigation: action.navigation,
      });
      yield put({
        type: ApiConstants.constants.SET_HOME_CHAT_COUNT,
        result: result,
      });
    }
    // else if (result.status === 3 || result.status == 4) {
    //   yield put({ type: ApiConstants.constants.API_HOME_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
    //   result.status === 3 ?
    //     setTimeout(() => { alert("Session timed out.") }, 800)
    //     :
    //     setTimeout(() => { alert(result.result.message) }, 800)
    // }
    else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      const resetActions = StackActions.replace("FavouriteTerminal2");
      action.navigation.dispatch(resetActions);
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    } else {
      yield put({
        type: "API_HOME_DETAIL_FAIL",
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("eeeeee", error);
    yield put({ type: "API_HOME_DETAIL_ERROR", error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* favTerminalApiSaga(action) {
  try {
    yield delay(500);
    const result = yield call(FetchApi.favTerminal, action.list, action.id);
    yield delay(500);
    if (result.status === 1) {
      console.log("home_Success", result);
      yield put({
        type: "API_FAV_TERMINAL_SUCCESS",
        result: result,
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
        type: "API_FAV_TERMINAL_FAIL",
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("eeeeee", error);
    yield put({ type: "API_FAV_TERMINAL_ERROR", error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* geoFenceSaga(action) {
  try {
    const result = yield call(
      FetchApi.geoFences,
      action.latitude,
      action.longitude
    );
    console.log("geofence_Success", result);
    if (result.status === 1) {
      console.log("geofence_Success", result);
      yield put({
        type: "API_GET_GEOFENCES_SUCCESS",
        result: result.result.data,
      });
      AsyncStorage.setItem(
        "geoFenceCalled",
        JSON.stringify(moment(new Date()))
      );
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      const resetActions = StackActions.replace("FavouriteTerminal2");
      action.navigation.dispatch(resetActions);
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({ type: "API_GET_GEOFENCES_FAIL", result: result });
    }
  } catch (error) {
    yield put({ type: "API_GET_GEOFENCES_ERROR" });
  }
}
export function* regionListSaga(action) {
  try {
    const result = yield call(FetchApi.regionList, action.list, action.id);
    console.log("regionSuccess", result);
    if (result.status === 1) {
      console.log("regionSuccess", result);
      yield put({
        type: "API_REGION_LIST_SUCCESS",
        result: result.result.data,
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
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({ type: "API_REGION_LIST_FAIL", result: result });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("error", error);
    yield put({ type: "API_REGION_LIST_ERROR" });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* regionSetSaga(action) {
  try {
    const result = yield call(FetchApi.regionListSet, action.list, action.id);
    console.log("regionSuccess", result);
    if (result.status === 1) {
      console.log("regionSuccess", result);
      yield put({
        type: "API_SET_FAV_REGION_SUCCESS",
        result: result.result.data,
      });
      setTimeout(() => {
        if (action.FromOnBoarding) {
          action.navigation.replace("FR8");
        } else {
          action.navigation.goBack();
        }
      }, 300);
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      const resetActions = StackActions.replace("FavouriteTerminal2");
      action.navigation.dispatch(resetActions);
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({ type: "API_SET_FAV_REGION_FAIL" });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("error", error);
    yield put({ type: "API_SET_FAV_REGION_ERROR" });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* reachEndTerminalSaga({ payload }) {
  try {
    const result = yield call(FetchApi.onReachEndTerminal, payload);
    if (result.status === 1) {
      //  yield put(onReachEndterminalSucess(result.result))
      yield put({
        type: ApiConstants.constants.API_ON_REACH_END_TERMINAL_SUCCESS,
        payload: result.result,
      });
    } else if (result.status === 3 || result.status == 4) {
      yield put({
        type: ApiConstants.constants.API_HOME_UNAUTHENTICATED,
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
        type: ApiConstants.constants.API_HOME_FAIL,
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
      type: ApiConstants.constants.API_ON_REACH_END_TERMINAL_ERROR,
      payload: { error: error, errorMsg: error.result },
    });
  }
}
export function* notificationNearTerminalSaga({ payload, extra }) {
  try {
    //  console.log('called saga notification near terminal ', payload, extra)
    yield delay(500);
    const result = yield call(FetchApi.nearTerminal, payload, extra);

    // console.log(result, 'hola result !!!!!!!!!!!!!!!!')
    if (result.status === 1) {
      AsyncStorage.removeItem("terminalDetail");
      if (extra === "storage") {
        // AsyncStorage.removeItem('terminalDetail')
        yield put({
          type: ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_SUCCESS,
          payload: result,
        });
      }
      yield put({
        type: ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_SUCCESS,
        payload: result,
      });
    } else if (result.status == 2) {
      AsyncStorage.removeItem("terminalDetail");
    } else {
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (e) {
    yield put({
      type: ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_ERROR,
      payload: e,
    });
  }
}
export function* searchHomeTerminalSaga({ payload, showError, navigation }) {
  try {
    yield console.log("saga calle", payload, navigation);
    const result = yield call(FetchApi.searchHomeTerminal, {
      terminal_name: payload,
    });
    console.log("res", result);
    if (result.status === 1) {
      if (result.result.data.list_terminals.length === 0) {
        // setTimeout(() => { alert("No Terminal Found.") }, 800)
        if (showError == true) {
          setTimeout(() => {
            alert(result.result.message);
          }, 800);
        }
      }
      yield put({
        type: ApiConstants.constants.API_HOME_SUCCESS,
        payload: result.result.data,
        termialSearch: payload,
      });
    } else if (result.status === 3 || result.status == 4) {
      yield put({
        type: ApiConstants.constants.API_HOME_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_HOME_FAIL,
        result: result,
        status: result.status,
      });

      // setTimeout(() => { alert(result.result.message) }, 800)
    }
  } catch (error) {
    // console.log('hello error',error)
    yield put({ type: ApiConstants.constants.API_HOME_ERROR, error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* DeleteFavTerminal(props) {
  try {
    const result = yield call(
      FetchApi.deleteFavTerminalApi,
      props?.terminalId,
      props?.userId
    );
    if (result.status === 1) {
      yield put({
        type: "DELETE_FAV_TERMINAL_SUCCESS",
        payload: props?.terminalId,
      });
    } else if (result.status === 3 || result.status == 4) {
      yield put({
        type: ApiConstants.constants.API_HOME_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: props.navigation,
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
        type: "DELETE_FAV_TERMINAL_FAIL",
        result: result,
        status: result.status,
      });
    }
  } catch (error) {
    console.log("::::error", error, props?.terminalId);
    yield put({ type: ApiConstants.constants.API_HOME_ERROR, error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
