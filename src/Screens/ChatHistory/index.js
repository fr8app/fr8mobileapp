import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image, TextInput, Platform } from "react-native";
import styles from "./styles";
import { Header, UserRender, EmptyComponentList } from "../../Components";
import { AppStyles, AppImages, DateFormat } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { chatHistoryAction, updateFriendID } from "../../Redux/actions/Chat";
import I18n from "react-native-i18n";
import { imageBaseUrl } from "../../Config";
import PushNotification from "../../PushManager";
import { AFLogEvent } from "../../Config/aws";
let _this;
class ChatHistory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      refreshing: false,
      searchText: "",
    };
    _this = this;
    // this.props.chatHistoryAction(this.props.navigation);
  }
  componentDidMount() {
    AFLogEvent("ChatHistory", { screen: 'ChatHistory' })
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.setState({ searchText: "" });
      this.props.chatHistoryAction(this.props.navigation, "");
    });
    PushNotification.init(this.props);
  }
  navBack = () => {
    this.props.homeState.unreadCount = this.props.chatHistoryState.chatCounterget;
    this.props.route.params.onNavigationBack();
    this.props.navigation.goBack();
  };
  _renderItem = ({ item, index }) => {
    return (
      <UserRender
        chat={true}
        userImageSource={
          item.other_user_detail.image
            ? { uri: imageBaseUrl + item.other_user_detail.image }
            : AppImages.images.user01
        }
        tittleText={item.other_user_detail.name}
        descText={item.message}
        unread={item.unread}
        timeText={DateFormat.toTime(item.created_at)}
        dateText={DateFormat.toDate(item.created_at)}
        onPress={() => {
          this.props.navigation.navigate("Chat", {
            item,
            onNavigationBack: () => this.onNavigationBack(),
          });
        }}
      />
    );
  };

  onNavigationBack = () => {
    this.props.chatHistoryAction(this.props.navigation, "");
  };

  searchView = () => {
    return (
      <View style={styles.mainSearchView}>
        <Image
          resizeMode="contain"
          style={styles.searchImage}
          source={AppImages.images.search}
        />
        <TextInput
          style={styles.searchText}
          placeholder={I18n.t("friendSearch")}
          keyboardType={"ascii-capable"}
          returnKeyType={"done"}
          multiline={false}
          value={this.state.searchText}
          onChangeText={(searchText) => this.searchUser(searchText)}
        />
      </View>
    );
  };

  searchUser = (text) => {
    this.setState({ searchText: text });
    this.props.chatHistoryAction(this.props.navigation, text);
    // this.props.searchUserAction(text, 0, this.props.navigation);
  };

  render() {
    let { chatHistoryState } = this.props;

    return (
      <>
        {
          Platform.OS == 'android' ?
            <Header
              rightImageSource1Width={25}
              rightImageSource1Height={25}
              headerTitle={I18n.t("ChatHistory")}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => this.navBack()}
              rightImageSource={require("../../Images/postadd.png")}
              customStyles={{
                leftBtnView: { marginRight: 7 },
              }}
              rightBackBtnPress={() => this.props.navigation.navigate("AllUsers")}
            />
            :
            <View style={{ flex: 0.13 }}>
              <Header
                rightImageSource1Width={25}
                rightImageSource1Height={25}
                headerTitle={I18n.t("ChatHistory")}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => this.navBack()}
                rightImageSource={require("../../Images/postadd.png")}
                customStyles={{
                  leftBtnView: { marginRight: 7 },
                }}
                rightBackBtnPress={() => this.props.navigation.navigate("AllUsers")}
              />
            </View>}
        <SafeAreaView style={styles.mainContainer}>
          <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
            {this.searchView()}
            {chatHistoryState.result.length > 0 ? (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                bounces={true}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.props.chatHistoryAction(this.props.navigation, "");
                  this.setState({ refreshing: true }, () => {
                    setTimeout(() => {
                      this.setState({ refreshing: false });
                    }, 2000);
                  });
                }}
                contentContainerStyle={{ paddingVertical: 10 }}
                data={chatHistoryState.result}
                extraData={[this.state, this.props, chatHistoryState.result]}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <EmptyComponentList height="80%" title={I18n.t("No_chat_found")} />
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatHistoryState: state.ChatHistoryState,
    chatUserHistoryState: state.ChatUserHistoryState,
    homeState: state.HomeState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ chatHistoryAction, updateFriendID }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatHistory);
