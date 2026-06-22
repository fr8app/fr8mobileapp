import { StackActions } from "@react-navigation/native";
import { ApiConstants } from "../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager,FetchApi } from "./../../Components";

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null,
  selectedItem: null,
  nextPageUrl: null,
  currentPageValue: 1,
  total: 0
};

function terminalChatHistory(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_SUCCESS:
      let result = state.result;
      if (state.result.length < 0) {
        result = action.result.result.data.data;
      } else {
        for (let i in action.result.result.data.data) {
          result.push(action.result.result.data.data[i]);
        }
      }
      return {
        ...state,
        onLoad: false,
        result: result,
        status: action.status,
        nextPageUrl: action.result.result.data.next_page_url,
        currentPageValue: action.result.result.data.current_page,
        lastPageValue: action.result.result.data.last_page,
        total: action.result.result.data.total
      };

    case ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })],
      // });
      const resetAction= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: action.result,
        error: null,
        status: action.status,
        navigation: action.navigation.dispatch(resetAction),
      };

    case ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_TERMINAL_CHAT_SUCCESS:
      state.result.unshift(action.result.result.data);
      return { ...state, onLoad: false };

    case 'UPDATE_FRIEND_ID_TERMINAL':
      return {
        ...state,
        onLoad: false,
        nextPageUrl: null,
        result: [],
        currentPageValue: 1,
      };
    default:
      return state;
  }
}
export default terminalChatHistory;
