import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Keyboard,
  BackHandler,
} from "react-native";
import styles from "./styles";
import {
  Header,
  ReciverChat,
  SenderChat,
  DataManager,
  Loader,
} from "./../../Components";
import { AppImages, DateFormat } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  chatUserHistoryAction,
  oneToOneChatAction,
  addNotificationMessage,
  updateFriendID,
  clearNotifyArray,
  clearChatReducer,
} from "../../Redux/actions/Chat";
import I18n from "react-native-i18n";
import { GiftedChat } from "../../../libs/react-native-gifted-chat";
import KeyboardManager from "react-native-keyboard-manager";
import DeviceInfo from "react-native-device-info";
import { Notifications } from "react-native-notifications";
import { imageBaseUrl } from "../../Config";
import { AFLogEvent } from "../../Config/aws";
var thisParam = null;
const { width, height } = Dimensions.get("window");
class Chat extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         activeOpacity={1}
  //         leftSecondImage={
  //           route.params?.item?.friendInfo?.image !== null
  //             ? (route.params?.item?.friendInfo?.image !==
  //                 undefined &&
  //                 route.params?.item?.friendInfo?.image !==
  //                   null) ||
  //               route.params.item.other_user_detail?.image
  //               ? {
  //                   uri: route.params?.item?.friendInfo
  //                     ? imageBaseUrl +
  //                       route.params?.item?.friendInfo?.image
  //                     : imageBaseUrl +
  //                       route.params.item.other_user_detail?.image,
  //                 }
  //               : AppImages.images.user01
  //             : AppImages.images.user01
  //         }
  //         headerTitle={
  //           route.params.item.friendInfo
  //             ? route.params.item.friendInfo.name
  //             : route.params.item.other_user_detail.name
  //         }
  //         chat={true}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => thisParam.navigationGoBack()}
  //       />
  //     ),
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      sendDisable: false,
      message: "",
      senderID: "",
      currentUser: "",
      chatRefresher: false,
      loadEarlier: true,
      messages: [],
      headerName: this.props.route.params.item.friendInfo
        ? this.props.route.params.item.friendInfo.name
        : this.props.route.params.item.other_user_detail.name,
    };
    this.props.clearChatReducer();
    this.getUserDetails();
    thisParam = this;

    this.props.chatUserHistoryAction(
      this.props.route.params.item,
      this.props.route.params.item.friendInfo
        ? this.props.route.params.item.friendInfo.id
        : this.props.route.params.item.other_user_detail.id,
      this.props.navigation,
      0,
      100
    );
  }

  navigationGoBack() {
    this.props.chatUserHistoryAction(
      this.props.route.params.item,
      this.props.route.params.item.friendInfo
        ? this.props.route.params.item.friendInfo.id
        : this.props.route.params.item.other_user_detail.id,
      this.props.navigation,
      0,
      1,
      true,
      false
    );
    Keyboard.dismiss();

    setTimeout(() => {
      if (this.props.route.params.onNavigationBack) {
        if (this.props.route.params.onNavigationBack()) {
          this.props.route.params.onNavigationBack();
        }
      }
    }, 500);
    setTimeout(() => {
      this.props.navigation.goBack();
      setTimeout(() => {
        this.props.updateFriendID();
      }, 200);
    }, 500);
  }

  getUserDetails() {
    DataManager.getUserDetails().then((response) => {
      if (response !== null) {
        let result = JSON.parse(response);
        this.setState({ senderID: result.data._id, currentUser: result.data });
      } else {
      }
    });
  }
  componentDidMount() {
    AFLogEvent("Chat", { screen: 'Chat' })
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.chatUserHistoryAction(
        this.props.route.params.item,
        this.props.route.params.item.friendInfo
          ? this.props.route.params.item.friendInfo.id
          : this.props.route.params.item.other_user_detail.id,
        this.props.navigation,
        0,
        1,
        true
      );
      Keyboard.dismiss();
      setTimeout(() => {
        if (this.props.route.params.onNavigationBack) {
          if (this.props.route.params.onNavigationBack()) {
            this.props.route.params.onNavigationBack();
          }
        }
      }, 500);
      setTimeout(() => {
        this.props.updateFriendID();
      }, 200);
    });
    Notifications.removeAllDeliveredNotifications();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      if (Platform.OS == "ios") {
        KeyboardManager.setEnable(false);
        KeyboardManager.setEnableAutoToolbar(false);
      }
    });
  }

  componentWillUnmount() {
    if (Platform.OS == "ios") {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableAutoToolbar(true);
    }
  }

  _renderItem = (item) => {
    return this.state.senderID == item?.currentMessage?.user?._id ||
      this.state.senderID == item?.currentMessage?.sender_id ? (
      <SenderChat

        message={item?.currentMessage?.message}
        dateTime={DateFormat.toDateTime(item?.currentMessage?.created_at)}
      />
    ) : (
      <ReciverChat

        message={item?.currentMessage?.message}
        dateTime={DateFormat.toDateTime(item?.currentMessage?.created_at)}
      />
    );
  };
  sendButtonClicked = (messages) => {
    this.setState({ sendDisable: true });
    setTimeout(() => {
      this.setState({ sendDisable: false });
    }, 200);
    let { navigation, route } = this.props;
    if (this.state.message.trim().length > 0) {
      this.props.oneToOneChatAction(
        route.params.item.friendInfo
          ? route.params.item.friendInfo.id
          : route.params.item.other_user_detail.id,
        this.state.message.trim(),
        1,
        navigation
      );
      this.setState({ message: "" });
      setTimeout(() => {
        this.giftedRef.scrollToBottom();
      }, 200);
    }
  };
  handleRefresh = () => {
    let { chatUserHistoryState, oneToOneChatState } = this.props;
    if (
      chatUserHistoryState.currentPageValue < chatUserHistoryState.lastPageValue
    ) {
      if (
        chatUserHistoryState.onLoad == false &&
        oneToOneChatState.onLoad == false
      ) {
        let offset = chatUserHistoryState.currentPageValue * 100;
        let limit = 100;
        this.props.chatUserHistoryAction(
          this.props.route.params.item,
          this.props.route.params.item.friendInfo
            ? this.props.route.params.item.friendInfo.id
            : this.props.route.params.item.other_user_detail.id,
          this.props.navigation,
          offset,
          limit
        );
      }
    } else {
      this.setState({ loadEarlier: false });
    }
  };
  renderSend = (props) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        disabled={this.state.sendDisable}
        style={styles.imageView}
        onPress={() => this.sendButtonClicked(props)}
      >
        <Image
          style={styles.sendImage}
          resizeMode="contain"
          source={AppImages.images.send}
        />
      </TouchableOpacity>
    );
  };
  renderToolbar = (props) => {
    return (
      <View style={styles.renderToolbar}>
        <TextInput
          ref={(InputRef) => (this.InputRef = InputRef)}
          style={[styles.textInput]}
          placeholder={I18n.t("enterMessage")}
          keyboardType={"ascii-capable"}
          returnKeyType={"done"}
          keyboardType={"default"}
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
          multiline={true}
          maxLength={3000}
          autoFocus={false}
        />
      </View>
    );
  };
  renderComposer = (props) => (
    <View style={styles.renderComposer}>{this.renderToolbar(props)}</View>
  );

  render() {
    let { chatUserHistoryState, oneToOneChatState, navigation, route } = this.props;
    return (
      <>
        {
          Platform.OS == 'android' ?
            <Header
              activeOpacity={1}
              leftSecondImage={
                route.params?.item?.friendInfo?.image !== null
                  ? (route.params?.item?.friendInfo?.image !==
                    undefined &&
                    route.params?.item?.friendInfo?.image !==
                    null) ||
                    route.params.item.other_user_detail?.image
                    ? {
                      uri: route.params?.item?.friendInfo
                        ? imageBaseUrl +
                        route.params?.item?.friendInfo?.image
                        : imageBaseUrl +
                        route.params.item.other_user_detail?.image,
                    }
                    : AppImages.images.user01
                  : AppImages.images.user01
              }
              headerTitle={
                route.params.item.friendInfo
                  ? route.params.item.friendInfo.name
                  : route.params.item.other_user_detail.name
              }
              chat={true}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => thisParam.navigationGoBack()}
            />
            :
            <View style={{ flex: 0.13 }}>
              <Header
                activeOpacity={1}
                leftSecondImage={
                  route.params?.item?.friendInfo?.image !== null
                    ? (route.params?.item?.friendInfo?.image !==
                      undefined &&
                      route.params?.item?.friendInfo?.image !==
                      null) ||
                      route.params.item.other_user_detail?.image
                      ? {
                        uri: route.params?.item?.friendInfo
                          ? imageBaseUrl +
                          route.params?.item?.friendInfo?.image
                          : imageBaseUrl +
                          route.params.item.other_user_detail?.image,
                      }
                      : AppImages.images.user01
                    : AppImages.images.user01
                }
                headerTitle={
                  route.params.item.friendInfo
                    ? route.params.item.friendInfo.name
                    : route.params.item.other_user_detail.name
                }
                chat={true}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => thisParam.navigationGoBack()}
              />
            </View>}
        <GiftedChat
          ref={(giftedRef) => (this.giftedRef = giftedRef)}
          messages={this.props.chatUserHistoryState.result}
          onSend={(messages) => this.sendButtonClicked(messages)}
          extraData={this.props}
          renderComposer={(props) => this.renderComposer(props)}
          renderSend={(props) => this.renderSend(props)}
          renderBubble={(props) => this._renderItem(props)}
          loadEarlier={
            chatUserHistoryState.total > chatUserHistoryState.result.length
              ? true
              : false
          }
          onLoadEarlier={() => this.handleRefresh()}
          infiniteScroll={true}
          bottomOffset={DeviceInfo.hasNotch() ? 33 : 0}
          isAnimated={true}
          renderAvatar={null}
        />
        {chatUserHistoryState.result.length < 100 && (
          <Loader loading={chatUserHistoryState.onLoad} />
        )}
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    chatUserHistoryState: state.ChatUserHistoryState,
    oneToOneChatState: state.OneToOneChatState,
    homeState: state.HomeState,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      chatUserHistoryAction,
      updateFriendID,
      oneToOneChatAction,
      addNotificationMessage,
      clearNotifyArray,
      clearChatReducer,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
