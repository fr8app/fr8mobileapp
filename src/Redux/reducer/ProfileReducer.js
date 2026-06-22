
import {
  ApiConstants
} from './../../Themes';
import { DataManager } from '../../Components'
const initialState = {
  status:0,
  onLoad: false,
  result: [],
  profileDetail: null
}

function addFriendSuccess(result) {
  let updateResult = result;

  console.log(updateResult);
  updateResult.friend.isFriend = 0;
  updateResult.friend.isFriendRequestSent = 1;

  return updateResult;
}

function canelFriendSuccess(result) {
  let updateResult = result;
  console.log(updateResult);
  updateResult.friend.isFriend = 0;
  updateResult.friend.isFriendRequestSent = 0;


  return updateResult;
}
function removeFriendSuccess(result) {
  let updateResult = result;
  console.log('updated data', updateResult);
  updateResult.friendsCount=updateResult?.friendsCount-1
  updateResult.friend.isFriend = 0;
  updateResult.friend.isFriendRequestSent = 0;


  return updateResult;
}
function acceptRequest(result) {
  let updateResult = result;
  console.log('updated data', updateResult);
  updateResult.friendsCount=updateResult?.friendsCount+1
  updateResult.friend.isFriend = 1;
  updateResult.friend.isFriendRequestSent = 0;
  updateResult.friend.isFriendRequestReceived = 0;



  return updateResult;
}
function rejectRequest(result) {
  let updateResult = result;
  console.log('updated data', updateResult);
  updateResult.friend.isFriend = 0;
  updateResult.friend.isFriendRequestSent = 0;
  updateResult.friend.isFriendRequestReceived = 0;


  return updateResult;
}
function statusUpdate(result,data) {
  let updateResult = result;
  if(data?.isFriend==1){
  updateResult.friendsCount=updateResult?.friendsCount+1

  }
  console.log('updated data', updateResult);
  updateResult.friend.isFriend = data?.isFriend;
  updateResult.friend.isFriendRequestSent = data?.isFriendRequestSent;
  updateResult.friend.isFriendRequestReceived = data?.isFriendRequestSent;


  return updateResult;
}

export default function (state = initialState, { type,index, payload, userId, data,result, frontStatus,isBlocked }) {
  switch (type) {
    case ApiConstants.constants.PROFILE_DATA_INITATE:
      return {
        ...state,
        onLoad: false
      }
    case ApiConstants.constants.PROFILE_DATA_SUCCESS:
      console.log('dadssadasdasds',payload, userId);
      if (userId == null) {
        DataManager.getUserDetails('data').then((res) => {
        })
        DataManager.setUserDetails({ 'data': payload })
      }
      if (userId) {
        state.profileDetail = payload
      }
      else {
        state.result = { data: payload }
      }
      // DataManager.setUserDetails('data',{data})
      return {
        ...state,
        onLoad: false,
        status:1
        // result: {data:payload}
      }
    case ApiConstants.constants.PROFILE_DATA_ERROR:
      return {
        ...state,
        onLoad: false,
        result: payload
      }
    case ApiConstants.constants.Add_USER_IMAGE_SUCCESS:
      // console.log('state.result',state.result,payload);
      state.result.data.profile=payload
      return {
        ...state,
        onLoad: false,
        // result: payload
      }


    case ApiConstants.constants.API_ADD_FRIEND_SUCCESS:
      let updateResult = addFriendSuccess(
        state.profileDetail
      );

      return { ...state, onLoad: false, profileDetail: updateResult };

    case ApiConstants.constants.API_CANCEL_FRIEND_SUCCESS:

      let cancelUpdateResul = canelFriendSuccess(
        state.profileDetail);

      return { ...state, onLoad: false, profileDetail: cancelUpdateResul };

    case ApiConstants.constants.API_REMOVE_FRIEND_SUCCESS:
      let removeUpdateResult = removeFriendSuccess(
        state.profileDetail
      );
      return { ...state, onLoad: false, profileDetail: removeUpdateResult };
    case "CLEAR_PROFILE_DATA":
      return {
        ...state, profileDetail: null
      }
    case "NOTIFICATION_ON_FRIEND":
      console.log('action.data', data);
      return {
        ...state
      }
    case ApiConstants.constants.API_FRIEND_REQUEST_SUCCESS:
      let requestUpdate
      if(index==null && index!==0){
        // alert(index)
      if (frontStatus == 'Reject') {
        requestUpdate = rejectRequest(
          state.profileDetail
        );
      }
      else{
        requestUpdate = acceptRequest(
          state.profileDetail
        );
      }
    }
      return { ...state, onLoad: false, profileDetail: requestUpdate };

      case ApiConstants.constants.API_FRIEND_REQUEST_FAIL:
        let buttonStatusChange
        if(index==null && index!==0){
        if(result?.result?.data){
          if(result?.result?.data?.friend){
            buttonStatusChange=statusUpdate(state.profileDetail,result?.result?.data?.friend)
          }
        }
      }
        return {
          ...state, onLoad: false, profileDetail: buttonStatusChange 
        };

    default:
      return state
  }
}






