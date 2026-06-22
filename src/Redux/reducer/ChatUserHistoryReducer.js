import { Platform } from "react-native";
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
  index: null,
  notificaionData: null,
  friendUserId: null,
  nextPageUrl: null,
  currentPageValue: 1,
  total: 0
};

function chatUserHistory(state = initialState, action) {
  switch (action.type) {

    case ApiConstants.constants.API_CHAT_USER_HISTORY_CLEAR_LOAD:

      return {
        ...state,
        result: []
      };

    case ApiConstants.constants.API_CHAT_USER_HISTORY_LOAD:
      if (state.currentPageValue == 1) {
        return {
          ...state,
          onLoad: action.loader,
          index: action.index,
          friendUserId: action.friendUserId,
          currentPageValue: action.page,
        };
      } else {
        return {
          ...state,
          onLoad: true,
          index: action.index,
          friendUserId: action.friendUserId,
          currentPageValue: action.page,
        };
      }

    case ApiConstants.constants.API_CHAT_USER_HISTORY_SUCCESS:
     
      let result = state.result;
      if (action.online == true) {
      }
      else {
        if (state.currentPageValue == 1) {
          result = action.result.result.data.data;
        } else {
          for (let i in action.result.result.data.data) {
            result.push(action.result.result.data.data[i]);
          }
        }

      }

      return {
        ...state,
        onLoad: false,
        result: result,
        status: action.status,
        index: state.index,
        nextPageUrl: action.result.result.data.next_page_url,
        navigation: null,
        currentPageValue: action.result.result.data.current_page,
        lastPageValue: action.result.result.data.last_page,
        total: action.result.result.data.total
      };

    case ApiConstants.constants.API_CHAT_USER_HISTORY_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_CHAT_USER_HISTORY_UNAUTHENTICATED:
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
        result: [],
        status: action.status,
        navigation: action.navigation.dispatch(resetAction),
      };

    case ApiConstants.constants.API_CHAT_USER_HISTORY_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_ONE_TO_ONE_CHAT_SUCCESS:
      let chatResult = action.result.result.data;
      state.result.unshift(chatResult);
      return { ...state, onLoad: false };

    case ApiConstants.constants.NOTIFICATION_MESSAGE:
      let friendUserId = "";
      if (Platform.OS == "ios") {
        friendUserId = action.data.other_user_detail._id;
        state.result.unshift(action.data);
      } else {
        friendUserId = action.data.other_user_detail._id;
        state.result.unshift(action.data);
      }
      return { ...state, onLoad: false, friendUserId: friendUserId };

    case "ApiConstants.constants.UPDATE_FRIEND_ID":
      return { ...state, result: [], notificaionData: action.notifyData };

    case ApiConstants.constants.UPDATE_FRIEND_ID:
      return {
        ...state,
        onLoad: false,
        friendUserId: null,
        nextPageUrl: null,
        result: [],
        currentPageValue: 1,
        nextPageUrl: null,
        notificaionData: null,
      };
    case ApiConstants.constants.NOTIFICATION_CHAT_INIT:
      return {
        ...state,
      };
    case ApiConstants.constants.NOTIFICATION_CHAT_SUCCESS:
      return {
        ...state,
        result: action.payload,
        nextPageUrl: action.result.result.data.next_page_url,

        currentPageValue: action.result.result.data.current_page,
      };
    case ApiConstants.constants.NOTIFICATION_CHAT_ERROR:
      return {
        ...state,
      };
    default:
      return state;
  }
}
export default chatUserHistory;

