import { TerminalModal } from "./../../Components";
import { ApiConstants, AppConstants } from "./../../Themes";
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

function searchTerminal(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_SEARCH_TERMINAL_LOAD:
      if (action.terminal_name == "") {
        return { ...state, onLoad: true, result: [] };
      } else {
        return { ...state, onLoad: true };
      }
    case ApiConstants.constants.API_SEARCH_TERMINAL_SUCCESS:
      let terminals = TerminalModal.TerminalModal.getTerminalData(
        action.result.result.data.list_terminals
      );
    
      return {
        ...state,
        onLoad: false,
        result: terminals,
        status: action.status
      };

    case ApiConstants.constants.API_SEARCH_TERMINAL_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_SEARCH_TERMINAL_UNAUTHENTICATED:
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
        result: [],
        status: action.status,
        navigation: action.navigation.dispatch(resetAction)
      };

    case ApiConstants.constants.API_SEARCH_TERMINAL_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_SUCCESS:
      if (state.result.length > 0) {
        if (state.result[action.index].is_follow == 0) {
          state.result[action.index].is_follow = 1;
          state.result[action.index].followers_count =
            Number(state.result[action.index].followers_count) + Number(1);
        } else {
          state.result[action.index].is_follow = 0;
          state.result[action.index].followers_count =
            Number(state.result[action.index].followers_count) - Number(1);
        }
      }
      return { ...state, onLoad: false };

    default:
      return state;
  }
}
export default searchTerminal;
