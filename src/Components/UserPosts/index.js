import React, { Component } from "react";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  AppImages,
  AppColor,
  AppFontFamily,
} from "./../../Themes";
import styles from "./styles";
import { CachedImage } from "./../react-native-cached-image-master";
import { imageBaseUrl } from "../../Config";
import I18n from 'react-native-i18n';
export default class UserPosts extends Component {
  render() {
    return (
      <View style={styles.mainView}>
        {this.props.fullName && this.props.userSource ? (
          <View style={styles.userView}>
            {this.props.userSource ? (
              <CachedImage
                source={this.props.userSource}
                resizeMode="cover"
                style={styles.userImage}
              />
            ) : null}
            {this.props.fullName ? (
              <Text
                style={[
                  styles.userPostsText,
                  {textAlign:'left', marginLeft: this.props.userSource ? 15 : 0 },
                ]}
              >
                {this.props.fullName}
              </Text>
            ) : null}
          </View>
        ) : null}
        {this.props.terminalName ? (
          <View
            style={{ marginTop: 10, height: 30, borderBottomColor: "gray" }}
          >
            <Text
              style={[
                {
                  color: AppColor.colors.twoTwo,
                  fontFamily: AppFontFamily.fontFamily.regular,
                  fontSize: 20,
                },
              ]}
            >
              {this.props.terminalName}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity onPress={this.props.videoOnPress}>
          <ImageBackground
            source={
              this.props.type === "image"
                ? { uri: imageBaseUrl + this.props.video }
                : this.props.imageSource
            }
            resizeMode="cover"
            style={[
              styles.image,
              {
                marginTop:
                  this.props.fullName && this.props.userSource ? 10 : 0,
              },
            ]}
          >
            {this.props.type === "image" ? null : (
              <CachedImage
                source={this.props.playSource}
                resizeMode="contain"
                style={[styles.playImage,{backgroundColor:'#fff',overflow:'hidden',borderRadius:20,}]}
              />
            )}
            {this.props.viewsVisible ? (
              <View style={styles.noOfViews}>
                <CachedImage
                  source={this.props.viewSource}
                  resizeMode="contain"
                  style={styles.imageShare}
                />
                <Text style={styles.viewsText}>{this.props.viewText}</Text>
              </View>
            ) : null}
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.likeDislikeView}>
          <View style={styles.likeContainer}>
            <TouchableOpacity
              style={styles.likeView}
              onPress={this.props.likeButton}
            >
              <CachedImage
                source={this.props.likeSource}
                resizeMode="contain"
                style={styles.imageShare}
              />
              <Text style={styles.likeText}>{this.props.likeText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.likeView}
              onPress={this.props.disLikeButton}
            >
              <CachedImage
                source={this.props.disLikeSource}
                resizeMode="contain"
                style={styles.imageShare}
              />
              <Text style={styles.likeText}>{this.props.disLikeText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.likeView}
              onPress={this.props.shareButton}
            >
              <CachedImage
                source={this.props.shareSource}
                resizeMode="contain"
                style={styles.imageShare}
              />
            </TouchableOpacity>
            
            {this.props.terminalReport &&
            this.props.stateId !== this.props.itemId ? (
              <TouchableOpacity
                style={{ marginLeft: -10 }}
                onPress={() => {
                  Alert.alert(
                    I18n.t('reportPostAlert'),
                    "",
                    [
                      {
                        text: I18n.t("Yes"),
                        onPress: () => this.props.terminalReport(),
                      },
                      {
                        text: I18n.t("No"),
                        onPress: () => {},
                      },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                  source={AppImages.images.postDark}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.timeView}>
            <Text style={[styles.likeText, { marginLeft: 0 }]}>
              {this.props.timeText}
            </Text>
            <Text style={[styles.likeText, { marginLeft: 10 }]}>
              {this.props.dateText}
            </Text>
          </View>
          {this.props.delete && this.props.stateId === this.props.itemId ? (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  I18n.t('deletePostAlert'),
                  "",
                  [
                    {
                      text:I18n.t("Yes"),
                      onPress: () => this.props.delete(),
                    },
                    {
                      text: I18n.t("No"),
                      onPress: () => {},
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={{ marginLeft: 15 }}
            >
              <Icon color={"#c2c2c2"} name="trash" size={20} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{ marginTop: 15 }}>
          <Text>{this.props.Description}</Text>
        </View>
        <View style={styles.lineView} />
      </View>
    );
  }
}
