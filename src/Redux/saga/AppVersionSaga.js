import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter, Linking, Platform } from "react-native";
import { put, call } from "redux-saga/effects";
import { FetchApi, DataManager } from "../../Components";
import { ApiConstants } from "../../Themes";

export function* appVersionFuncSaga(action) {
  console.log('number>>>', action)
  try {
    const result = yield call(
      FetchApi.appVersionApi
    );
    console.log('App Version result >>>>>> ', result);
    if (result.status === 1) {
        
        yield put({
        type: ApiConstants.constants.API_APPVERSION_SUCCESS,
        result: result.result.data,
        
      });
    } else {
      yield put({ type: ApiConstants.constants.API_APPVERSION_FAIL });
      setTimeout(() => {
        // alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log('App Version result eroror >>>>>> ', error);

    yield put({
      type: ApiConstants.constants.API_APPVERSION_ERROR,
      error: error,
      status: error.status
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

