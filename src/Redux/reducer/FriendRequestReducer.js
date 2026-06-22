import { ApiConstants } from "../../Themes";
import {  DataManager,FetchApi } from "../../Components";
import { StackActions } from "@react-navigation/native";
// import { StackActions, NavigationActions } from "react-navigation";

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null
};

function friendRequest(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_FRIEND_REQUEST_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        onLoad: false,
        result: action.result.result,
        status: action.status
      };

    case ApiConstants.constants.API_FRIEND_REQUEST_FAIL:
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_FRIEND_REQUEST_UNAUTHENTICATED:
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
        result: action.result,
        status: action.status,
        // navigation: action.navigation.dispatch(resetAction)
      };

    case ApiConstants.constants.API_FRIEND_REQUEST_ERROR:
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
export default friendRequest;
