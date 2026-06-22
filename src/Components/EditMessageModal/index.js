import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput
} from "react-native";
import { AppColor } from "./../../Themes";
import styles from "./styles";
import I18n from 'react-native-i18n' 
export default class EditMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  render() {
    const { contactName, phoneNumber, anyTap, invitePress } = this.props;

    return (
      <Modal transparent={true} visible={this.props.visible}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackground}
          onPress={anyTap}
        >
          <View style={styles.container}>
            <View style={styles.inputView}>
              <Text style={styles.titleText}>{this.props.title}</Text>
              
              <TextInput
              maxLength={1000}
                underlineColorAndroid="transparent"
                style={styles.textInputs}
                autoCapitalize={true}
                secureTextEntry={false}
                placeholder={"Enter message"}
                placeholderTextColor={AppColor.colors.placeHolder}
                onChangeText={this.props.onChangeText}
                numberOfLines={5}
                value={this.props.oldmessage}
                multiline={true}
              />
            </View>

            <TouchableOpacity style={styles.buttonView} onPress={invitePress}>
              <Text style={styles.inviteText}>{I18n.t('Submit')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
