import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";
import { CachedImage } from "./../react-native-cached-image-master";
import Entypo from "react-native-vector-icons/Entypo";

export default class UsersRender extends Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={
          this.props.activeOpacity ? this.props.activeOpacity : 0.7
        }
        style={[this.props.chat ? styles.borderLess : styles.mainView]}
        onPress={this.props.onPress}
      >
        {/* <View
          style={{
            height: "100%",
            position: "absolute",
            right: "10%",
            backgroundColor: "red",
          }}
        ></View> */}
        <View
          style={[
            this.props.chat ? styles.borderLessImage : styles.userImageView,
          ]}
        >
          <CachedImage
            source={this.props.userImageSource}
            resizeMode="cover"
            style={styles.userImage}
          />
        </View>

        <View
          style={[
            styles.textView,
            this.props.chat ? { flex: 1 } : { flex: 0.55 },
          ]}
        >
          <Text numberOfLines={1} style={[styles.tittleText]}>
            {this.props.tittleText}
          </Text>
          {this.props.descText ? (
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <View style={{ width: "85%" }}>
                <Text numberOfLines={1} style={[styles.descText]}>
                  {this.props.descText}
                </Text>
              </View>
              <View
                style={{
                  width: "60%",
                  alignItems: "flex-end",
                  marginLeft: "-3%",
                }}
              >
                {this.props.chat && (
                  <Text style={[styles.dateText]}>
                    {"   " + this.props.timeText + " "}
                    <Text style={styles.dateText}>{this.props.dateText}</Text>
                  </Text>
                )}
              </View>
            </View>
          ) : null}
        </View>
        {this.props.unread ? (
          <View
            style={{
              marginLeft: -5,
              opacity: 0.7,
              borderRadius: 12,
              width: 25,
              height: 25,
              right: 10,
              //   left: 100,
              top: 15,
              zIndex: 9999,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12 }}> {this.props.unread}</Text>
          </View>
        ) : null}
        <View
          style={[this.props.isTag ? styles.tickView : styles.dateTimeView]}
        >
          {!this.props.chat && this.props.dateText ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.dateText}>{this.props.timeText + " "}</Text>
              <Text style={styles.dateText}>{this.props.dateText}</Text>
            </View>
          ) : null}
          {this.props.isTag ? (
            <TouchableOpacity
              onPress={() => this.props.crossPress()}
              activeOpacity={0.7}
              style={styles.crossButton}
            >
              <Entypo color={"#29a2e1"} name="check" size={30} />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}
