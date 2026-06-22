import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Platform
} from "react-native";
import styles from "./styles";
import { Button, Header, Loader, EditMessageModal } from "./../../Components";
import { AppImages, Dimensions } from "./../../Themes";
import I18n from "react-native-i18n";
import {
  getContactAction,
  sentInvite
} from "../../Redux/actions/Authentication";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DeviceInfo from 'react-native-device-info';
class InviteContacts extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      editText:
        I18n.t('installMessage'),
      editMessageModal: false,
      contactsArray: [],
      country_code: "+1",
      message: I18n.t('installMessage'),
    };
  }

  componentDidMount() {
    let contacts = this.props.getContactState;
    let contactList = contacts.phoneContacts;
    this.props.getContactAction(contactList);
    setTimeout(() => {
      let result = this.props.getContactState.result.list_users;
      this.setState({ contactsArray: result });
    }, 1000);
  }

  //render empty data view
  emptyResult = () => {
    return (
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyMessageStyle}>{I18n.t('noContact')}</Text>
      </View>
    );
  };

  validate(str) {
    if (str?.startsWith("+") == true) {
      return str;
    } else {
      if (str.length > 10) {
        return "+" + str;
      } else {
        return "+1" + str;
      }
    }
  }

  submitPhoneNo = (index, item) => {
    var newnumber = item.phone_number ? item.phone_number.replace(/[- )(]/g, "") : "";
    let number = this.validate(newnumber);
    this.props.sentInvite(number, this.state.message);
  };

  // method to render list view
  renderItem = ({ item, index }) => {
    var renderNumber = item.phone_number ? item.phone_number.replace(/[- )(]/g, "") : '';

    return (
      <View style={styles.renderView}>
        <View style={styles.textView}>
          <Text numberOfLines={1} style={styles.nameText}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.nameText}>
            {renderNumber}
          </Text>
        </View>
        <View style={styles.buttonView}>
          <Button
            Text={I18n.t('Invite')}
            onPress={() => this.submitPhoneNo(index, item)}
            customStyles={{
              container: styles.customContainer
            }}
          />
        </View>
      </View>
    );
  };
  ////method to open edit message modal
  editMessage = () => {
    this.setState({ editMessageModal: true });
  };

  //method for bottom buttons
  bottomButtons = () => {
    return (
      <View style={{ paddingVertical: 10, width: "100%" }}>
        <View style={styles.bottomButtonView}>
          <Button
            Text={I18n.t('continue')}
            onPress={this.props.continuePress}
            customStyles={{
              container: styles.customBottomButton
            }}
          />
        </View>
        <View style={styles.bottomButtonView}>
          <Button
            Text={I18n.t('editMessage')}
            onPress={this.editMessage}
            customStyles={{
              container: styles.customBottomButton
            }}
          />
        </View>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 15
        }}
      />
    );
  };

  onSubmiitPress() {
    if (this.state.editText.length > 0) {
      this.setState({
        message: this.state.editText,
        editMessageModal: false
      });
    } else {
      this.setState({
        editText: this.state.message,
        editMessageModal: false
      });
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader loading={this.props.getContactState.onLoad} />
        <View style={styles.container}>
          <Header
            headerTitle={I18n.t("Contacts")}
            leftImageSource={AppImages.images.back}
            leftbackbtnPress={this.props.backPress}
            rightHeaderText={I18n.t("Skip")}
            rightBackBtnPress={this.props.rightBackBtnPress}
            customStyles={{
              leftBtnView: { marginRight: 8 },
              container: { paddingTop: 30 },
              ImageBackView: {
                height: Platform.OS == "ios" ? DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ? 75 : 60
                  : DeviceInfo.hasNotch() == true ? 100 : Dimensions.deviceHeight > 600 ? 80 : 60,
              }
            }}
          />
        </View>

        <View style={styles.flatList}>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={this.state.contactsArray}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            ListEmptyComponent={this.emptyResult}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <View style={styles.bottomButtonsView}>{this.bottomButtons()}</View>
        {this.state.editMessageModal == true ? (
          <EditMessageModal
            anyTap={() => this.setState({ editMessageModal: false })}
            onChangeText={editText => this.setState({ editText })}
            visible={this.state.editMessageModal}
            title={I18n.t('editMessage')}
            oldmessage={this.state.editText}
            invitePress={() => this.onSubmiitPress()}
          />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    getContactState: state.GetContactsState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getContactAction,
      sentInvite
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteContacts);
