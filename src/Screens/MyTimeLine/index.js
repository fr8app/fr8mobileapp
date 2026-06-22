import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Share,
  Platform,
  ActionSheetIOS,
  RefreshControl,
  Image,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import styles from "./style";
import {
  Header,
  LiveStreamRender,
  Loader,
  DataManager,
  ReportUser,
} from "./../../Components";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  timeLineGetAction,
  timelinePostLikeAction,
  timeLineShare,
  updateData,
  deleteTimeLinePost,
} from "../../Redux/actions/timeLineAction";
import moment from "moment";
import {
  branchBaseUrl,
  imageBaseUrl,
  version,
  getUSerDetail,
  getPopRef,
} from "../../Config";
import I18n from "react-native-i18n";
import ActionSheet from "react-native-actionsheet";
import { searchUserAction } from "../../Redux/actions/MyFrightingNetwork";
import dateDifferenceInDays from "../../Components/dateDifferenceInDays";
import NetInfo from "@react-native-community/netinfo";
import { clearProfileData } from "../../Redux/actions/profileAction";
import { terminalPostReportAction } from "../../Redux/actions/TerminalDetail";
import { AFLogEvent } from "../../Config/aws";
import PostCreatedSuccessfully from "../../Components/PostCreatedModal";

class TimeLine extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      value: false,
      postId: "",
      DeletepostId: "",
      textReportUser: "",
      imagePressIndex: 0,
      isScrolling: false,
      indexing: 1,
      refresh: false,
      userDetail: null,
      visiblity: false,
      name: "",
      sideMenu: false,
      selectedItem: {},
      likeBtnRef: null,
      scrollEnable: true,
      userImages: [],
      animatedImage: false,
      fadeAnimation: new Animated.Value(0),
      isDoubleTabLiked: false,
      postModal: false,
    };
    this.internetStatus = null;
    this.delayTime = 500;
    this.firstPress = true;
    this.lastTime = new Date();
    this.timer = false;
  }

  componentDidMount() {
    this.setState({ postModal: false });
    AFLogEvent("FR8", { screen: "socket", device: Platform.OS });

    this.checkInternetConnection();
    // this.props?.timeLineGetAction(this.props.navigation, 1)
    this.focusListener = this?.props?.navigation?.addListener("focus", () => {
      this.setState({ isScrolling: true });
      this.props.timeLine.detail = null;
      this.props.timeLine.comment = [];
      this.props.searchUserState.tags = [];
      DataManager.getUserDetails().then(async (response) => {
        if (response) {
          let parseData = await JSON.parse(response);
          this.setState({
            userDetail: parseData?.data?._id
              ? parseData?.data?._id
              : parseData?.data?.id,
            name: parseData.data.userName,
          });
        }
      });
      this.props?.timeLineGetAction(this.props.navigation, 1);
    });
    this.props.navigation.addListener("blur", () => {
      this.setState({ isScrolling: true });
    });
    this.isUserLogin();
  }

  isUserLogin = async () => {
    await DataManager.getUserDetails().then((res) => {
      if (res) {
        this.setState({ value: true });
      }
      this.setState({ value: false });
    });
  };

  isLogin = async () => {
    let data = await getUSerDetail();
    if (data) {
      this.setState({ value: true });
      return true;
    } else {
      this.setState({ value: false });
      return false;
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      if (this.props?.VideoUploadState !== prevProps?.VideoUploadState) {
        console.log(
          ":::::prevProps?.VideoUploadState",
          prevProps?.VideoUploadState
        );
        this.setState({ postModal: prevProps?.VideoUploadState.postCreated });
      }
      if (this?.props?.timeLine !== prevProps?.timeLine) {
        if (this.props.timeLine.postShared == true) {
          this.props.timeLine.postShared = false;
          if (this.props.timeLine.fromDeleted == true) {
            this.props.timeLine.fromDeleted = false;
          } else {
            this?.flatRef?.scrollToOffset(0);
          }
          this?.props?.timeLineGetAction(this.props.navigation, 1);
        }
      }
    }
  }
  androidActionSheetPress = (buttonIndex) => {
    this.setState({ isScrolling: true });
    if (buttonIndex == 1) {
      this.share(this.state.selectedItem);
    } else if (buttonIndex == 2) {
      this.deepShare(this.state.selectedItem);
    }
  };
  androidActionSheetPress2 = async (buttonIndex) => {
    this.setState({ isScrolling: true });
    if (buttonIndex == 1) {
      Alert.alert(
        I18n.t("Alert"),
        I18n.t("deletePostAlert"),
        [
          {
            text: I18n.t("Yes"),
            onPress: async () => {
              let isLogin = await this.isLogin();
              if (isLogin == true) {
                this.props.deleteTimeLinePost(
                  this.state.DeletepostId,
                  this.props.navigation
                );
              } else {
                getPopRef().modalOpen("");
              }
            },
          },
          {
            text: I18n.t("No"),
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else if (buttonIndex == 2) {
      let isLogin = await this.isLogin();
      if (isLogin == true) {
        this.props.navigation.navigate("SharePostEdit", {
          id: this.state?.selectedItem?.shared_post
            ? this.state.selectedItem?.shared_post?._id
            : item._id,
          item: this.state.selectedItem,
          userImages: this.state.userImages,
        });
      } else {
        getPopRef().modalOpen("");
      }
    }
  };
  actionSheet = (item) => {
    this.setState({ selectedItem: item, isScrolling: true });
    Platform.OS == "android"
      ? this.ActionSheet.show()
      : ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [
              I18n.t("Cancel"),
              I18n.t("shareasPost"),
              I18n.t("DeeplinkShare"),
            ],

            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex == 1) {
              this.share(item);
            } else if (buttonIndex == 2) {
              this.deepShare(item);
            }
          }
        );
  };
  share = async (item) => {
    this.setState({ isScrolling: true });
    let isLogin = await this.isLogin();
    if (isLogin == true) {
      this.props.navigation.navigate("SharePost", {
        id: item.shared_post ? item.shared_post._id : item._id,
        item: item,
        userImages: this.state.userImages,
      });
    } else {
      getPopRef().modalOpen(
        "You seem to like this post \nSetting up your profile allows you to share posts, and unlocks other FR8 app features that work for you"
      );
    }
  };

  deepShare = async (item) => {
    this.setState({ isScrolling: true });
    try {
      const result = await Share.share(
        {
          message: this.state.name
            ? Platform.OS == "ios"
              ? this.state.name + I18n.t("postShareMessage")
              : item.route_post
              ? this.state.name +
                I18n.t("postShareMessage") +
                "\n" +
                branchBaseUrl +
                item._id +
                "?type=global_post&version=" +
                version
              : this.state.name +
                I18n.t("postShareMessage") +
                "\n" +
                branchBaseUrl +
                item._id +
                "?type=global_post&version=" +
                version
            : Platform.OS == "ios"
            ? this.state.name + I18n.t("postShareMessage2")
            : item.route_post
            ? this.state.name +
              I18n.t("postShareMessage2") +
              "\n" +
              branchBaseUrl +
              item._id +
              "?type=global_post&version=" +
              version
            : this.state.name +
              I18n.t("postShareMessage2") +
              "\n" +
              branchBaseUrl +
              item._id +
              "?type=global_post&version=" +
              version,
          title: "FR8",
          url: item.route_post
            ? branchBaseUrl + item._id + "?type=global_post&version=" + version
            : branchBaseUrl + item._id + "?type=global_post&version=" + version,
        },
        {
          subject: I18n.t("shareSubject"),
        }
      );
      if (result.action == Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action == Share.dismissedAction) {
      }
    } catch (e) {
      console.log(e);
    }
  };

  likePress = async (item, val) => {
    this.setState({ isScrolling: true });
    let data = await getUSerDetail();
    console.log("data", data);
    if (data) {
      if (item.is_like == true && !val) {
        this.props.timelinePostLikeAction(
          item._id,
          "2",
          this.props.navigation,
          item.is_like,
          null
        );
      } else {
        switch (val) {
          case 1:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "like"
            );
            break;
          case 2:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "dislike"
            );
            break;
          case 3:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "grinningSmile"
            );
            break;
          case 4:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "angry"
            );
            break;
          case 5:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "confuse"
            );
            break;
          case 6:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "thinking"
            );
            break;
          default:
            this.props.timelinePostLikeAction(
              item._id,
              "1",
              this.props.navigation,
              item.is_like,
              "like"
            );
        }
      }
    } else {
      console.log("kkkkkkk", getPopRef());
      getPopRef().modalOpen(
        "Your user access is limited \nSetting up your profile allows you to like, and unlocks other FR8 app features that work for you"
      );
    }
  };
  checkInternetConnection() {
    NetInfo.addEventListener((state) =>
      this.handleConnectionChange(state.isConnected)
    );
  }
  handleConnectionChange = (isConnected) => {
    this.setState({ isScrolling: true });
    this.internetStatus = isConnected;
  };
  onProductImageDoubleTap = (item) => {
    this.fadeIn(item);
  };
  fadeIn = (item) => {
    item.isDoubleTabLiked = true;
    this.props.timelinePostLikeAction(
      item._id,
      "1",
      this.props.navigation,
      item.is_like,
      "like"
    );
    this.setState({ animatedImage: true });
    Animated.timing(this.state.fadeAnimation, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      this.fadeOut();
      item.imagePressIndex = false;
      item.isDoubleTabLiked = false;
    }, 1800);
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      this.setState({ animatedImage: false, disabled: false });
    }, 1000);
  };

  //doubleTab
  _onTap = async (index, item, userImages, imagesArray) => {
    this.setState({ isScrolling: true });
    let data = await getUSerDetail();
    console.log("data", data);
    if (data) {
      let now = new Date().getTime();
      if (this.firstPress) {
        this.firstPress = false;
        this.timer = setTimeout(() => {
          this.setState({ isScrolling: true });
          this.props.navigation.navigate("PostFullView", {
            index: index,
            item: item,
            userImages: userImages,
            imagesArray: imagesArray,
          });
          this.firstPress = true;
          this.timer = false;
        }, this.delayTime);

        // mark the last time of the press
        this.lastTime = now;
      } else {
        if (now - this.lastTime < this.delayTime) {
          this.timer && clearTimeout(this.timer);
          this.setState({ disabled: true, imagePressIndex: index });
          item.imagePressIndex = true;
          this.onProductImageDoubleTap(item);
          this.firstPress = true;
        }
      }
    } else {
      getPopRef().modalOpen(
        "Your user access is limited \nSetting up your profile allows you to like, and unlocks other FR8 app features that work for you"
      );
    }
  };
  submitButtonReportUser = () => {
    if (!this.state.textReportUser || this.state.textReportUser.length == 0) {
      alert(I18n.t("PleaseEnterReportResion"));
    } else {
      this.props.terminalPostReportAction({
        post_id: this.state.postId,
        description: this.state.textReportUser,
      });
      this.setState({ sideMenu: false, textReportUser: null });
    }
  };
  deletePost = (item) => {
    this.setState({
      DeletepostId: item._id,
      isScrolling: true,
      selectedItem: item,
    });
    if (Platform.OS == "android") {
      this.ActionSheet2.show();
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [I18n.t("Cancel"), I18n.t("Delete"), I18n.t("Edit")],

          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex == 1) {
            this.setState({ isScrolling: true });
            Alert.alert(
              I18n.t("Alert"),
              I18n.t("deletePostAlert"),
              [
                {
                  text: I18n.t("Yes"),
                  onPress: () => {
                    this.props.deleteTimeLinePost(
                      this.state.DeletepostId,
                      this.props.navigation
                    );
                  },
                },
                {
                  text: I18n.t("No"),
                  onPress: () => {},
                },
              ],
              { cancelable: false }
            );
          } else if (buttonIndex == 2) {
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              this.props.navigation.navigate("SharePostEdit", {
                id: item.shared_post ? item.shared_post._id : item._id,
                item: item,
                userImages: this.state.userImages,
              });
            } else {
              getPopRef().modalOpen("");
            }
          }
        }
      );
    }
  };
  _renderItem = ({ item, index }) => {
    let imagesArray = [];
    let userImages = [];
    if (item?.route_post) {
      if (userImages?.length == 0) {
        imagesArray.push(imageBaseUrl + item?.route_post?.image + "type=image");
        userImages.push({
          imageThumbnail: item?.route_post?.image,
          media: item?.route_post?.image,
          thumbnail: "",
          receipt_private: "0",
          type: "timeLine",
          height: 256,
          width: 512,
        });
      }
      if (userImages.length > 0) {
        item.route_post.route_media.map((x, v) => {
          x.imageThumbnail = x.thumbnail;
          if (this.state.userDetail && this.state.userDetail == x.user_id) {
            imagesArray.push(imageBaseUrl + x.media + "type=image");
            userImages.push(x);
          } else {
            if (item?.route_post?.receipt_private == "1") {
              if (x.type == "interchange_file") {
                return true;
              } else {
                imagesArray.push(imageBaseUrl + x.media + "type=image");
                userImages.push(x);
              }
            } else {
              imagesArray.push(imageBaseUrl + x.media + "type=image");
              userImages.push(x);
            }
          }
        });
        item?.route_post?.medias?.length > 0 &&
          item?.route_post?.medias.map((mm, vv) => {
            if (mm?.is_video) {
              imagesArray.push(imageBaseUrl + mm.thumbnail + "type=video");
              userImages.push({
                imageThumbnail: mm?.thumbnail,
                media: mm.url,
                thumbnail: mm.thumbnail,
                receipt_private: "0",
                type: "video",
                height: mm.thumbnail_height ? mm.thumbnail_height : 16,
                width: mm.thumbnail_width ? mm.thumbnail_width : 8,
                itemLength: 10,
              });
            } else {
              imagesArray.push(imageBaseUrl + mm?.url + "type=image");
              userImages.push({
                imageThumbnail: mm?.thumbnail,
                media: mm.url,
                thumbnail: null,
                receipt_private: "0",
                type: "image",
                height: mm?.height ? mm?.height : 16,
                width: mm.width ? mm.width : 8,
                itemLength: 10,
              });
            }
          });
      }
    } else {
      if (item?.images?.length == 0 && item?.video == null) {
      } else {
        if (item?.images) {
          if (item?.images?.length > 0) {
            item?.images?.map((x, i) => {
              imagesArray.push(imageBaseUrl + x.url + "type=image");
              userImages.push({
                imageThumbnail: x?.thumbnail ? x?.thumbnail : x?.url,
                media: x?.url,
                thumbnail: null,
                receipt_private: "0",
                type: "timeLine",
                height: x?.height ? x?.height : 16,
                width: x?.width ? x?.width : 8,
                itemLength: item?.images?.length,
              });
            });
            if (item?.video) {
              imagesArray.push(
                item?.thumbnail_image
                  ? imageBaseUrl + item?.thumbnail_image + "type=video"
                  : imageBaseUrl + item?.video + "type=image"
              );
              userImages.push({
                imageThumbnail: item?.thumbnail
                  ? item?.thumbnail
                  : item?.thumbnail_image,
                media: item?.video,
                thumbnail: item?.thumbnail_image ? item?.thumbnail_image : null,
                receipt_private: "0",
                type: "video",
                height: item?.thumbnail_height,
                width: item?.thumbnail_width,
                itemLength: item?.images?.length,
              });
            }
          } else {
            imagesArray.push(
              item?.thumbnail_image
                ? imageBaseUrl + item?.thumbnail_image + "type=video"
                : imageBaseUrl + item?.video + "type=image"
            );
            userImages.push({
              imageThumbnail: item?.thumbnail
                ? item?.thumbnail
                : item?.thumbnail_image,
              media: item?.video,
              thumbnail: item?.thumbnail_image ? item?.thumbnail_image : null,
              receipt_private: "0",
              type: item?.thumbnail_image ? "video" : "timeLine",
              height: item?.thumbnail_height,
              width: item?.thumbnail_width,
            });
          }
        } else {
          imagesArray.push(
            item?.thumbnail_image
              ? imageBaseUrl + item?.thumbnail_image + "type=video"
              : imageBaseUrl + item?.video + "type=image"
          );
          userImages.push({
            imageThumbnail: item?.thumbnail
              ? item?.thumbnail
              : item?.thumbnail_image,
            media: item?.video,
            thumbnail: item?.thumbnail_image ? item?.thumbnail_image : null,
            receipt_private: "0",
            type: "timeLine",
            height: item?.thumbnail_height,
            width: item?.thumbnail_width,
          });
        }
      }
    }
    return (
      <>
        <LiveStreamRender
          isSelf={
            item?.shared_by
              ? item?.shared_by?._id == this.state.userDetail
                ? true
                : null
              : // :
                // this.state.userDetail == item?.user?._id ?
                //   true
                null
          }
          openActionSheet={async () => {
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              this.setState({ userImages: userImages });
              item?.shared_by
                ? item?.shared_by?._id == this.state.userDetail
                  ? this.deletePost(item)
                  : null
                : this.state.userDetail == item?.user?._id
                ? this.deletePost(item)
                : null;
            } else {
              getPopRef().modalOpen("");
            }
          }}
          itemIndex={index}
          isDoubleTabLiked={item.isDoubleTabLiked}
          isAnimated={this.state.animatedImage}
          opacityOFImage={this.state.fadeAnimation}
          doubleTab={async () => {
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              this.onProductImageDoubleTap(item);
              item.imagePressIndex = true;
              this.setState({ disabled: true, imagePressIndex: index });
            } else {
              getPopRef().modalOpen(
                "Your user access is limited \nSetting up your profile allows you to like, and unlocks other FR8 app features that work for you"
              );
            }
          }}
          imagePressIndex={item?.imagePressIndex}
          sharePostDetail={item.share}
          cardRef={(ref) => {
            this.LiveStreamRef = ref;
          }}
          isScrolling={this.state.isScrolling}
          shareCountPress={async () => {
            this.setState({ isScrolling: true });
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              this.props.navigation.navigate("ShareUsers", { item: item });
            } else {
              getPopRef().modalOpen("");
            }
          }}
          isLikedQuick={(val) => {
            this.likePress(item, val);
          }}
          selectedEmoji={(val) => {
            this.likePress(item, val);
          }}
          likeButtonPressIn={() => {
            this.setState({ isScrolling: true }, () => {
              this.setState({ scrollEnable: false, isScrolling: false });
            });
          }}
          likeButtonPressOut={(icon) => {
            this.setState({ scrollEnable: true });
          }}
          onLikeCountPress={async () => {
            this.setState({ isScrolling: true });
            this.props.timeLine.likedUserList = [];
            this.props.timeLine.reactionCount = null;
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              this.props.navigation.navigate("LikeListing", {
                item: item,
                type: "post",
              });
            } else {
              getPopRef().modalOpen("");
            }
          }}
          likeRef={(ref) => {
            this.likeBtnRef = ref;
          }}
          onUserPress={async () => {
            this.setState({ isScrolling: true });
            let isLogin = await this.isLogin();
            console.log("isLogin", isLogin);
            if (isLogin == true) {
              if (
                this.state.userDetail !== null &&
                this.state.userDetail !== undefined
              ) {
                if (item.shared_by) {
                  if (this.state.userDetail !== item?.shared_by?._id) {
                    this.props.clearProfileData();
                    this.props.navigation.navigate("NameOfTheUser", {
                      key: null,
                      userDetail: item.shared_by,
                    });
                  } else {
                    this.props.clearProfileData();
                    this.props.navigation.navigate("SelfUserProfileDetail", {
                      key: null,
                      userDetail: item.shared_by,
                    });
                  }
                } else {
                  if (this.state.userDetail !== item?.user?._id) {
                    this.props.clearProfileData();

                    this.props.navigation.navigate("NameOfTheUser", {
                      key: null,
                      userDetail: item.user,
                    });
                  } else {
                    this.props.clearProfileData();
                    this.props.navigation.navigate("SelfUserProfileDetail", {
                      key: null,
                      userDetail: item.user,
                    });
                  }
                }
              }
            } else {
              getPopRef().modalOpen("");
            }
          }}
          ratio={
            userImages?.length == 1
              ? userImages[0]?.width / userImages[0]?.height
              : 1.67
          }
          ImagePress={async (index) => {
            this.setState({ isScrolling: true });
            let data = await getUSerDetail();
            console.log("data", data);
            if (data) {
              let itemData = { ...item };
              if (item.shared_post) {
                itemData._id = item.shared_post._id;
              }
              this.props.updateData(item.is_like);
              this.props.navigation.navigate("PostFullView", {
                index: index,
                item: itemData,
                userImages: userImages,
                imagesArray: imagesArray,
              });
            } else {
              getPopRef().modalOpen("");
            }
          }}
          onSharedPostPress={async (index) => {
            this.setState({ isScrolling: true });
            let itemData = { ...item };
            if (item.shared_post) {
              itemData._id = item.shared_post._id;
            }
            let data = await getUSerDetail();
            if (data) {
              this.props.updateData(item.is_like);
              this.props.navigation.navigate("PostFullView", {
                index: index,
                item: itemData,
                userImages: userImages,
                imagesArray: imagesArray,
              });
            } else {
              getPopRef().modalOpen("");
            }
          }}
          shared_post={item.shared_post}
          imagesArray={imagesArray}
          postLocation={item?.post_location}
          onOtherPress={() =>
            this.props.navigation.navigate("TagFriends", {
              item: item.tag_friends,
            })
          }
          tags={item.tag_friends?.length > 0 ? item.tag_friends : null}
          terminalName={
            item.route_post ? item.route_post?.terminal?.terminal_name : null
          }
          shared_by={item?.shared_by ? item.shared_by?.userName : null}
          totalComment={item.total_comments}
          totalLike={item.total_likes}
          totalShare={item.total_shares}
          isLike={item.is_like}
          reactionType={item.reactionType ? item.reactionType.type : null}
          likeImage={
            item.is_like == true
              ? AppImages.images.like
              : AppImages.images.notLike
          }
          onPress={async () => {
            this.setState({ isScrolling: true });
            let data = await getUSerDetail();
            console.log("data", data);
            if (data) {
              this.props.navigation.navigate("PostFullView", {
                index: index,
                item: item,
                userImages: userImages,
                imagesArray: imagesArray,
              });
            } else {
              getPopRef().modalOpen("");
            }
          }}
          onSharePress={() => {
            this.setState({ userImages: userImages });
            this.actionSheet(item);
          }}
          onCommentPress={async () => {
            this.setState({ isScrolling: true });
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              this.props.navigation.navigate("comments", {
                item: item,
                imagesArray: imagesArray,
                userImages: userImages,
              });
            } else {
              getPopRef().modalOpen(
                "Your user access is limited \nSetting up your profile allows you to comment, and unlocks other FR8 app features that work for you"
              );
            }
          }}
          type={item.route_post ? "timeLinePosts" : "timeLinePosts"}
          startVideo={(res, thumb) =>
            this.props.navigation.navigate("VideoPreview", {
              response: res,
              thumbnail: thumb,
              terminalResult: { id: item.id },
              screen: "timeLineDetail",
              type: "video",
            })
          }
          playPress={(ref) => (this.player = ref)}
          createdDate={dateDifferenceInDays(item.created_at)}
          userPostResized={"cover"}
          receipt={
            item.route_post
              ? item.route_post.receipt_private == false
                ? "0"
                : "1"
              : "0"
          }
          dis={
            item.route_post
              ? ((item?.route_post?.distance / 1000) * 0.621371).toFixed(2)
              : "0"
          }
          startTime={
            item.route_post
              ? moment(item.route_post.start_time).format("HH:mm")
              : null
          }
          endTime={
            item.route_post
              ? moment(item.route_post.end_time).format("HH:mm")
              : null
          }
          timeLineScreen={true}
          onSharedUserPress={async () => {
            let isLogin = await this.isLogin();
            if (isLogin == true) {
              if (this.state.userDetail !== item?.user?._id) {
                this.props.clearProfileData();
                this.props.navigation.navigate("NameOfTheUser", {
                  key: null,
                  userDetail: item.user,
                });
              } else {
                this.props.clearProfileData();
                this.props.navigation.navigate("SelfUserProfileDetail", {
                  key: null,
                  userDetail: item.user,
                });
              }
            } else {
              getPopRef().modalOpen("");
            }
          }}
          mainUser={item.user.userName}
          sharedUSerDetail={item.shared_by}
          userImage={
            item.user.profile !== "" && item.user.profile !== null
              ? { uri: imageBaseUrl + item.user.profile }
              : AppImages.images.user01
          }
          sharedUserImage={
            item.shared_by
              ? item.shared_by.profile !== "" && item.shared_by.profile !== null
                ? { uri: imageBaseUrl + item.shared_by.profile }
                : AppImages.images.user01
              : null
          }
          userName={item.user.userName}
          minute={item.route_post ? this.getTime(item.route_post.minute) : ""}
          discription={item.description}
          mediaImages={userImages}
          postSource={{
            uri: item.route_post
              ? imageBaseUrl + item.route_post.image
              : item.media_type == "video"
              ? imageBaseUrl + item.thumbnail_image
              : imageBaseUrl + item.video,
          }}
        />
      </>
    );
  };

  setPagination = () => {
    if (this.props.timeLine.latestArray.length == 10) {
      this.props.timeLineGetAction(
        this.props.navigation,
        this.props.timeLine.array.length
      );
    }
  };
  refreshControl = () => {
    this.setState({ refresh: true, isScrolling: true }, () => {
      this.props.timeLineGetAction(this.props.navigation, 1);
      setTimeout(() => {
        this.setState({ refresh: false });
      }, 1000);
    });
  };
  getTime = (seconds) => {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : "";
    var mDisplay =
      m > 0
        ? [s > 29 ? m + 1 : m] +
          (m == 1 ? " " + I18n.t("mins") + " " : " " + I18n.t("mins") + " ")
        : [s > 29 ? "1 " : "0 "] + I18n.t("mins");
    if (h > 0) {
      return hDisplay + mDisplay;
    } else {
      return mDisplay;
    }
  };

  render() {
    return (
      <>
        {Platform.OS == "android" ? (
          <Header headerTitle={I18n.t("posts")} />
        ) : (
          <View style={{ flex: Platform.OS == "android" ? 0.11 : 0.13 }}>
            <Header headerTitle={I18n.t("posts")} />
          </View>
        )}
        <View style={styles.mainContainer}>
          {/* Report User not used  */}
          <ReportUser
            onClose={() => this.setState({ sideMenu: false })}
            loading={this.state.sideMenu}
            anyTap={() => this.setState({ sideMenu: false })}
            caneclButton={() => this.setState({ sideMenu: false })}
            submitButton={this.submitButtonReportUser}
            onChangeText={(textReportUser) => this.setState({ textReportUser })}
          />
          <Loader loading={this.props.timeLine.onLoad} />
          <View style={styles.inlineContainer}>
            <FlatList
              onScroll={() => this.setState({ isScrolling: true })}
              scrollEnabled={this.state.scrollEnable}
              ref={(ref) => (this.flatRef = ref)}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  onRefresh={() => {
                    this.refreshControl();
                  }}
                  refreshing={this.state.refresh}
                  tintColor="silver"
                />
              }
              style={[styles.inlineContainer, { paddingTop: 5 }]}
              ListEmptyComponent={
                <View style={styles.listEmptyComponentView}>
                  <Text style={styles.noValueText}>
                    {!this.props.timeLine.isLoad
                      ? I18n.t("loading")
                      : I18n.t("TimeLine_post_not_found")}
                  </Text>
                </View>
              }
              bounces={true}
              contentContainerStyle={styles.flatList}
              data={this.props.timeLine.array}
              extraData={this.props}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (!this.onEndReachedCalledDuringMomentum) {
                  this.setPagination();
                  this.onEndReachedCalledDuringMomentum = true;
                }
              }}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
            />
          </View>
          <TouchableOpacity
            onPress={async () => {
              this.setState({ isScrolling: true });
              let data = await getUSerDetail();
              console.log("data", data);
              // if (data) {
              this.props.navigation.navigate("TimeLinePostCreate", {
                screen: "global",
                item: null,
                interChange: [],
                equipment: [],
                video: [],
                receiptPrivate: 0,
                mediaImages: [],
              });
              // }
              // else {
              //   console.log('kkkkkkk', getPopRef());
              //   getPopRef().modalOpen('You discovered a FR8 app feature!\nSetting up your profile allows you to post, comment on posts, and unlock other FR8 app features that work for you')
              // }
            }}
            activeOpacity={0.7}
            style={styles.postButton}
          >
            <Image
              resizeMode="contain"
              style={{ height: 70, width: 70 }}
              source={require("../../Images/12.png")}
            />
          </TouchableOpacity>
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            options={[
              I18n.t("Cancel"),
              I18n.t("shareasPost"),
              I18n.t("DeeplinkShare"),
            ]}
            cancelButtonIndex={0}
            onPress={(index) => {
              this.androidActionSheetPress(index);
            }}
          />
          <ActionSheet
            ref={(o) => (this.ActionSheet2 = o)}
            options={[I18n.t("Cancel"), I18n.t("Delete"), I18n.t("Edit")]}
            cancelButtonIndex={0}
            onPress={(index) => {
              this.androidActionSheetPress2(index);
            }}
          />
        </View>
        {console.log(":::::this.state.postModal ",this.state.postModal )}
        {this.state.postModal && (
          <PostCreatedSuccessfully
            navigation={this.props.navigation}
            visible={this.state.postModal}
            message={"Your post created successfully."}
            okButton={() => {
              this.setState({ postModal: false });
              this.props.navigation.navigate("EditProfile", {
                addProfile: "Add Profile",
              });
            }}
            cancelButton={() => this.setState({ postModal: false })}
          />
        )}
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    timeLine: state.timeLine,
    searchUserState: state.SearchUserState,
    terminalDetail: state.TerminalDetailState,
    VideoUploadState: state.VideoUploadState,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      timeLineGetAction,
      timelinePostLikeAction,
      terminalPostReportAction,
      deleteTimeLinePost,
      timeLineShare,
      searchUserAction,
      updateData,
      clearProfileData,
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLine);
