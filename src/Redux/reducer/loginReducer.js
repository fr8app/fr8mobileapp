import { ApiConstants } from "./../../Themes";
import { DataManager, FetchApi } from "./../../Components";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null,
  viewIndex: 2,
  keyValue: null,
  playerStop: null,
  loggedIn:false,
  userExistData:null
};

function login(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_LOGIN_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_LOGIN_SUCCESS:

    console.log('action.result.result.data',action.result.result.data);
      FetchApi.setAccessToken(action.result.result.data.access_token);
      DataManager.setAccessToken(action.result.result.data.access_token);
      DataManager.setUserDetails(action.result.result);
      state.keyValue = action.loginData.keydata;
      return {
        ...state,
        onLoad: false,
        playerStop: state.keyValue == "login" ? false : true,
        result: action.result.result,
        status: action.status,
        // navigation:
        //   state.keyValue == "login" ?action.result.result.data.selectedRegions.length==0?action.navigation.replace("Regions") :action.navigation.replace("FR8") : null
      };

    case ApiConstants.constants.API_LOGIN_FAIL:
      return {
        ...state,
        onLoad: false,
        playerStop: true,
        error: action.error,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_LOGIN_ERROR:
      return {
        ...state,
        onLoad: false,
        playerStop: true,
        error: action.error,
        status: action.status,
        navigation: null
      };
      
    case "API_LOGIN_WITH_USERNAME_SUCCESS":
      console.log('success');
      return {
        ...state,
        onLoad: false,
        loggedIn:true
      };
    case "API_PASSWORD_SET_SUCCESS":
      console.log('success');
      return {
        ...state,
        onLoad: false,
        loggedIn:true
      };
    case "API_VERIFY_OTP_FOR_PASSWORD_SUCCESS":
      console.log('success');
      return {
        ...state,
        onLoad: false,
        loggedIn:true
      };
      case ApiConstants.constants.PROFILE_DATA_SUCCESS:
        return{
          ...state,
          onLoad: false,
          loggedIn:false
        }
    default:
      return state;
  }
}

export default login;
