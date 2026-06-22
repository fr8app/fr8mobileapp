import React, { Component } from "react";
import { SafeAreaView, View, Text } from "react-native";
import styles from "./styles";
import { Button } from "./../../Components";
import I18n from "react-native-i18n";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginAction } from "../../Redux/actions/Authentication";

class ContactPermission extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.loginAction(
      this.props.otpState.phoneNumber,
      this.props.otpState.countryCode,
      this.props.navigation,
      "register"
    );
  }

  buttonView = () => {
    return (
      <View style={styles.bottonContainer}>
        <View style={styles.contactPermissionView}>
          <Text style={[styles.textStyle, { paddingBottom: 20 }]}>
            {I18n.t('Contact_Permission')}
          </Text>
        </View>
        <View style={styles.allowView}>
          <View style={styles.buttonView}>
            <Button
              Text={I18n.t("next")}
              onPress={this.props.onPressAllow}
              customStyles={{
                container: styles.customContainer
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        {this.buttonView()}
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    otpState: state.OTPState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactPermission);
