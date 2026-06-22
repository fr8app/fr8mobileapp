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
  selectedItem: null,
  phoneContacts: ""
};

function GetContacts(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_GETCONTACT_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_GETCONTACT_SUCCESS:
      return {
        ...state,
        onLoad: false,
        result: action.result.result.data,
        status: action.status
      };

    case "onNextAction":
      state.phoneContacts = action.contactnumber;
      return { ...state };
    case ApiConstants.constants.API_GETCONTACT_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_GETCONTACT_UNAUTHENTICATED:
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

    case ApiConstants.constants.API_GETCONTACT_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_SENTINVITE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_SENTINVITE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: null
      };
    case ApiConstants.constants.API_SENTINVITE_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: null,
        navigation: null
      };
    case ApiConstants.constants.API_SENTINVITE_ERROR:
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
export default GetContacts;
