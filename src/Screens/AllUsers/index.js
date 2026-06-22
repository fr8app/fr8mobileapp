import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  SectionList,
  Platform,
} from "react-native";
import styles from "./styles";
import { Header, UserRender, Loader } from "./../../Components";
import { AppStyles, AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { myFriendAction } from "./../../Redux/actions/Friends";
import I18n from "react-native-i18n";
import { imageBaseUrl } from "../../Config";
import { AFLogEvent } from "../../Config/aws";

class AllUsers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      refreshing: false,
    };
    this.props.myFriendAction([], this.props.navigation);
    AFLogEvent("AllUsers", { screen: 'AllUsers' })

  }
  _renderItem = ({ item, index }) => {
    return item.isFriend == 1 ? (
      <UserRender
        chat
        userImageSource={
          item.profile
            ? { uri: imageBaseUrl + item.profile }
            : AppImages.images.user01
        }
        tittleText={item.name}
        onPress={() => {
          this.props.chatUserHistoryState.friendUserId = null;
          this.props.navigation.navigate("Chat", {
            item: {
              other_user_detail: {
                name: item.name,
                id: item.id,
                image: item.profile,
              },
            },
            onNavigationBack: () => this.onNavigationBack(),
          });
        }}
      />
    ) : null;
  };
  onNavigationBack = () => {
    this.props.myFriendAction([], this.props.navigation);
  };
  onNavigationBack = () => {
    this.props.myFriendAction([], this.props.navigation);
  };


  refreshControl = () => {
    this.setState({ refreshing: true });
    this.props.myFriendAction([], this.props.navigation);
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 2000);
  };
  render() {
    let { myFriendsState } = this.props;

    return (
      <View style={styles.mainContainer}>
        {
          Platform.OS == 'android' ?
            <Header
              headerTitle={I18n.t("Users")}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => this.props.navigation.goBack()}
            />
            :
            <View style={{ flex: 0.13 }}>
              <Header
                headerTitle={I18n.t("Users")}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => this.props.navigation.goBack()}
              />
            </View>}
        <Loader whiteColor loading={myFriendsState.onLoad} />
        <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
          {myFriendsState.result.length > 0 &&
            myFriendsState.result[0].data.length == 0 ? (
            <View style={styles.listEmptyComponentView}>
              <Text style={styles.noValueText}>{I18n.t("noUser")}</Text>
            </View>
          ) : (
            <SectionList
              // bounces={false}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refreshControl()}
              sections={myFriendsState.result}
              extraData={this.state}
              style={{ paddingVertical: 10 }}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    myFriendsState: state.MyFriendsState,
    chatUserHistoryState: state.ChatUserHistoryState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ myFriendAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllUsers);
