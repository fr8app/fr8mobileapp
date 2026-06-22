import { ApiConstants } from "./../../Themes";
import { DataManager, FetchApi } from "./../../Components";
import { DeviceEventEmitter } from "react-native";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
};

function appVersion(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_APPVERSION_LOAD:
      return { ...state,  };

    case ApiConstants.constants.API_APPVERSION_SUCCESS:
        console.log(action,'appversion action')
        DeviceEventEmitter.emit('appVersion', action?.result)
     
      return {
        ...state,
        onLoad: false,
        result:action.result
        };

    case ApiConstants.constants.API_APPVERSION_FAIL:
      return {
        ...state,
        onLoad: false,
       
      };

    case ApiConstants.constants.API_APPVERSION_ERROR:
      return {
        ...state,
        onLoad: false,
    
      };

    default:
      return state;
  }
}

export default appVersion;
