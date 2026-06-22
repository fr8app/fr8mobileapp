import { ApiConstants } from "./../../Themes";

import { combineReducers } from "redux";
import LoginState from "./loginReducer";
import RegisterState from "./RegisterReducer";
import HomeState from "./HomeReducer";
import TerminalDetailState from "./TerminalDetailReducer";
import AppVersionState from "./AppVersionReducer";

import VideoUploadState from "./VideoUploadReducer";
import CheckUserState from "./CheckUserReducer";
import LikeDislikeState from "./LikeDislikeReducer";
import OTPState from "./OTPReducer";
import ResetPasswordState from "./ResetPasswordReducer";
import FollowUnfollowTerminalState from "./FollowUnfollowReducer";
import FriendsState from "./FriendsReducer";
import MyFriendsState from "./MyFriendsReducer";
import SearchTermialState from "./SearchTerminalReducer";
import SearchUserState from "./SearchUserReducer";
import NearTerminalsState from "./NearTerminalsReducer";
import ChatHistoryState from "./ChatHistoryReducer";
import ChatUserHistoryState from "./ChatUserHistoryReducer";
import OneToOneChatState from "./OneToOneChatReducer";
import TerminalChatState from "./TerminalChatReducer";
import TerminalChatHistoryState from "./TerminalChatHistoryReducer";
import LogOutState from "./LogOutReducer";
import ChangePasswordState from "./ChangePasswordReducer";
import GetUserProfileState from "./GetUserProfileReducer";
import SupportState from "./SupportReducer";
import PendingFriendRequestState from "./PendingFriendRequestReducer";
import ReportUserState from "./ReportuserReducer";
import MyPostsState from "./MyPostReducer";
import FriendRequestState from "./FriendRequestReducer";
import UpdateProfileState from "./UpdateProfileReducer";
import AddFriendReducerState from "./AddFriendReducer";
import CancelFriendState from "./CancelFriendReducer";
import WarnContactsState from "./WarnContactsReducer";
import RemoveFriendReducer from "./RemoveFriendReducer";
import VideoPlayState from "./VideoPlayReducer";
import GetContactsState from "./GetContact";
import UpdatePhoneNumber from "./UpdatePhoneNUmber";
import BottombarState from "./BootomReducer";
import Notify from "./notifyReducer";
import Profile from "./ProfileReducer";
import UserProfileImage from "./uploadUserImage";
import RoutePostData from "./RoutePostReducer";
import timeLine from "./TimeLineReducer";
import userExist from "./userExistReducer";
import DataManager from "../../Components/DataManager";

const rootReducer = combineReducers({
  userExist,
  LoginState,
  RegisterState,
  HomeState,
  TerminalDetailState,
  VideoUploadState,
  CheckUserState,
  LikeDislikeState,
  OTPState,
  ResetPasswordState,
  FollowUnfollowTerminalState,
  FriendsState,
  MyFriendsState,
  SearchTermialState,
  SearchUserState,
  NearTerminalsState,
  ChatHistoryState,
  ChatUserHistoryState,
  OneToOneChatState,
  TerminalChatState,
  TerminalChatHistoryState,
  LogOutState,
  ChangePasswordState,
  GetUserProfileState,
  SupportState,
  PendingFriendRequestState,
  ReportUserState,
  MyPostsState,
  FriendRequestState,
  UpdateProfileState,
  AddFriendReducerState,
  CancelFriendState,
  WarnContactsState,
  RemoveFriendReducer,
  VideoPlayState,
  GetContactsState,
  UpdatePhoneNumber,
  BottombarState,
  Notify,
  Profile,
  UserProfileImage,
  RoutePostData,
  timeLine,
  AppVersionState,
});
const appReducer = (state, action) => {
  if (
    action.type === ApiConstants.constants.API_LOG_OUT_SUCCESS ||
    action.type === ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED ||
    action.type === ApiConstants.constants.API_CHANGE_PASSWORD_SUCCESS
  ) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
