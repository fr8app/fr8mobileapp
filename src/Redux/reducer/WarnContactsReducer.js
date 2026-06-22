import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager } from "./../../Components";
import { FetchApi } from "../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null
};

function searchUser(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_WARN_CONTACTS_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_WARN_CONTACTS_SUCCESS:
      console.log('action.resultaction.resultaction.result',action.result);

      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status
      };

    case ApiConstants.constants.API_WARN_CONTACTS_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_WARN_CONTACTS_UNAUTHENTICATED:
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

    case ApiConstants.constants.API_WARN_CONTACTS_ERROR:
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
export default searchUser;
