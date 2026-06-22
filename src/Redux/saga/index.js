import { takeLatest, takeEvery } from "redux-saga/effects";
import { ApiConstants } from "./../../Themes";
import {
  dummyUserCreateSaga,
  loginApiSaga,
  loginApiSaga2,
  userExist,
  verifyOtp,
  setPasswordSaga,
  registerApiSaga,
  resetPasswordApiSaga,
  checkUserApiSaga,
  otpVerifyApiSaga,
  OTPApiSaga,
  logOutApiSaga,
  deleteAccountSaga,
  changePasswordApiSaga,
  getUserProfileApiSaga,
  updateUserProfileApiSaga,
  updateUserEmailApiSaga,
  updatePhoneApiSaga,
  contactApiSaga,
  sentInviteApiSaga,
  changeLAnguage
} from "./AuthenticationSaga";
import {
  homeApiSaga,
  homeDetailApiSaga,
  favTerminalApiSaga,
  reachEndTerminalSaga,
  notificationNearTerminalSaga,
  searchHomeTerminalSaga,
  geoFenceSaga,
  regionListSaga,
  regionSetSaga,
  DeleteFavTerminal
} from "./HomeSaga";
import {
  profileSaga,
  userUploadImageSaga
} from './profileSaga';
import {
  terminalDetailApiSaga,
  terminalRateApiSaga,
  likeDislikeApiSaga,
  followUnfollowTerminalApiSaga,
  videoPlayApiSaga,
  deleteTerminalPost,
  reportTerminalPost,
  terminalDetailApiSagaEND,
  timeLinePostByTerminal,
  checkinPostByTerminalSaga,
  ratingByTerminal
} from "./TerminalDetailSaga";
import { videoUploadApiSaga, videoUploadEditApiSaga, shareEditApiSaga } from "./VideoUploadSaga";
import {
  FriendApiSaga,
  MyFriendApiSaga,
  pendingFreindRequestApiSaga,
  friendRequestApiSaga,
  addFriendApiSaga,
  cancelFriendApiSaga,
  removeFriendApiSaga
} from "./FriendsSaga";
import {
  searchTerminalSaga,
  searchUserSaga,
  nearByTerminalsSaga
} from "./MyFrightingNetwrokSaga";
import {
  chatHistorySaga,
  chatUserHistorySaga,
  oneToOneChatSaga,
  terminalChatSaga,
  terminalChatHistorySaga,
  NotifyChatAppend
} from "./ChatSaga";
import { warnContactsApiSaga } from "./WarnContactsSaga";
import { supportApiSaga, reportUserApiSaga } from "./SupportSaga";
import { myPostApiSaga, deletePostSaga, onReachEndPostSaga } from "./MyPosts";
import {
  feedPostSaga,
  addPostBottomSaga
} from './BottomSaga'
import {
  notifySaga,
  notifyReadSaga,
  notifyDeleteSaga
} from './NotfiySaga'
import {
  routePostSaga,
  createPostSaga,
  routeDeleteSaga,
  routeEditSaga,
  routePostDetailSaga,
  interchangeAddSaga,
  interchangeDeleteSaga,
  equipmentAddSaga,
  equipmentDeleteSaga,
  equipmentEditSaga,
  videoAddSaga,
  videoDeleteSaga,
  videoEditSaga,
  interchangeEditSaga,
  routePrivateSaga,
  userInTerminalSaga,
  recentLOcationsSaga,
  manualTimeLineCreateSaga,
  manualTimeLineEditSaga
} from './RoutePostSaga'
import {
  timeLineGetSaga, timeLineAddSaga, timeLinePostLike, timeLinePostShare, timeLinePostComment,
  timeLinePostDetail, timeLinePostShareList, timeLinePostCommentLike, timeLinePostLikeList,
  deleteCommentSaga, deleteTimeLineSaga, editCommentSaga
} from './TimeLineSaga'
import { appVersionFuncSaga } from "./AppVersionSaga";
export default function* root_saga() {
  yield takeLatest(ApiConstants.constants.API_LOGIN_LOAD, loginApiSaga);
  yield takeLatest(ApiConstants.constants.API_OTP_VERIFY_LOAD, otpVerifyApiSaga);
  yield takeLatest(ApiConstants.constants.API_REGISTER_LOAD, registerApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_RESET_PASSWORD_LOAD,
    resetPasswordApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_CHECK_USER_LOAD, checkUserApiSaga);
  yield takeLatest(ApiConstants.constants.API_OTP_LOAD, OTPApiSaga);
  yield takeLatest(ApiConstants.constants.API_HOME_LOAD, homeApiSaga);
  yield takeLatest("API_HOME_DETAIL_LOAD", homeDetailApiSaga);
  yield takeLatest("API_FAV_TERMINAL_LOAD", favTerminalApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_TERMINAL_DETAIL_LOAD,
    terminalDetailApiSaga
  );
  yield takeLatest(
    "API_TERMINAL_RATE_ADD_LOAD",
    terminalRateApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_TERMINAL_DETAIL_LOAD_END,
    terminalDetailApiSagaEND
  );
  yield takeLatest(
    ApiConstants.constants.API_VIDEO_UPLOAD_LOAD,
    videoUploadApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_LOAD,
    videoUploadEditApiSaga
  );
  yield takeLatest(
    "API_SHARE_EDIT_LOAD",
    shareEditApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_LIKE_DISLIKE_LOAD,
    likeDislikeApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_LOAD,
    followUnfollowTerminalApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_FRIENDS_LOAD, FriendApiSaga);
  yield takeLatest(ApiConstants.constants.API_MY_FRIENDS_LOAD, MyFriendApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_SEARCH_TERMINAL_LOAD,
    searchTerminalSaga
  );
  yield takeLatest(ApiConstants.constants.API_SEARCH_USER_LOAD, searchUserSaga);
  yield takeLatest(
    ApiConstants.constants.API_NEAR_TERMINALS_LOAD,
    nearByTerminalsSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_CHAT_HISTORY_LOAD,
    chatHistorySaga
  );
  yield takeLatest(
    ApiConstants.constants.API_CHAT_USER_HISTORY_LOAD,
    chatUserHistorySaga
  );
  yield takeLatest(
    ApiConstants.constants.NOTIFICATION_CHAT_INIT,
    NotifyChatAppend
  )
  yield takeLatest(
    ApiConstants.constants.API_ONE_TO_ONE_CHAT_LOAD,
    oneToOneChatSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_WARN_CONTACTS_LOAD,
    warnContactsApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_TERMINAL_CHAT_LOAD,
    terminalChatSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_TERMINAL_CHAT_HISTORY_LOAD,
    terminalChatHistorySaga
  );
  yield takeLatest(ApiConstants.constants.API_LOG_OUT_LOAD, logOutApiSaga);
  yield takeLatest("API_DELETE_ACCOUNT_LOAD", deleteAccountSaga);
  yield takeLatest(
    ApiConstants.constants.API_CHANGE_PASSWORD_LOAD,
    changePasswordApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_GET_USER_PROFILE_LOAD,
    getUserProfileApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_UPDATE_USER_PROFILE_LOAD,
    updateUserProfileApiSaga
  );
  yield takeLatest(
    "API_UPDATE_EMAIL_PROFILE_LOAD",
    updateUserEmailApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_SUPPORT_LOAD, supportApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_PENDING_FRIEND_REQUEST_LOAD,
    pendingFreindRequestApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_REPORT_USER_LOAD,
    reportUserApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_MY_POSTS_LOAD, myPostApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_FRIEND_REQUEST_LOAD,
    friendRequestApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_ADD_FRIEND_LOAD, addFriendApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_CANCEL_FRIEND_LOAD,
    cancelFriendApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_REMOVE_FRIEND_LOAD,
    removeFriendApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_VIDEO_PLAY_LOAD, videoPlayApiSaga);
  yield takeLatest(ApiConstants.constants.API_GETCONTACT_LOAD, contactApiSaga);
  yield takeLatest(
    ApiConstants.constants.API_SENTINVITE_LOAD,
    sentInviteApiSaga
  );
  yield takeLatest(
    ApiConstants.constants.API_UPDATE_PHONE_NUMBER_LOAD,
    updatePhoneApiSaga
  );
  yield takeLatest(ApiConstants.constants.API_ON_REACH_END_TERMINAL, reachEndTerminalSaga)
  yield takeEvery(ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_INITIATE, notificationNearTerminalSaga)
  yield takeLatest(ApiConstants.constants.DELETE_POST_INITIATE, deletePostSaga)
  yield takeLatest(ApiConstants.constants.ON_REACH_END_POST_INITATE, onReachEndPostSaga)
  yield takeLatest(ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_INITATE, deleteTerminalPost)
  yield takeLatest(ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_INITIATE, reportTerminalPost)
  yield takeLatest(ApiConstants.constants.FEED_POST_INITIATE, feedPostSaga,)
  yield takeLatest(ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_INITIATE, addPostBottomSaga)
  yield takeLatest(ApiConstants.constants.SEARCH_TERMINAL_INITIATE, searchHomeTerminalSaga)
  yield takeLatest(ApiConstants.constants.NOTIFY_NOTIFICATION_INITATE, notifySaga)
  yield takeLatest(ApiConstants.constants.API_NOTIFICATION_READ_LOAD, notifyReadSaga)
  yield takeLatest(ApiConstants.constants.API_NOTIFICATION_DELETE_LOAD, notifyDeleteSaga)
  yield takeLatest(ApiConstants.constants.PROFILE_DATA_INITATE, profileSaga)
  yield takeLatest(ApiConstants.constants.Add_USER_IMAGE_INITATE, userUploadImageSaga)
  yield takeLatest(ApiConstants.constants.API_POST_LOAD, routePostSaga)
  yield takeLatest(ApiConstants.constants.API_ROUTE_POST_CREATE_LOAD, createPostSaga)
  yield takeLatest(ApiConstants.constants.API_ROUTE_DELETE_LOAD, routeDeleteSaga)
  yield takeLatest(ApiConstants.constants.API_ROUTE_EDIT_LOAD, routeEditSaga)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_GET_LOAD, timeLineGetSaga)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_ADD_LOAD, timeLineAddSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_DETAIL_LOAD, routePostDetailSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_LOAD, interchangeAddSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_LOAD, interchangeDeleteSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_LOAD, interchangeEditSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_LOAD, equipmentAddSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_VIDEO_ADD_LOAD, videoAddSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_LOAD, equipmentDeleteSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_LOAD, equipmentEditSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_LOAD, videoDeleteSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_LOAD, videoEditSaga)
  yield takeLatest(ApiConstants.constants.ROUTE_POST_PRIVATE_LOAD, routePrivateSaga)
  yield takeLatest('CHANGE_LANGUAGE_LOAD', changeLAnguage)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_LIKE_LOAD, timeLinePostLike)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_SHARE_LOAD, timeLinePostShare)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_SHARE_LIST_LOAD, timeLinePostShareList)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_LIKE_LIST_LOAD, timeLinePostLikeList)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_COMMENT_LOAD, timeLinePostComment)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_LOAD, timeLinePostCommentLike)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_POST_DETAIL_LOAD, timeLinePostDetail)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_LOAD, deleteCommentSaga)
  yield takeLatest(ApiConstants.constants.API_TIMELINE_COMMENT_EDIT_LOAD, editCommentSaga)
  yield takeLatest('API_TIMELINE_POST_DELETE_LOAD', deleteTimeLineSaga)
  yield takeLatest('API_USER_IS_IN_TERMINAL_LOAD', userInTerminalSaga)
  yield takeLatest('API_RECENT_LOCATIONS_LOAD', recentLOcationsSaga)
  yield takeLatest('API_GET_GEOFENCES_LOAD', geoFenceSaga)
  yield takeLatest('API_REGION_LIST_LOAD', regionListSaga)
  yield takeLatest('API_SET_FAV_REGION_LOAD', regionSetSaga)
  yield takeLatest(ApiConstants.constants.API_APPVERSION_LOAD, appVersionFuncSaga);
  yield takeLatest(ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_LOAD, manualTimeLineCreateSaga);
  yield takeLatest(ApiConstants.constants.API_EDIT_MANUAL_TIMELINE_LOAD, manualTimeLineEditSaga);
  yield takeLatest("API_TIMELINEPOST_BY_TERMINAL_LOAD", timeLinePostByTerminal);
  yield takeLatest("API_CHECKIN_BY_TERMINAL_LOAD", checkinPostByTerminalSaga);
  yield takeLatest("API_RATING_BY_TERMINAL_LOAD", ratingByTerminal);
  yield takeLatest("API_LOGIN_WITH_USERNAME_LOAD", loginApiSaga2);
  yield takeLatest("API_DUMMY_USER_CREATE_LOAD", dummyUserCreateSaga);
  yield takeLatest("API_USERNAME_EXIST_LOAD", userExist);
  yield takeLatest("API_VERIFY_OTP_FOR_PASSWORD_LOAD", verifyOtp);
  yield takeLatest("API_PASSWORD_SET_LOAD", setPasswordSaga);
  yield takeLatest("DELETE_FAV_TERMINAL_LOAD", DeleteFavTerminal);
}
