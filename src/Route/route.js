import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React from 'react'
import {
  OTP,
  EditProfile,
  Settings,
  FAQTermsPrivacy,
  WarnContacts,
  FriendRequests,
  MyPosts,
  MyFreightingNetwork,
  NameOfTheUser,
  PostDetails,
  CreatePost,
  SocialMediaAccounts,
  Support,
  FR8,
  ChatHistory,
  TerminalDetails,
  Chat,
  AllUsers,
  TerminalChat,
  OnBoarding,
  ExploreCities,
  OTPScreen,
  EditPhoneNumber,
  EditProfileOtp,
  TimeLine,
  TimeLineMap,
  TimeLineDetail,
  TerminalList,
  MyTimeLine,
  EditTimeLine,
  TimeLinePostCreate,
} from "../Screens";
import ReportPost from '../Screens/ReportPost/index';
import NotificationDetailScreen from '../Screens/NotificationDetailScreen/index';
import VideoPreview from '../Screens/VideoPreview/index';
import NotifyScreen from '../Screens/NotifyScreen/index';
import { Platform } from "react-native";
import AddPostss from '../Screens/AddPosts/index.js'
import UserDetailss from '../Screens/userDetail/index';
import BottomBar from '../Components/BottomBar';
import Comments from '../Screens/Comments';
import PostFullView from '../Screens/PostFullScreen';
import postPreview from '../Screens/PostPreview';
import TagFriends from '../Screens/TagFriends';
import UseLocation from '../Screens/UseLocaion'
import GooglePlaces from '../Screens/GooglePLaces'
import SearchTerminal from '../Screens/SearchTerminal'
import ManualTimeline from "../Screens/ManualTimelineCreate";
import AnimationScreen from "../Screens/MyTimeLine/amination/Animation/Animation.Screen";
import PostEdit from '../Screens/EditPost'
import LikeListing from "../Screens/LikesListing";
import ShareUsers from "../Screens/ShareUsers";
import SelfUserProfileDetail from "../Screens/SelfUserProfileDetail";
import LocationSettings from "../Screens/LocationSettings";
import EditComment from "../Screens/EditComment";
import SharePost from "../Screens/SharePost";
import Regions from "../Screens/RegionList";
import FavouriteTerminal from "../Screens/FavouriteTerminal";
import SharePostEdit from "../Screens/SharePostEdit";
import PhoneCall from "../Screens/PhoneCallList/PhoneCall";

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
      }}
      tabBar={(props) => <BottomBar navigation={props} />}>
      <Tab.Screen
        component={FavouriteTerminal}
        name='FavouriteTerminal2'
      />
      <Tab.Screen
        component={MyTimeLine}
        name='Feed'
      />
      <Tab.Screen
        component={NotifyScreen}
        name='Notification'
      />
      <Tab.Screen
        component={TimeLine}
        name='TimeLine'
      />
      <Tab.Screen
        options={{ header: () => null }}
        component={FR8}
        name='FR8'
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

const Main_Stack = (loggedIn, onBoard, permissionAllowed, started) => {
  return createStackNavigator(
    {
    },
    {
      initialRouteName:
        loggedIn == false ? Platform.OS == 'ios' ? started ? "FavouriteTerminal2" : 'OnBoarding' : started == true ? "FavouriteTerminal2" : 'UseLocation' : "FavouriteTerminal2",
      header: null,
      navigationOptions: {

        gesturesEnabled: false
      }
    }
  );
};


const Main_stack_2 = ({ loggedIn, onBoard, permissionAllowed, started }) => {
  console.log('loggedIn, onBoard,permissionAllowed,started', loggedIn, onBoard, permissionAllowed, started);
  return (
    <Stack.Navigator screenOptions={{
      gestureEnabled: false,
      header: () => null

    }} initialRouteName={loggedIn == false ? Platform.OS == 'ios' ? started ? "FavouriteTerminal2" : 'OnBoarding' : started == true ? "FavouriteTerminal2" : 'UseLocation' : "FavouriteTerminal2"}>
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="OnBoarding"
        component={OnBoarding}
      />
      <Stack.Screen
        options={{
        }}
        name="VideoPreview"
        component={VideoPreview}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="UserNamess"
        component={UserDetailss}
      />
      <Stack.Screen
        options={{
        }}
        name="ReportPost"
        component={ReportPost}
      />
      <Stack.Screen
        options={{
        }}
        name="UseLocation"
        component={UseLocation}
      />
      <Stack.Screen
        options={{
        }}
        name="OTP"
        component={OTP}
      />
      <Stack.Screen
        options={{
        }}
        name="EditProfile"
        component={EditProfile}
      />
      <Stack.Screen
        options={{
        }}
        name="Settings"
        component={Settings}
      />
      <Stack.Screen
        options={{
        }}
        name="FAQTermsPrivacy"
        component={FAQTermsPrivacy}
      />
      <Stack.Screen
        options={{
        }}
        name="WarnContacts"
        component={WarnContacts}
      />
      <Stack.Screen
        options={{
        }}
        name="FriendRequests"
        component={FriendRequests}
      />
      <Stack.Screen
        options={{
        }}
        name="MyPosts"
        component={MyPosts}
      />
      <Stack.Screen
        options={{
        }}
        name="MyFreightingNetwork"
        component={MyFreightingNetwork}
      />
      <Stack.Screen
        options={{
        }}
        name="NameOfTheUser"
        component={NameOfTheUser}
      />
      <Stack.Screen
        options={{
        }}
        name="PostDetails"
        component={PostDetails}
      />
      <Stack.Screen
        options={{
        }}
        name="CreatePost"
        component={CreatePost}
      />
      <Stack.Screen
        options={{
        }}
        name="SocialMediaAccounts"
        component={SocialMediaAccounts}
      />
      <Stack.Screen
        options={{
        }}
        name="Support"
        component={Support}
      />
      {/* //////bottom tab */}
      <Stack.Screen
        options={{
          header: () => null
        }}

        name="FavouriteTerminal2"
        component={MyTabs}
      />
      <Stack.Screen

        name="ChatHistory"
        component={ChatHistory}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TerminalDetails"
        component={TerminalDetails}
      />
      <Stack.Screen

        name="Chat"
        component={Chat}
      />
      <Stack.Screen

        name="NotificationDetailScreen"
        component={NotificationDetailScreen}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="Regions"
        component={Regions}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="AllUsers"
        component={AllUsers}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TerminalChat"
        component={TerminalChat}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          header: () => null
        }}
        name="ADDPost"
        component={AddPostss}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="ExploreCities"
        component={ExploreCities}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="OTPScreen"
        component={OTPScreen}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="EditPhoneNumber"
        component={EditPhoneNumber}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="EditProfileOtp"
        component={EditProfileOtp}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TimeLineMap"
        component={TimeLineMap}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TimeLineDetail"
        component={TimeLineDetail}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="ManualTimeline"
        component={ManualTimeline}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TerminalList"
        component={TerminalList}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="MyTimeLine"
        component={MyTimeLine}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="EditTimeLine"
        component={EditTimeLine}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TimeLinePostCreate"
        component={TimeLinePostCreate}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="comments"
        component={Comments}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="PostFullView"
        component={PostFullView}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="postPreview"
        component={postPreview}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="TagFriends"
        component={TagFriends}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="GooglePlaces"
        component={GooglePlaces}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="SearchTerminal"
        component={SearchTerminal}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="AnimationScreen"
        component={AnimationScreen}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="EditPost"
        component={PostEdit}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="LikeListing"
        component={LikeListing}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="ShareUsers"
        component={ShareUsers}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="SelfUserProfileDetail"
        component={SelfUserProfileDetail}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="LocationSetting"
        component={LocationSettings}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="EditComment"
        component={EditComment}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="SharePost"
        component={SharePost}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="SharePostEdit"
        component={SharePostEdit}
      />
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="PhoneCall"
        component={PhoneCall}
      />
    </Stack.Navigator>
  )
}

export default Main_stack_2;
