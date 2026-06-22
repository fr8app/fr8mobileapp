import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import { CachedImage } from "./../react-native-cached-image-master";

export default class Fr8ers extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.mainView} onPress={this.props.listPress}>
        {this.props.userImageSource ? (
          <View style={styles.userImageView}>
            <CachedImage
              source={this.props.userImageSource}
              resizeMode="cover"
              style={styles.userImage}
            />
          </View>
        ) : null}

        <View style={styles.textView}>
          <Text numberOfLines={1} style={styles.tittleText}>
            {this.props.tittleText}
          </Text>
          {this.props.descText ? (
            <Text numberOfLines={1} style={styles.descText}>
              {this.props.descText}
            </Text>
          ) : null}
        </View>

        <View style={styles.buttonView}>
          {this.props.addUserImage ? (
            <TouchableOpacity
              style={styles.addUserImage}
              onPress={this.props.addUserClicked}
            >
              <CachedImage
                style={styles.addUserImage}
                resizeMode="contain"
                source={this.props.addUserImage}
              />
            </TouchableOpacity>
          ) : null}
          {this.props.sendInvite ? (
            <Text
              style={styles.inviteText}
              onPress={this.props.sendInviteClicked}
            >
              {this.props.sendInvite}
            </Text>
          ) : 
          null}
        </View>
      </TouchableOpacity>
    );
  }
}
