import { ApiConstants } from "../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import DataManager from "../../Components/DataManager";
import {FetchApi} from "../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null
};

function cancelFriend(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_CANCEL_FRIEND_LOAD:
      return { ...state, onLoad: true };
    case ApiConstants.constants.API_CANCEL_FRIEND_SUCCESS:
      return {
        ...state,
        onLoad: false,
        result: action.result.result,
        status: action.status,
        navigation: null
      };
    case ApiConstants.constants.API_CANCEL_FRIEND_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      // const resetAction= StackActions.replace('FavouriteTerminal2')
      // action.navigation.dispatch(resetAction)
      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        // navigation: action.navigation.dispatch(resetAction)
      };
    case ApiConstants.constants.API_CANCEL_FRIEND_FAIL:
      return {
        ...state,
        onLoad: false,
        result: action.error,
        result: null,
        status: action.status,
        navigation: null
      };
    case ApiConstants.constants.API_CANCEL_FRIEND_ERROR:
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
export default cancelFriend;
