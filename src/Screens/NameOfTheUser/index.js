import React, { Component } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  RefreshControl,
  Dimensions,
  ScrollView
} from "react-native";
import styles from "./styles";
import ReportPost from '../../Components/ReportPost'
import {
  Header,
  UserPosts,
  ReportUser,
  Loader,
  DataManager
} from "./../../Components";
import {
  AppStyles,
  AppConstants,
  AppImages,
  AppColor,
  DateFormat
} from "./../../Themes";
import {
  terminalPostReportAction,

} from '../../Redux/actions/TerminalDetail';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reportUserAction } from "./../../Redux/actions/Support";
import {
  addFriendAction,
  cancelFriendAction,
  removeFriendAction
} from "./../../Redux/actions/Friends";
import { myPostAction } from "./../../Redux/actions/MyPosts";
import {
  likeDislikeAction,
  videoPlayAction
} from "../../Redux/actions/TerminalDetail";

import Share from "react-native-share";
import { imageBaseUrl, showImageUrl } from "../../Config";
import I18n from 'react-native-i18n'
import { GridView } from "../../Components/GridView";
import { ProfileDataInitate } from '../../Redux/actions/profileAction';
import ActionSheet from 'react-native-actionsheet'
import RemoveFriend from '../../Components/RemoveFriend'
import deviceInfoModule from "react-native-device-info";
import { pendingFriendAction, friendRequestAction } from './../../Redux/actions/Friends';
import { timeLinePostDetailClear } from '../../Redux/actions/timeLineAction'
import { AFLogEvent } from "../../Config/aws";
let _this = null
class NameOfTheUser extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (

        null
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      removePopUp: false,
      searchText: null,
      textReportUser: "",
      textReportUser1: "",
      sideMenu: false,
      sideMenu1: false,
      key: this.props.route.params?.key,
      postId: null,
      refresh: false,
      userId: null
    };
    _this = this
    this.props.navigation.setParams({ sideMenu: this.sideMenu });
    this.getUserDetail();
  }
  componentDidMount() {
    AFLogEvent("UserDetail", { screen: 'UserDetail' })

    console.log('this.props?.Profile?.profileDetail', this.props?.Profile);
    let data =
      this.props.route.params?.item?.friendInfo
        ? this.props.route.params.item.friendInfo
        : this.props.route.params.item
          ?
          this.props.route.params.item
          :
          this.props?.route.params?.userDetail
      ;
    console.log('user detaillll', data);
    // this.props.ProfileDataInitate({ navigation: this.props.navigation,userId:data._id?data._id:data.id })
    DataManager.getUserDetails().then((response) => {
      this.setState({ userId: JSON.parse(response).data.id })

    })
  }


  componentDidUpdate(nextPorps) {
    if (nextPorps.removeFriendState !== this.props.removeFriendState) {
      if (
        this.props.removeFriendState.result !== null &&
        this.props.removeFriendState.error == null
      ) {
        this.setState({ key: "add" });
      }
    }
    if (this.props !== nextPorps) {
      if (this.props.Profile !== nextPorps.Profile) {
        if (this.props.Profile.status == 1) {
          this.props.Profile.status = 0
          let data = this.props.route.params?.item?.friendInfo
            ? this.props.route.params.item?.friendInfo
            : this.props.route.params.item ?
              this.props.route.params.item
              : this.props.route?.params.userDetail
            ;
          setTimeout(() => {

            this.props.myPostAction(0, data._id ? data._id : data.id, this.props.navigation);
          }, 500);
        }
      }
    }
  }

  androidActionSheetPress = (buttonIndex) => {
    // let data = this.props.route.params.item?this.props.route.params.item:this.props?.Profile?.profileDetail
    let data = this.props?.Profile?.profileDetail

    let secondIndex = (data?.isFriend == 0 && data?.isFriendRequestSent == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestSent == 1) ?
      1 : data?.isFriend == 1 || data?.friend?.isFriend == 1 ? 2 : (data?.isFriend == 0 && data?.isFriendRequestReceived == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestReceived == 1) ? 3 : 0

    if (buttonIndex == 1) {
      this.setState({ sideMenu: true })
    }
    else if (buttonIndex == 2) {
      if (secondIndex == 1) {
        this.cancelRequest()
      }
      else if (secondIndex == 2) {
        this.setState({ removePopUp: true })
        // this.removeFriend()
      }
      else if (secondIndex == 3) {
        this.acceptButtonClicked()
      }
      else {
        this.addFriend()
      }
    }
    else if (buttonIndex == 3) {
      this.rejectButtonClicked()
    }
  }

  actionSheet = (navigation) => {
    let data = this.props?.Profile?.profileDetail
    // let data = this.props.route.params.item?this.props.route.params.item:this.props?.Profile?.profileDetail

    let secondIndex = (data?.isFriend == 0 && data?.isFriendRequestSent == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestSent == 1) ?
      1 : data?.isFriend == 1 || data?.friend?.isFriend == 1 ? 2 : (data?.isFriend == 0 && data?.isFriendRequestReceived == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestReceived == 1) ? 3 : 0
    Platform.OS == 'android' ?
      this.ActionSheet.show()
      :
      ActionSheetIOS.showActionSheetWithOptions({
        options:
          secondIndex == 3 ?
            [I18n.t('Cancel'), I18n.t('reportUser'), secondIndex == 1 ? I18n.t('Cancel_Friend_Request') : secondIndex == 2 ? I18n.t('Remove_Friend') : secondIndex == 3 ? I18n.t('Accept') : I18n.t('Add_Friend'), secondIndex ? I18n.t('Reject') : null]
            :
            [I18n.t('Cancel'), I18n.t('reportUser'), secondIndex == 1 ? I18n.t('Cancel_Friend_Request') : secondIndex == 2 ? I18n.t('Remove_Friend') : I18n.t('Add_Friend')],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      }, (buttonIndex) => {
        console.log(); ('buttonIndex', navigation)
        if (buttonIndex == 1) {
          this.setState({ sideMenu: true })
        }
        else if (buttonIndex == 2) {
          if (secondIndex == 1) {
            this.cancelRequest()
          }
          else if (secondIndex == 2) {
            this.setState({ removePopUp: true })
            // this.removeFriend()
          }
          else if (secondIndex == 3) {
            this.acceptButtonClicked()
          }
          else {
            this.addFriend()
          }
        }
        else if (buttonIndex == 3) {
          this.rejectButtonClicked()
        }
      })
  }

  getUserDetail() {
    console.log('this.props?.Profile?.profileDetail', this.props?.Profile);

    let data = this.props.route.params?.item?.friendInfo
      ? this.props.route.params.item?.friendInfo
      : this.props.route.params.item ?
        this.props.route.params.item
        : this.props.route?.params.userDetail
      ;

    this.focusListener = this.props.navigation.addListener("focus", () => {
      // this.props.timeLinePostDetailClear()
      //  this.props.myPostAction(0,data._id?data._id:data.id, this.props.navigation);
      this.props.ProfileDataInitate({ navigation: this.props.navigation, userId: data._id ? data._id : data.id })

    });

  }

  sideMenu = () => {
    this.setState({ sideMenu: true });
  };

  _renderItem = ({ item, index }) => (
    <UserPosts
      type={item.type}
      imageSource={{ uri: imageBaseUrl + item.video }}
      video={item.video}
      imageSource={
        item.thumbnail_image
          ? { uri: imageBaseUrl + item.thumbnail_image }
          : AppImages.images.videoImage
      }
      likeSource={
        item.is_like !== 1
          ? AppImages.images.notLike
          : AppImages.images.like
      }
      disLikeSource={
        item.dislike_count !== 0
          ?
          AppImages.images.disLike : AppImages.images.notDisLike
      }
      terminalReport={
        () => {
          this.setState({ sideMenu1: true, postId: item._id })

        }
      }
      stateId={this.state.userId}
      itemId={item.id}
      shareSource={AppImages.images.share}
      playSource={AppImages.images.play}
      viewSource={AppImages.images.views}
      viewText={item.view_count ? item.view_count : "0"}
      disLikeText={item.dislike_count}
      likeText={item.like_count}
      timeText={DateFormat.toTime(item.created_at)}
      dateText={DateFormat.toDate(item.created_at)}
      viewsVisible
      videoOnPress={this.videoClicked.bind(this, item, index)}
      likeButton={this.likeButton.bind(this, item, index)}
      disLikeButton={this.disLikeButton.bind(this, item, index)}
      shareButton={this.shareButton.bind(this, item, index)}
    />
  );

  likeButton = (item, index) => {
    let { navigation } = this.props;
    if (item.is_like == 0) {
      this.props.likeDislikeAction(item._id, 1, index, "myPost", navigation);
    } else if (item.is_like == 2) {
      this.props.likeDislikeAction(item._id, 1, index, "myPost", navigation);
    } else {
      this.props.likeDislikeAction(item._id, 2, index, "myPost", navigation);
    }
  };

  disLikeButton = (item, index) => {
    let { navigation } = this.props;
    if (item.is_like == 2) {
      this.props.likeDislikeAction(item._id, 0, index, "myPost", navigation);
    } else if (item.is_like == 1) {
      this.props.likeDislikeAction(item._id, 0, index, "myPost", navigation);
    } else {
      this.props.likeDislikeAction(item._id, 2, index, "myPost", navigation);
    }
  };

  acceptButtonClicked = () => {
    this.setState({ disabled: true })
    setTimeout(() => {
      this.setState({ disabled: false })
    }, 1000);
    let { navigation, route } = this.props;
    // let id = route.params?.item?.friendInfo
    //   ? route.params.item.friendInfo.id
    //   :
    let id = this.props?.Profile?.profileDetail ?
      this.props?.Profile?.profileDetail?._id :
      route.params?.item?.id;
    this.props.friendRequestAction(id, "Accept", null, navigation)
  }

  rejectButtonClicked = () => {
    this.setState({ disabled: true })
    setTimeout(() => {
      this.setState({ disabled: false })
    }, 1000);
    let { navigation, route } = this.props;
    let id =
      //  route.params?.item?.friendInfo
      //   ? route.params.item.friendInfo.id
      //   :
      this.props?.Profile?.profileDetail ?
        this.props?.Profile?.profileDetail._id :
        route.params.item.id;
    this.props.friendRequestAction(id, "Reject", null, navigation)
  }


  shareButton = (item, index) => {
    const shareOptions = {
      title: "FR8",
      subject: "FR8",
      // message: "Message here!",
      message: 'My terminal post:- ',
      url: showImageUrl + item.video,
      social: Share.Social.WHATSAPP
    };
    Share.open(shareOptions);
  };

  videoClicked = (item, index) => {
    this.props.videoPlayAction(item, index, "UserProfile", this.props.navigation);
  };

  chatButton = () => {
    // let selectedItem = this.props.route?.params.item?this.props.route?.params.item:this.props?.Profile?.profileDetail;
    let selectedItem = this.props?.Profile?.profileDetail;
    let chatResult = {
      friendInfo: {
        name: selectedItem.friendInfo
          ? selectedItem.friendInfo.name
          : selectedItem.name ? selectedItem.name : selectedItem?.userName,
        id: selectedItem.friendInfo
          ? selectedItem.friendInfo.id
          : selectedItem.id ? selectedItem.id : selectedItem._id,
        image: selectedItem.friendInfo
          ? selectedItem.friendInfo.image
          : selectedItem.image ? selectedItem.image : selectedItem.profile
      }
    };
    this.props.navigation.navigate("Chat", { item: chatResult, onNavigationBack: () => console.log('back') });
  };
  userData = () => {
    // let data = this.props.route.params.item?this.props.route.params.item:this.props?.Profile?.profileDetail
    let data = this.props?.Profile?.profileDetail

    let userTypeArray = [
      "Driver",
      "Owner Operator",
      "Company",
      "Air Cargo Carrier",
      "Exporter",
      "Freight Broker",
      "Importer",
      "Shipper",
      "Trucking",
      "Warehouse"
    ],
      userTypeVal = Number.isInteger(parseInt(data?.user_type))
        ? ""
        : data?.user_type;
    for (let i in userTypeArray) {
      if (i == parseInt(data?.user_type) - 1) {
        let index = Number(i);
        userTypeVal = userTypeArray[index];
      }
    }
    return (
      this.props?.Profile?.profileDetail &&
      <View style={{ paddingHorizontal: 5, marginTop: Platform.OS == 'ios' ? 20 : 0 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          {/* <View> */}
          <Image
            source={data?.image || data?.profile ? { uri: imageBaseUrl + [data?.image ? data.image : data.profile] } : AppImages.images.user01}
            resizeMode="cover"
            style={[styles.userImage, { marginLeft: 10 }]}
          />
          {/* </View> */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', alignItems: 'center', marginLeft: 15 }}>
            <View>
              <Text style={[styles.noOfPosts, { textAlign: 'center' }]}>{data?.postCount}</Text>
              <Text style={[styles.userPostsText]}>{data?.postCount == 1 || data?.postCount == '1' ? I18n.t('post') : I18n.t('posts')}</Text>
            </View>
            <View>
              <Text style={[styles.noOfPosts, { textAlign: 'center' }]}>{data?.friendsCount}</Text>
              <Text style={styles.userPostsText}>{data?.friendsCount == 1 || data?.friendsCount == '1' ? I18n.t("Friend") : I18n.t('Friends')}</Text>
            </View>
            <View style={{}}>
              <Text style={[styles.noOfPosts, { textAlign: 'center' }]}>{data?.terminalFollowCount}</Text>
              <Text style={[styles.userPostsText, { textAlign: 'center' }]}>{I18n.t('followingTerminal')}</Text>
            </View>
          </View>

        </View>
        <View style={{ justifyContent: "center", width: Dimensions.get('screen').width * 0.4, marginLeft: 10 }}>
          <Text style={[styles.userPostsText, { width: '100%' }]}>
            {data?.userName ? data?.userName : ""}
          </Text>
          {userTypeVal && <Text style={styles.exporterText}>{I18n.t(userTypeVal)}</Text>}
        </View>
        {(data?.friend?.isFriend == 0 || data?.friend?.isFriendRequestSent == 1) && (data.friend.isFriendRequestReceived !== 1) ? (
          <ImageBackground
            style={[
              styles.addFriendButton,
              { height: 40, width: '100%', overflow: "hidden", marginTop: 20, marginBottom: 5 }
            ]}
            resizeMode="cover"
            // source={AppImages.images.buttonBackground}
            source={require('../../Images/Button.png')}
          >
            {data && (data.isFriend == 0 && data.isFriendRequestSent == 1) || (data?.friend?.isFriend == 0 && data.friend.isFriendRequestSent == 1) ? (
              <TouchableOpacity
                disabled={this.state.disabled}
                style={[styles.addFriendButton, { height: 30, width: '100%' }]}
                onPress={this.cancelRequest}
              >
                <Text style={styles.addFriendText}>
                  {I18n.t('Cancel_Friend_Request')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={this.state.disabled}
                style={[styles.addFriendButton, { height: 30, width: '100%' }]}
                onPress={this.addFriend}
              >
                <Text style={styles.addFriendText}>
                  {I18n.t('Add_Friend')}
                </Text>
              </TouchableOpacity>
            )}
          </ImageBackground>
        ) :
          (data?.isFriend == 0 && data?.isFriendRequestReceived == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestReceived == 1) ?
            (data &&
              <View style={[styles.removeChatContainer]}>
                <ImageBackground
                  style={[
                    styles.addFriendButton,
                    {
                      width: '42%',
                      height: 40,
                      overflow: "hidden",
                      marginTop: 15,
                      marginBottom: 10
                    }
                  ]}
                  resizeMode="cover"
                  source={AppImages.images.buttonBackground}
                >
                  <TouchableOpacity
                    disabled={this.state.disabled}
                    style={[styles.addFriendButton]}
                    onPress={() => {
                      this.acceptButtonClicked()
                    }}
                  >
                    <Text style={[styles.addFriendText, { fontWeight: "400" }]}>
                      {I18n.t('Accept')}
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>

                <TouchableOpacity
                  disabled={this.state.disabled}
                  style={[styles.chatButton, { height: 40, width: '42%', marginTop: 5 }]}
                  onPress={() => this.rejectButtonClicked()}
                >
                  <Text
                    style={[styles.chatText, { color: AppColor.colors.lightBlue }]}
                  >
                    {I18n.t('Reject')}
                  </Text>
                </TouchableOpacity>
              </View>
            )
            :
            (data &&
              <View style={[styles.removeChatContainer]}>
                <ImageBackground
                  style={[
                    styles.addFriendButton,
                    {
                      width: '43%',
                      height: 40,
                      overflow: "hidden",
                      marginTop: 15,
                      marginBottom: 10
                    }
                  ]}
                  resizeMode="cover"
                  source={AppImages.images.buttonBackground}
                >
                  <TouchableOpacity
                    disabled={this.state.disabled}
                    style={[styles.addFriendButton]}
                    onPress={() => {
                      this.setState({ removePopUp: true, disabled: true })
                      setTimeout(() => {
                        this.setState({ disabled: false })
                      }, 1000);

                    }}
                  >
                    <Text style={[styles.addFriendText, { fontWeight: "400" }]}>
                      {I18n.t('Remove_Friend')}
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>

                <TouchableOpacity
                  style={[styles.chatButton, { height: 40, width: '43%', marginTop: 5 }]}
                  onPress={this.chatButton}
                >
                  <Text
                    style={[styles.chatText, { color: AppColor.colors.lightBlue, width: 150, textAlign: 'center' }]}
                  >
                    {I18n.t('Chat')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        {this.props.myPostsState.result.length > 0 && <View style={{
          marginTop: 20,
          alignSelf: 'center', borderBottomWidth: 2, paddingBottom: 5, paddingHorizontal: 15, borderColor: 'black'
        }}>
          <Text style={styles.userPostsText}>{I18n.t('posts')}</Text>
        </View>}
      </View>
    );
  };
  addFriend = () => {
    this.setState({ disabled: true })
    setTimeout(() => {
      this.setState({ disabled: false })
    }, 1000);
    let { navigation } = this.props;
    let data =
      // this.props.route.params?.item?.friendInfo
      //   ? this.props.route.params.item.friendInfo
      //   : this.props.route.params.item?
      //    this.props.route.params.item:
      this.props?.Profile?.profileDetail
    this.props.addFriendAction(data?.id ? data?.id : data?._id, navigation);
  };
  cancelRequest = () => {
    this.setState({ disabled: true })
    setTimeout(() => {
      this.setState({ disabled: false })
    }, 1000);
    let { navigation, route } = this.props;
    let id =
      this.state.key == "add" || this.state.key == "added"
        ? route.params?.item
          ? route.params?.item?.id
            ? route.params?.item?.id
            : route.params?.item?.friendInfo?.id
          : route.params?.item?.friendInfo?.id
        :
        this.props?.Profile?.profileDetail ?
          this.props?.Profile?.profileDetail?._id :
          route.params?.item?.friendInfo?.id;
    this.props.cancelFriendAction(this.props?.Profile?.profileDetail?._id, navigation);
  };

  submitButtonReportUser = () => {
    let { navigation, route } = this.props;
    if (
      this?.state?.textReportUser == "" ||
      this?.state?.textReportUser?.trim()?.length == 0
    ) {
      alert(I18n.t('PleaseEnterReportResion'));
    } else {
      this.setState({ sideMenu: false });
      if (route.params) {
        let id = route.params?.item ? route.params?.item?.id : route.params?.userDetail?._id

        this.props.reportUserAction(id, this?.state?.textReportUser, navigation);
        this.setState({ textReportUser: "" });
      }
    }
  };
  submitButtonReportUser1 = () => {
    if (!this.state.textReportUser1 || this.state.textReportUser1.length < 2) {
      alert(I18n.t('PleaseEnterReportResion'))
    } else {
      this.props.terminalPostReportAction({ post_id: this?.state?.postId, description: this?.state?.textReportUser })
      this.setState({ sideMenu1: false, textReportUser1: null })
    }
  }

  removeFriend = () => {
    let { navigation, route } = this.props;
    let id =
      // route.params?.item?.friendInfo
      //   ? route.params.item.friendInfo.id
      //   :
      this.props?.Profile?.profileDetail ?
        this.props?.Profile?.profileDetail?._id :
        route.params?.item?.id;
    this.props.removeFriendAction(id, navigation);
  };

  setPagination = () => {
    console.log('this.props?.Profile?.profileDetail', this.props?.Profile);

    let data = this.props.route.params?.item?.friendInfo
      ? this.props.route?.params.item?.friendInfo
      : this.props.route?.params.item ?
        this.props.route?.params.item
        : this.props.route?.params.userDetail
      ;

    let { myPostsState, navigation } = this.props;
    console.log('myPostsState?.latestArray?.length', myPostsState?.latestArray?.length);
    if (myPostsState?.latestArray?.length == 20) {
      this.props.myPostAction(this.props?.myPostsState?.result?.length, data?._id ? data?._id : data?.id, this.props.navigation, false);
    }
  };
  refreshControl = () => {
    this.setState({ refresh: true }, () => {
      let data = this.props.route.params?.item?.friendInfo
        ? this.props.route.params.item?.friendInfo
        : this.props.route.params.item ?
          this.props.route.params.item
          : this.props.route?.params.userDetail
        ;

      // this.props.myPostAction(0,data._id?data._id:data.id, this.props.navigation,false);
      this.props.ProfileDataInitate({ navigation: this.props.navigation, userId: data?._id ? data?._id : data?.id })

      setTimeout(() => {
        this.setState({ refresh: false })
      }, 1000);
    })
  }

  render() {

    // let data = this.props.route.params.item?this.props.route.params.item:this.props?.Profile?.profileDetail
    let data = this.props?.Profile?.profileDetail

    let secondIndex = (data?.isFriend == 0 && data?.isFriendRequestSent == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestSent == 1) ?
      1 : data?.isFriend == 1 || data?.friend?.isFriend == 1 ? 2 : (data?.isFriend == 0 && data?.isFriendRequestReceived == 1) || (data?.friend?.isFriend == 0 && data?.friend?.isFriendRequestReceived == 1) ? 3 : 0

    let {
      reportUserState,
      videoPlayState,
      addFriendReducerState,
      myPostsState,
      likeDislikeState,
      cancelFriendState,
      removeFriendState,
      navigation,
      route
    } = this.props;
    return (
      <>
        <Loader
          loading={
            this.props.terminalDetailState.onLoad ||
            removeFriendState.onLoad ||
            reportUserState.onLoad ||
            addFriendReducerState.onLoad ||
            likeDislikeState.onLoad ||
            // myPostsState.onLoad ||
            cancelFriendState.onLoad ||
            videoPlayState.onLoad
          }
        />
        {
          Platform.OS == 'android' ?
            <Header
              ionicV={true}
              headerTitle={this.props?.Profile?.profileDetail?.userName
                ?
                this.props?.Profile?.profileDetail?.userName
                :
                route.params?.userDetail ?
                  route.params?.userDetail.userName :
                  route.params.key == "add" ||
                    route.params.key == "added"
                    ? route.params.item
                      ? route.params.item.name
                        ? route.params.item.name
                        : route.params.item.friendInfo.name
                      : route.params.item.friendInfo.name
                    : route.params.item.friendInfo.name
              }
              // headerTitle={
              //   route.params?.userDetail?
              //   route.params?.userDetail.userName:
              //   route.params.key == "add" ||
              //     route.params.key == "added"
              //     ? route.params.item
              //       ? route.params.item.name
              //         ? route.params.item.name
              //         : route.params.item.friendInfo.name
              //       : route.params.item.friendInfo.name
              //     : route.params.item.friendInfo.name
              // }
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => {
                this.props.timeLinePostDetailClear()
                setTimeout(() => {
                  navigation.goBack()
                }, 100);
              }}
              // rightImageSource={AppImages.images.postDark}
              rightVector={'ellipsis-horizontal'}

              // rightImageSource1Width={20}
              // rightImageSource1Height={20}
              // rightBackBtnPress={navigation.getParam("sideMenu")} 
              rightBackBtnPress={() => {
                this.props?.Profile?.profileDetail ?

                  this?.actionSheet(navigation)
                  : null
              }}
            />
            :
            <View style={{ height: deviceInfoModule.hasNotch() ? Dimensions.get('screen').height * 0.11 : Platform.OS == 'android' ? Dimensions.get('screen').height * 0.105 : Dimensions.get('screen').height * 0.114 }}>
              <Header
                ionicV={true}
                headerTitle={this.props?.Profile?.profileDetail?.userName
                  ?
                  this.props?.Profile?.profileDetail?.userName
                  :
                  route.params?.userDetail ?
                    route.params?.userDetail.userName :
                    route.params.key == "add" ||
                      route.params.key == "added"
                      ? route.params.item
                        ? route.params.item.name
                          ? route.params.item.name
                          : route.params.item.friendInfo.name
                        : route.params.item.friendInfo.name
                      : route.params.item.friendInfo.name
                }
                // headerTitle={
                //   route.params?.userDetail?
                //   route.params?.userDetail.userName:
                //   route.params.key == "add" ||
                //     route.params.key == "added"
                //     ? route.params.item
                //       ? route.params.item.name
                //         ? route.params.item.name
                //         : route.params.item.friendInfo.name
                //       : route.params.item.friendInfo.name
                //     : route.params.item.friendInfo.name
                // }
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => {
                  this.props.timeLinePostDetailClear()
                  setTimeout(() => {
                    navigation.goBack()
                  }, 100);
                }}
                // rightImageSource={AppImages.images.postDark}
                rightVector={'ellipsis-horizontal'}

                // rightImageSource1Width={20}
                // rightImageSource1Height={20}
                // rightBackBtnPress={navigation.getParam("sideMenu")} 
                rightBackBtnPress={() => {
                  this.props?.Profile?.profileDetail ?

                    this?.actionSheet(navigation)
                    : null
                }}
              />
            </View>}
        <View

          // bounces={false}
          // nestedScrollEnabled={true}
          style={styles.mainContainer}
        >

          <View
            style={[
              AppStyles.container,
              { paddingHorizontal: 0 }
            ]}
          >

            <View style={{ paddingHorizontal: 10, flex: 1 }}>
              <GridView
                headerComponent={() => this.userData()}
                refreshing={this.state.refresh}
                refreshControl={() => { this.refreshControl() }}

                onPostPress={(item) => {
                  this.props.timeLinePostDetailClear()

                  let imagesArray = []
                  let userImages = []
                  if (item?.route_post) {
                    if (userImages?.length == 0) {
                      imagesArray.push(imageBaseUrl + item?.route_post?.image + 'type=image')
                      userImages.push({ 'media': item?.route_post?.image, 'thumbnail': '', receipt_private: '0', type: 'timeLine', height: 256, width: 512 })

                    }
                    if (userImages.length > 0) {
                      item.route_post.route_media.map((x, v) => {
                        if (this.state.userDetail && this.state.userDetail == x.user_id) {
                          imagesArray.push(imageBaseUrl + x.media + 'type=image')
                          if (v == 0) {
                            userImages.push(x)
                          } else {
                            userImages.push(x)
                          }

                        }
                        else {
                          if (item?.route_post?.receipt_private == '1') {
                            if (x.type == 'interchange_file') {
                              return true
                            }
                            else {
                              imagesArray.push(imageBaseUrl + x.media + 'type=image')
                              userImages.push(x)
                            }
                          }
                          else {
                            imagesArray.push(imageBaseUrl + x.media + 'type=image')
                            userImages.push(x)
                          }
                        }
                      })
                      item?.route_post?.medias?.length > 0 && item?.route_post?.medias.map((mm, vv) => {
                        if (mm?.is_video) {
                          imagesArray.push(imageBaseUrl + mm.thumbnail + 'type=video')

                          userImages.push({ 'media': mm.url, 'thumbnail': mm.thumbnail, receipt_private: '0', type: 'video', height: mm.thumbnail_height ? mm.thumbnail_height : 16, width: mm.thumbnail_width ? mm.thumbnail_width : 8, itemLength: 10 })



                        }
                        else {
                          imagesArray.push(imageBaseUrl + mm?.url + 'type=image')
                          userImages.push({ 'media': mm.url, 'thumbnail': null, receipt_private: '0', type: 'image', height: mm?.height ? mm?.height : 16, width: mm.width ? mm.width : 8, itemLength: 10 })
                        }
                      })
                    }
                  }
                  else {
                    if (item?.images?.length == 0 && item?.video == null) {

                    }
                    else {
                      if (item?.images) {
                        if (item?.images?.length > 0) {
                          item?.images?.map((x, i) => {
                            imagesArray.push(imageBaseUrl + x.url + 'type=image')

                            userImages.push({ 'media': x?.url, 'thumbnail': null, receipt_private: '0', type: 'timeLine', height: x?.height ? x?.height : 16, width: x?.width ? x?.width : 8, itemLength: item?.images?.length })

                          })
                          if (item?.video) {
                            imagesArray.push(item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image + 'type=video' : imageBaseUrl + item?.video + 'type=image')

                            userImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'video', height: item?.thumbnail_height, width: item?.thumbnail_width, itemLength: item?.images?.length })


                          }
                        }
                        else {
                          imagesArray.push(item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image + 'type=video' : imageBaseUrl + item?.video + 'type=image')
                          userImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: item?.thumbnail_image ? 'video' : 'timeLine', height: item?.thumbnail_height, width: item?.thumbnail_width })


                        }
                      }
                      else {
                        imagesArray.push(item?.thumbnail_image ? imageBaseUrl + item?.thumbnail_image + 'type=video' : imageBaseUrl + item?.video + 'type=image')
                        userImages.push({ 'media': item?.video, 'thumbnail': item?.thumbnail_image ? item?.thumbnail_image : null, receipt_private: '0', type: 'timeLine', height: item?.thumbnail_height, width: item?.thumbnail_width })

                      }
                    }

                  }

                  setTimeout(() => {
                    this.props.navigation.navigate('PostFullView', { index: 0, item: item, userImages: userImages, imagesArray: imagesArray })

                  }, 200);

                }}
                setPagination={() => this.setPagination()}
                data={myPostsState.result}
              />
            </View>
          </View>
          <ReportUser
            onClose={() => this.setState({ sideMenu: false })}

            userDetail={this.props?.Profile?.profileDetail
            }
            loading={this.state.sideMenu}
            anyTap={() => this.setState({ sideMenu: false })}
            caneclButton={() => this.setState({ sideMenu: false })}
            submitButton={this.submitButtonReportUser}
            onChangeText={textReportUser => this.setState({ textReportUser })}
          />
          <RemoveFriend
            onClose={() => this.setState({ removePopUp: false })}
            // userDetail={this.props.route.params.item?this.props.route.params.item:this.props?.Profile?.profileDetail
            // }
            userDetail={this.props?.Profile?.profileDetail
            }
            loading={this.state.removePopUp}
            anyTap={() => this.setState({ removePopUp: false })}
            caneclButton={() => this.setState({ removePopUp: false })}
            submitButton={() => {
              this.setState({ removePopUp: false })
              this.removeFriend()
            }}
          // onChangeText={textReportUser => this.setState({ textReportUser })}
          />
          <ReportPost
            loading={this.state.sideMenu1}
            anyTap={
              () => this.setState({ sideMenu1: false, textReportUser1: null })}
            caneclButton={
              () => this.setState({ sideMenu1: false, textReportUser1: null })}
            submitButton={this.submitButtonReportUser1}
            onChangeText={textReportUser1 => this.setState({ textReportUser1 })}

          />
          <ActionSheet
            ref={o => this.ActionSheet = o}
            options={secondIndex == 3 ?
              [I18n.t('Cancel'), I18n.t('reportUser'), secondIndex == 1 ? I18n.t('Cancel_Friend_Request') : secondIndex == 2 ? I18n.t('Remove_Friend') : secondIndex == 3 ? I18n.t('Accept') : I18n.t('Add_Friend'), secondIndex ? I18n.t('Reject') : null]
              :
              [I18n.t('Cancel'), I18n.t('reportUser'), secondIndex == 1 ? I18n.t('Cancel_Friend_Request') : secondIndex == 2 ? I18n.t('Remove_Friend') : I18n.t('Add_Friend')]}
            cancelButtonIndex={0}
            // destructiveButtonIndex={2}
            onPress={(index) => { this.androidActionSheetPress(index) }}
          />
        </View>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    Profile: state.Profile,
    terminalDetailState: state.TerminalDetailState,
    reportUserState: state.ReportUserState,
    addFriendReducerState: state.AddFriendReducerState,
    myPostsState: state.MyPostsState,
    likeDislikeState: state.LikeDislikeState,
    cancelFriendState: state.CancelFriendState,
    removeFriendState: state.RemoveFriendReducer,
    searchUserState: state.SearchUserState,
    videoPlayState: state.VideoPlayState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      timeLinePostDetailClear,
      friendRequestAction,
      ProfileDataInitate,
      reportUserAction,
      videoPlayAction,
      addFriendAction,
      likeDislikeAction,
      myPostAction,
      cancelFriendAction,
      terminalPostReportAction,
      removeFriendAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameOfTheUser);
