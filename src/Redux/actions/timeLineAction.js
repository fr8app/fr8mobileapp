import { AFLogEvent } from '../../Config/aws';
import { ApiConstants } from '../../Themes';
function timeLineGetAction(navigation, page, loader = true) {
    AFLogEvent("timeLineGetAction", { action: 'timeLineGetAction' })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_GET_LOAD,
        navigation: navigation,
        page: page,
        loader: loader
    }
    return action
}

function addTimeLinePost(id, latitude, longitude, message, navigation, location, friends = [],userId) {
    AFLogEvent("addTimeLinePost", { action: 'addTimeLinePost',id:id })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_ADD_LOAD,
        id: id,
        message: message,
        navigation: navigation,
        location: location,
        friends: friends,
        latitude,
        longitude,userId
    }
    return action
}
function timelinePostLikeAction(id, value, navigation, isLike, likeType, loader = true) {
    AFLogEvent("timelinePostLikeAction", { action: 'timelinePostLikeAction',id:id })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_LIKE_LOAD,
        id: id,
        value: value,
        navigation: navigation,
        isLike: isLike,
        loader: loader,
        likeType: likeType
    }
    return action
}
function timeLineShare(id, message, navigation) {
    AFLogEvent("timeLineShare", { action: 'timeLineShare' })
    const action = {
        type: ApiConstants.constants.API_TIMELINE_SHARE_LOAD,
        message: message,
        id: id,
        navigation: navigation
    }
    return action
}
function sharedUserList(item, navigation) {
    const action = {
        type: ApiConstants.constants.API_TIMELINE_SHARE_LIST_LOAD,
        item: item,
        navigation: navigation
    }
    return action
}

//like user list action
function likedUserList(item, navigation, types, category) {
    console.log('item, navigation,types', item, navigation, types, category);
    const action = {
        type: ApiConstants.constants.API_TIMELINE_LIKE_LIST_LOAD,
        item: item,
        navigation: navigation,
        types: types,
        category: category
    }
    return action
}
function timeLineComment(id, message, navigation, commentId) {
    AFLogEvent("timeLineComment", { action: 'timeLineComment',id:id })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_COMMENT_LOAD,
        id: id,
        message: message,
        commentId: commentId,
        navigation: navigation
    }
    return action
}
function timeLinePostDetail(id, navigation, commentId = "") {
    const action = {
        type: ApiConstants.constants.API_TIMELINE_POST_DETAIL_LOAD,
        id: id,
        navigation: navigation,
        commentId: commentId
    }
    return action
}
// function timeLinePostDetail() {
//     const action = {
//         type: "TIMELINE_DETAIL_CLEAR",

//     }
//     return action
// }
function deleteComemnt(id, index, navigation, postId, commentId = null) {
    AFLogEvent("deleteComemnt", { action: 'deleteComemnt',id:id })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_LOAD,
        id: id,
        index: index,
        commentId: commentId,
        navigation: navigation,
        postId: postId
    }
    return action
}
function EditCommentAction(item, message, navigation) {
    AFLogEvent("EditCommentAction", { action: 'EditCommentAction',item:item })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_COMMENT_EDIT_LOAD,
        item: item,
        message: message,
        navigation: navigation,
    }
    return action
}

function commentLikeAction(postId, id, index, isLike, navigation, commentId = null, types) {
    AFLogEvent("commentLikeAction", { action: 'commentLikeAction',id:id })

    const action = {
        type: ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_LOAD,
        id: id,
        index: index,
        isLike: isLike,
        types: types,
        commentId: commentId,
        navigation: navigation,
        postId: postId
    }
    return action
}
function deleteTimeLinePost(id, navigation) {
    AFLogEvent("deleteTimeLinePost", { action: 'deleteTimeLinePost',id:id })

    const action = {
        type: 'API_TIMELINE_POST_DELETE_LOAD',
        id: id,
        navigation: navigation,
    }
    return action
}
function timeLinePostDetailClear() {
    const action = {
        type: 'CLEAR_TIMELINE_DETAIL',

    }
    return action
}
function updateImageVideoCount(count, key) {
    const action = {
        type: 'UPDATE_IMAGE_VIDEO_COUNT',
        count,
        key

    }
    return action
}

function updateData(data, key) {
    const action = {
        type: 'UPDATE_DATA',
        data,
        key
    }
    return action
}
module.exports = {
    timeLineGetAction,
    addTimeLinePost,
    timelinePostLikeAction,
    timeLineShare,
    timeLineComment,
    timeLinePostDetail,
    deleteComemnt,
    timeLinePostDetailClear,
    deleteTimeLinePost,
    updateImageVideoCount,
    updateData,
    commentLikeAction,
    sharedUserList,
    likedUserList,
    EditCommentAction
}