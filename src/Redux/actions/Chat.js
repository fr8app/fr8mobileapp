import { ApiConstants } from "../../Themes";

export function chatHistoryAction(navigation,text='') {
  const action = {
    type: ApiConstants.constants.API_CHAT_HISTORY_LOAD,
    navigation: navigation,
    text:text
  };
  return action;
}

export function clearChatReducer(){
  const action = {
    type: ApiConstants.constants.API_CHAT_USER_HISTORY_CLEAR_LOAD
  };
  return action;
}
export function chatUserHistoryAction(
  item,
  friendUserId,
  navigation,
  offset,
  limit,
  online=false,
  loader=true
) {
  const action = {
    type: ApiConstants.constants.API_CHAT_USER_HISTORY_LOAD,
    item: item,
    friendUserId: friendUserId,
    navigation: navigation,
    offset: offset,
    limit: limit,
    online:online,
    loader:loader
  };
  return action;
}

export function oneToOneChatAction(receiver_id, message, chatType, navigation) {
  const action = {
    type: ApiConstants.constants.API_ONE_TO_ONE_CHAT_LOAD,
    receiver_id: receiver_id,
    message: message,
    chatType: chatType,
    navigation: navigation,
  };
  return action;
}

export function addNotificationMessage(data) {
  const action = {
    type: ApiConstants.constants.NOTIFICATION_MESSAGE,
    data: data,
  };
  return action;
}

export function terminalChatAction(message, id, navigation) {
  const action = {
    type: ApiConstants.constants.API_TERMINAL_CHAT_LOAD,
    message: message,
    id: id,
    navigation: navigation,
  };
  return action;
}

export function terminalChatHistoryAction(id, navigation, offset, limit) {
  const action = {
    type: ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_LOAD,
    id: id,
    navigation: navigation,
    offset: offset,
    limit: limit,
  };
  return action;
}
export function updateFriendID() {
  const action = {
    type: ApiConstants.constants.UPDATE_FRIEND_ID,
  };
  return action;
}
export function updateFriendIDInTerminal() {
  const action = {
    type: 'UPDATE_FRIEND_ID_TERMINAL',
  };
  return action;
}

export function clearNotifyArray(notifyData) {
  const action = {
    type: "ApiConstants.constants.UPDATE_FRIEND_ID",
    notifyData: notifyData,
  };
  return action;
}
export function PushChatNotification(data) {
  return {
    type: ApiConstants.constants.NOTIFICATION_CHAT_INIT,
    payload: data,
  };
}
// NOTIFICATION_CHAT_INIT: 'NOTIFICATION_CHAT_INIT',
//   NOTIFICATION_CHAT_SUCCESS: 'NOTIFICATION_CHAT_SUCCESS',
//   NOTIFICATION_CHAT_ERROR: 'NOTIFICATION_CHAT_ERROR',
