import { ApiConstants } from '../../Themes';

export function terminalDetailsAction(id, pageValue, navigation, feed) {
    const action = {
        type: ApiConstants.constants.API_TERMINAL_DETAIL_LOAD,
        id: id,
        pageValue: pageValue,
        navigation: navigation,
        feed: feed
    }
    return action;
}
export function addRating(message, rates,id, navigation) {
    const action = {
        type: "API_TERMINAL_RATE_ADD_LOAD",
        id: id,
        rates: rates,
        navigation: navigation,
        message: message
    }
    return action;
}
export function terminalDetailsActionend(id, pageValue, navigation, feed) {
    const action = {
        type: ApiConstants.constants.API_TERMINAL_DETAIL_LOAD_END,
        id: id,
        pageValue: pageValue,
        navigation: navigation,
        feed: feed
    }
    return action;
}
export function setUserNumber(data) {
    const action = {
        type: 'USER_FEACHED_FROM_SOCKET',
        data:data
    }
    return action;
}
export function routePostLIstByTerminal(data,navigation,userId,index=0) {
    const action = {
        type: 'API_TIMELINEPOST_BY_TERMINAL_LOAD',
        data:data,
        navigation:navigation,
        index,
        userId
    }
    return action;
}
export function checkinPostLIstByTerminal(data,navigation,index=0) {
    const action = {
        type: 'API_CHECKIN_BY_TERMINAL_LOAD',
        data:data,
        navigation:navigation,
        index
    }
    return action;
}
export function ratingLIstByTerminal(data,navigation,index=0) {
    const action = {
        type: 'API_RATING_BY_TERMINAL_LOAD',
        data:data,
        navigation:navigation,
        index
    }
    return action;
}

export function videoUploadAction(id,latitude,longitude, source, thumbnail, description, navigation, disscreen,video='',location='',tagUser='',userId,isLogin=false) {
    const action = {
        type: ApiConstants.constants.API_VIDEO_UPLOAD_LOAD,
        id: id,
        source: source,
        thumbnail: thumbnail,
        description,
        navigation: navigation,
        screen: disscreen,
        video:video,
        location:location,
        tagUser:tagUser,
        latitude:latitude,
        longitude:longitude,
        userId:userId,
        isLogin
    }
    return action;
}
export function videoUploadEditAction(id,latitude,longitude, source, thumbnail, description, navigation, disscreen,video='',location='',tagUser='',_id,deletedImagesId,isVideoDeleted) {
    
    const action = {
        type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_LOAD,
        id: id,
        source: source,
        thumbnail: thumbnail,
        description,
        navigation: navigation,
        screen: disscreen,
        video:video,
        location:location,
        tagUser:tagUser,
        deletedImagesId:deletedImagesId,
        isVideoDeleted:isVideoDeleted,
        _id:_id,
        latitude:latitude,
        longitude:longitude
    }
    return action;
}
export function ShareEditAction( description, navigation,_id,mainDescriptions,item) {
    
    const action = {
        type: "API_SHARE_EDIT_LOAD",
        description,
        navigation: navigation,
        _id:_id,
        mainDescriptions:mainDescriptions,
        item:item
    }
    return action;
}

export function likeDislikeAction(id, isLike, index, likeDislikeType, navigation) {
    const action = {
        type: ApiConstants.constants.API_LIKE_DISLIKE_LOAD,
        id: id,
        isLike: isLike,
        index: index,
        likeDislikeType: likeDislikeType,
        navigation: navigation
    }
    return action;
}

export function followUnfollowTerminalAction(terminalId, isFollow, index, navigation) {

    const action = {
        type: ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_LOAD,
        terminalId: terminalId,
        isFollow: isFollow,
        index: index,
        navigation: navigation
    }
    return action;
}

export function clearTerminalDetail() {

    const action = {
        type: ApiConstants.constants.CLEAR_TERMINAL_DETAIL,
    }
    return action;
}

export function videoPlayAction(item, index, likeDislikeType, navigation) {
    const action = {
        type: ApiConstants.constants.API_VIDEO_PLAY_LOAD,
        item: item,
        index: index,
        likeDislikeType: likeDislikeType,
        navigation: navigation
    }
    return action;
}
export function terminalPostReportAction(data) {
    return {
        type: ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_INITIATE,
        payload: data
    }
}

export function deleteTerminalVideo(data) {
    return {
        type: ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_INITATE,
        payload: data,
    }
}
export function setTaggedFriend(friends) {
    return {
        type: "ALREADY_SELECTED_FRIENDS",
        friends: friends,
    }
}