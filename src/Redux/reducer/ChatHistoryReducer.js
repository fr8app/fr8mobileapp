import { StackActions } from "@react-navigation/native";
import { ChatModal,DataManager } from "./../../Components";
import { ApiConstants,FetchApi } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null,
  index: null,
  chatCounterget: 0,
  search:""
};

function updateArray(data, getResult) {
  let result = getResult;
  for (let i in result) {
    if (result[i].chat_id == data.chat_id) {
      let jsonUpdate = {
        chat_id: data.chat_id,
        created_at: data.created_at,
        message: data.message,
        other_user_detail: result[i].other_user_detail,
        receiver_id: data.receiver_id,
        sender_id: data.sender_id,
      };
      result[i] = jsonUpdate;
    }
  }
  return result;
}

function notifyDataUpdate(data, getResult) {
  let result = getResult;
  for (let i in result) {
    if (result[i].chat_id == data.user_details.id) {
      let jsonUpdate = data;
      result[i] = jsonUpdate;
    }
  }
  return result;
}

function chatHistory(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_CHAT_HISTORY_LOAD:
      return { ...state, onLoad: true, index: action.index };

    case ApiConstants.constants.API_CHAT_HISTORY_SUCCESS:
      let chatCounterData = 0;
      action.result.result.data.chat_history.map((item) => {
        chatCounterData = chatCounterData + item?.unread;
      });
      let result = ChatModal.getChatData(
        action.result.result.data.chat_history
      );
      return {
        ...state,
        onLoad: false,
        result: result,
        status: action.status,
        index: state.index,
        chatCounterget: chatCounterData,
        navigation: null,
        search:action.search
      };
    case ApiConstants.constants.SET_HOME_CHAT_COUNT:
      console.log('action.result.result.unread',action.result.result?.data?.unread);
      return {
        ...state,
        onLoad: false,
        chatCounterget: action.result.result?.data?.unread,
      };
    case ApiConstants.constants.API_CHAT_HISTORY_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_CHAT_HISTORY_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })],
      // });
      // const resetAction= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        // navigation: action.navigation.dispatch(resetAction),
      };

    case ApiConstants.constants.API_CHAT_HISTORY_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_ONE_TO_ONE_CHAT_SUCCESS:
      let messageUpdate = updateArray(action.result.result.data, state.result);
      state.result = messageUpdate;
      return { ...state, onLoad: false };

    default:
      return state;
  }
}
export default chatHistory;
