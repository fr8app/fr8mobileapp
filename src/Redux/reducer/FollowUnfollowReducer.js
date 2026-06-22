import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager,FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";
const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null,
  selectedItem: null
};

function home(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_LOAD:
      return { ...state, onLoad: false };

    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_SUCCESS:

      return {
        ...state,
        onLoad: false,
        status: action.status
      };

    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_FAIL:
      return { ...state, onLoad: false, result: [], status: action.status };

    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      const resetAction= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: action.navigation.dispatch(resetAction)
      };

    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    default:
      return state;
  }
}
export default home;
