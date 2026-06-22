import { ApiConstants } from '../../Themes';

function friendsAction() {
    const action = {
        type: ApiConstants.constants.API_FRIENDS_LOAD
    }
    return action;
}

function myFriendAction(allContacts, navigation) {
    const action = {
        type: ApiConstants.constants.API_MY_FRIENDS_LOAD,
        allContacts: allContacts,
        navigation: navigation
    }
    return action;
}

function pendingFriendAction(navigation) {
    const action = {
        type: ApiConstants.constants.API_PENDING_FRIEND_REQUEST_LOAD,
        navigation: navigation
    }
    return action;
}

function friendRequestAction(id, status, index, navigation) {
    const action = {
        type: ApiConstants.constants.API_FRIEND_REQUEST_LOAD,
        id: id,
        status: status,
        index: index,
        navigation: navigation
    }
    return action;
}
function addFriendAction(id, navigation) {
    const action = {
        type: ApiConstants.constants.API_ADD_FRIEND_LOAD,
        id: id,
        navigation: navigation
    }
    return action;
}

function cancelFriendAction(id, navigation) {
    const action = {
        type: ApiConstants.constants.API_CANCEL_FRIEND_LOAD,
        id: id,
        navigation: navigation
    }
    return action;
}

function removeFriendAction(id, navigation) {
    const action = {
        type: ApiConstants.constants.API_REMOVE_FRIEND_LOAD,
        id: id,
        navigation: navigation
    }
    return action;
}
function updateUserDetail(item) {
    const action = {
        type: "ApiConstants.constants.API_REMOVE_FRIEND_LOAD",
        item: item,
    }
    return action;
}

module.exports = {
    friendsAction,
    myFriendAction,
    pendingFriendAction,
    friendRequestAction,
    addFriendAction,
    cancelFriendAction,
    removeFriendAction,
    updateUserDetail
}