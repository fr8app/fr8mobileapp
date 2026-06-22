import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions, Keyboard, BackHandler
} from "react-native";
import styles from "./styles";
import {
  Header,
  ReciverChat,
  SenderChat,
  DataManager,
  Loader,
} from "./../../Components";
import { AppImages, DateFormat, AppColor } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  terminalChatAction,
  terminalChatHistoryAction,
  updateFriendID,
  updateFriendIDInTerminal
} from "./../../Redux/actions/Chat";
import I18n from "react-native-i18n";
import { GiftedChat } from "react-native-gifted-chat";
import KeyboardManager from 'react-native-keyboard-manager';
import DeviceInfo from "react-native-device-info";
import { ActivityIndicator } from "react-native";
import { AFLogEvent } from "../../Config/aws";

var thisParam = null;
const { width, height } = Dimensions.get("window");
class TerminalChat extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         // styler={{position:'absolute', zIndex:-1000}}
  //         headerTitle={route.params.item.terminal_name}
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
      data: [],
      loadEarlier: true,
      item: this.props.route.params.item,
      currentUser: "",
    };
    thisParam = this;
    this.getUserDetails();
    this.props.terminalChatHistoryAction(
      this.props.route.params.item._id,
      this.props.navigation,
      0,
      100
    );
  }

  componentDidMount() {
    AFLogEvent("TerminalDetailChat", { screen: 'TerminalDetailChat' })

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.updateFriendIDInTerminal();
    })
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

  navigationGoBack() {
    Keyboard.dismiss()
    this.props.navigation.goBack();

    this.props.updateFriendIDInTerminal();
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

  _renderItem = (item, index) => {
    return this.state.senderID == item?.currentMessage?.user_id?._id ||
      this.state.senderID == item?.currentMessage?.sender_id ? (
      <SenderChat
        key={index}
        // name={
        //   this.state.currentUser.userName !== null ||
        //     this.state.currentUser.userName !== ""
        //     ? this.state.currentUser.userName
        //     : ""
        // }
        name={
          item?.currentMessage?.user_id?.userName ?
            item?.currentMessage?.user_id?.userName :
            this.state.currentUser.userName ? this.state.currentUser.userName : ''
        }
        message={item?.currentMessage?.message}
        dateTime={DateFormat.toDateTime(item?.currentMessage?.created_at)}
      />
    ) : (
      <ReciverChat
        key={index}
        name={item?.currentMessage?.user_id?.userName
        }
        message={item?.currentMessage?.message}
        dateTime={DateFormat.toDateTime(item?.currentMessage?.created_at)}
      />
    );
  };

  sendButtonClicked = () => {
    this.setState({ sendDisable: true })
    setTimeout(() => {
      this.setState({ sendDisable: false })
    }, 200);
    let { navigation } = this.props;
    if (this.state.message.trim().length > 0) {
      this.setState({ message: "" });
      this.props.terminalChatAction(
        this.state.message.trim(),
        this.props.route.params.item._id,
        navigation
      );
      this.giftedRef.scrollToBottom()
    } else {
    }
  };

  handleRefresh = () => {
    let { terminalChatHistoryState } = this.props;
    if (
      terminalChatHistoryState.currentPageValue <
      terminalChatHistoryState.lastPageValue
    ) {
      if (terminalChatHistoryState.onLoad == false) {
        let offset = terminalChatHistoryState.currentPageValue * 100;

        let limit = 100;
        this.props.terminalChatHistoryAction(
          this.props.route.params.item._id,
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
        onPress={() => this.sendButtonClicked()}
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
      <View style={{ justifyContent: 'center', maxHeight: height * 0.07 }}>
        <TextInput
          ref={(InputRef) => this.InputRef = InputRef}
          maxLength={3000}
          style={[styles.textInput]}
          placeholder={I18n.t("enterMessage")}
          keyboardType={"ascii-capable"}
          returnKeyType={"done"}
          keyboardType={"default"}
          value={this.state.message}
          onChangeText={(message) => this.setState({ message })}
          multiline={true}
        />
      </View>

    );
  };
  renderComposer = (props) => (
    <View style={{ flex: 1, justifyContent: 'center', height: height * 0.06 }} >
      {this.renderToolbar(props)}
    </View>
  );
  renderLoading = () => {
    return <View>
      <ActivityIndicator size="large" color={AppColor.colors.lightBlue} />
    </View>
  }
  render() {
    let { terminalChatState, terminalChatHistoryState, navigation, route } = this.props;
    return (
      <>
        {
          Platform.OS == 'android' ?
            <Header
              // styler={{position:'absolute', zIndex:-1000}}
              headerTitle={route.params.item.terminal_name}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => thisParam.navigationGoBack()}
            /> :
            <View style={{ flex: 0.13 }}>
              <Header
                // styler={{position:'absolute', zIndex:-1000}}
                headerTitle={route.params.item.terminal_name}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => thisParam.navigationGoBack()}
              />
            </View>}
        <GiftedChat
          ref={(giftedRef) => this.giftedRef = giftedRef}
          messages={this.props.terminalChatHistoryState.result}
          extraData={this.props}
          renderComposer={(props) => this.renderComposer(props)}
          renderSend={(props) => this.renderSend(props)}
          renderBubble={(props, index) => this._renderItem(props, index)}
          renderAvatar={() => null}
          loadEarlier={terminalChatHistoryState.total > terminalChatHistoryState.result.length ? true : false}
          onLoadEarlier={() => this.handleRefresh()}
          infiniteScroll={false}
          bottomOffset={DeviceInfo.hasNotch() ? 33 : 0}
        />
        {this.props.terminalChatHistoryState.result.length < 100 &&
          <Loader loading={terminalChatHistoryState.onLoad} />
        }
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    terminalChatState: state.TerminalChatState,
    terminalChatHistoryState: state.TerminalChatHistoryState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { terminalChatAction, terminalChatHistoryAction, updateFriendID, updateFriendIDInTerminal },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TerminalChat);
