import React, { Component } from "react";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import { AppFontFamily } from "./../../Themes";
import styles from "./styles";
import I18n from "react-native-i18n";

export default class MessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  render() {
    const { anyTap, invitePress } = this.props;
    return (
      <Modal transparent={true} visible={this.props.visible}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackground}
          onPress={anyTap}
        >
          <View style={styles.container}>
            <View style={styles.inputView}>
              <Text style={styles.titleText}>
                {I18n.t("Why_we_need_your_phone_number")}
              </Text>
              <Text
                style={[
                  styles.messagetext,
                  {
                    fontFamily: AppFontFamily.fontFamily.museo_500,
                  },
                ]}
              >
                {I18n.t("Citizen_safety_message")}
              </Text>
            </View>

            <TouchableOpacity style={styles.buttonView} onPress={invitePress}>
              <Text style={styles.inviteText}>{I18n.t("OKAY")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
