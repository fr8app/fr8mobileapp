import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager,FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null,
  isLogOut: false
};

function logOut(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_LOG_OUT_LOAD:
      return { ...state, onLoad: true, isLogOut: true };

    case ApiConstants.constants.API_LOG_OUT_SUCCESS:
      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        isLogOut: true,
      };
      case "API_DELETE_ACCOUNT_LOAD":
        return {
          ...state,
          onLoad: true,
          
        };
    case "API_DELETE_ACCOUNT_SUCCESS":
      DataManager.clearData()
      FetchApi.setAccessToken('')
      const resetActionss = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      });
      return {
        ...state,
        onLoad: false,
        status: action.status,
        isLogOut: true,
        navigation: action.navigation.dispatch(resetActionss)
      };
      case "API_DELETE_ACCOUNT_FAIL":
        return {
          ...state,
          onLoad: false,
        };
      case "API_DELETE_ACCOUNT_ERROR":
        return {
          ...state,
          onLoad: false,
          
        };
    case ApiConstants.constants.API_LOG_OUT_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED:
      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        isLogOut: true,
      };

    case ApiConstants.constants.API_LOG_OUT_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    default:
      return state;
  }
}
export default logOut;
