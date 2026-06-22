import { ApiConstants } from "../../Themes";
import { FetchApi, DataManager } from "../../Components";
import { StackActions } from "@react-navigation/native";
// import { StackActions, NavigationActions } from "react-navigation";
const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null
};

function ChangePassword(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_CHANGE_PASSWORD_LOAD:
      return { ...state, onLoad: true };
    case ApiConstants.constants.API_CHANGE_PASSWORD_SUCCESS:
      FetchApi.setAccessToken("");
      // const resetActions = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      // const resetActions= StackActions.replace('FavouriteTerminal2')
      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        // result: action.result.result,
        // status: action.status,
        // navigation: action.navigation.dispatch(resetActions)
      };
    case ApiConstants.constants.API_CHANGE_PASSWORD_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      // const resetAction= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        // navigation: action.navigation.dispatch(resetAction)
      };
    case ApiConstants.constants.API_CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        onLoad: false,
        result: action.error,
        result: null,
        status: action.status,
        navigation: null
      };
    case ApiConstants.constants.API_CHANGE_PASSWORD_ERROR:
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
export default ChangePassword;
