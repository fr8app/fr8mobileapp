import { ApiConstants } from '../../Themes';

// const ApiConstants = require("../../Themes/ApiConstants")

function RoutePostAction(navigation, page,userId) {
    const action = {
        type: ApiConstants.constants.API_POST_LOAD,
        navigation: navigation,
        page: page,
        userId:userId
    }
    return action
}
function CreatePostAction(id, distance, minute, image, startTime, endTime, navigation,coordinate) {
    const action = {
        type: ApiConstants.constants.API_ROUTE_POST_CREATE_LOAD,
        id: id,
        distance: distance,
        minute, minute,
        image, image,
        startTime: startTime,
        endTime: endTime,
        coordinate:coordinate,
        navigation: navigation
    }
    return action
}
function deleteTimeLineAction(id, navigation) {
    const action = {
        type: ApiConstants.constants.API_ROUTE_DELETE_LOAD,
        id: id,
        navigation: navigation
    }
    return action
}
function EditTimeLineAction(start,end,image,id,distance,time,terminalId,navigation) {
    const action = {
        type: ApiConstants.constants.API_ROUTE_EDIT_LOAD,
        start:start,
        end:end,
        image:image,
        id: id,
        distance:distance,
        time:time,
        terminalId:terminalId,
        navigation: navigation
    }
    return action
}

function routeDetailGet(id,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_DETAIL_LOAD,
        id:id,
        navigation:navigation
    }
    return action
}
function InterChangeAdd(id,privates,source,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_LOAD,
        id:id,
        privates:privates,
        source:source,
        navigation:navigation
    }
    return action
}
function InterChangeEdit(postId,id,privates,source,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_LOAD,
        id:id,
        postId:postId,
        privates:privates,
        source:source,
        navigation:navigation
    }
    return action
}

function deleteInterchange(postId,id,privates,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_LOAD,
        id:id,
        privates:privates,
        postId:postId,
        navigation:navigation
    }
    return action
}
function equipmentAdd(id,privates,source,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_LOAD,
        id:id,
        privates:privates,
        source:source,
        navigation:navigation
    }
    return action
}
function equipmentEdit(postId,id,privates,source,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_LOAD,
        id:id,
        postId:postId,
        privates:privates,
        source:source,
        navigation:navigation
    }
    return action
}
function deleteEquipment(postId,id,privates,index=0,type='equipment',navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_LOAD,
        id:id,
        privates:privates,
        postId:postId,
        index:index,
        mediaType:type,
        navigation:navigation
    }
    return action
}
function videoAdd(id,thumbnail,privates,source,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_VIDEO_ADD_LOAD,
        id:id,
        privates:privates,
        source:source,
        thumbnail:thumbnail,
        navigation:navigation
    }
    return action
}
function videoEdit(postId,thumbnail,id,privates,source,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_LOAD,
        id:id,
        thumbnail:thumbnail,
        postId:postId,
        privates:privates,
        source:source,
        navigation:navigation
    }
    return action
}
function deleteVideo(postId,id,privates,navigation){
    const action={
        type:ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_LOAD,
        id:id,
        privates:privates,
        postId:postId,
        navigation:navigation
    }
    return action
}
function privateReceipt(postId,value){
    const action={
        type:ApiConstants.constants.ROUTE_POST_PRIVATE_LOAD,
        postId:postId,
        value:value
    }
    return action
}
function showLoading(){
    const action={
        type:"SHOW_TEXT_LOAD"
    }
    return action
}
function ManualTimelineCreate(name,location,category,phoneNumber,image,video,zoom,navigation){
    const action={
        type:ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_LOAD,
        name:name,
        location:location,
        category:category,
        phoneNumber:phoneNumber,
        image:image,
        video:video,
        zoom:zoom,
        navigation:navigation

    }
    return action
}
function EditManualTimeLineAction(name,location,category,phoneNumber,id,start,end,distance,totalTime,navigation){
    const action={
        type:ApiConstants.constants.API_EDIT_MANUAL_TIMELINE_LOAD,
        name:name,
        location:location,
        category:category,
        phoneNumber:phoneNumber,
        id:id,
        start:start,
        end:end,
        distance:distance,
        totalTime:totalTime,
        navigation:navigation

    }
    return action
}
module.exports = {
    RoutePostAction,
    CreatePostAction,
    EditTimeLineAction,
    deleteTimeLineAction,
    routeDetailGet,
    InterChangeAdd,
    equipmentAdd,
    videoAdd,
    deleteInterchange,
    deleteEquipment,
    deleteVideo,
    equipmentEdit,
    InterChangeEdit,
    videoEdit,
    privateReceipt,
    showLoading,
    ManualTimelineCreate,
    EditManualTimeLineAction
}