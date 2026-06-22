import React, { Component } from "react";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import styles from "./styles";
import { AppImages, AppColor } from "./../../Themes";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import Ionic from "react-native-vector-icons/dist/Ionicons";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      disabled2:false
    };
  }
  render() {
    const { customStyles } = this.props;
    return (
      <ImageBackground
        resizeMode="cover"
        style={[styles.mainContainer, customStyles.ImageBackView]}
        source={AppImages.images.header}
      >
        {Platform.OS == "ios" ? (
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor={AppColor.colors.lightBlue}
          />
        ) : (
          <StatusBar
            barStyle="light-content"
            backgroundColor={AppColor.colors.lightBlue}
          />
        )}

        <View style={[styles.container, customStyles.container]}>
          {
            <View
              style={[
                styles.leftBtnView,
                {
                  flex: this.props.chat ? 0 : 1,
                  alignItems: "flex-start",
                  // marginLeft: 10,
                },
              ]}
            >
              <TouchableOpacity
                disabled={this.state.disabled}
                style={[
                  styles.leftBtnView,
                  { alignItems: "flex-start", marginLeft: 10 },
                ]}
                onPress={() => {
                  this.props.leftbackbtnPress && this.props.leftbackbtnPress(),
                    this.setState({ disabled: true }),
                    setTimeout(() => {
                      this.setState({ disabled: false });
                    }, 200);
                }}
              >
                {this.props.leftBackBlink?
                <Text
                style={[
                  styles.leftbtn,
                  {
                    width: this.props.leftWidthIcon
                      ? this.props.leftWidthIcon
                      : 30,
                    height: this.props.hieghtIcon
                      ? this.props.hieghtIcon
                      : 30,
                  },
                ]}
                >
                <Image
                style={[
                  styles.leftbtn,
                  {
                    width: this.props.leftWidthIcon
                      ? this.props.leftWidthIcon
                      : 30,
                    height: this.props.hieghtIcon
                      ? this.props.hieghtIcon
                      : 20,
                  },
                ]}
                resizeMode="contain"
                source={this.props.leftImageSource}
              />
              </Text>
                :
                <Image
                  style={[
                    styles.leftbtn,
                    {
                      width: this.props.leftWidthIcon
                        ? this.props.leftWidthIcon
                        : 30,
                      height: this.props.hieghtIcon
                        ? this.props.hieghtIcon
                        : 20,
                    },
                  ]}
                  resizeMode="contain"
                  source={this.props.leftImageSource}
                />}
              </TouchableOpacity>
            </View>
          }
          <View>
            {this.props.leftSecondImage && (
              <TouchableOpacity
                activeOpacity={this.props.activeOpacity}
                disabled={this.state.disabled}
                style={[
                  styles.leftBtnView,
                  {
                    flex: 1,
                    alignItems: "flex-start",
                    marginLeft: this.props.chat ? 20 : 10,
                  },
                ]}
                onPress={() => {
                  this.props.leftSecondImagePress &&
                    this.props.leftSecondImagePress(),
                    this.setState({ disabled: true }),
                    setTimeout(() => {
                      this.setState({ disabled: false });
                    }, 200);
                }}
              >
                <Image
                  style={[
                    styles.leftbtn,
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignSelf: "center",
                    },
                  ]}
                  resizeMode="cover"
                  source={this.props.leftSecondImage}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text
            numberOfLines={1}
            style={[
              this.props.headerTitleStyle?styles.headerTitleLessFont:
              styles.headerTitle,
              this.props.multiButton?{width:'44%'}:null,
              this.props.textWidth
                ? {
                    width: "44%",
                    textAlign: this.props.textAlign
                      ? this.props.textAlign
                      : "left",
                  }
                : null,
              this.props.maxWidth ? { maxWidth: this.props.maxWidth } : null,
            ]}
          >
            {this.props.headerTitle}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {this.props.rightImageSource2 ? (
              <TouchableOpacity
              disabled={this.state.disabled2}
                style={[styles.leftBtnView]}
                onPress={()=>{
                  this.setState({disabled2:true})
                  setTimeout(() => {
                    this.setState({disabled2:false})
                  }, 2000);
                  this.props.rightBackBtnPress2()}}
              >
                <Image
                  style={[
                    styles.rightBtn,
                    {
                      width: 30,
                      height: this.props.hieghtIcon
                        ? this.props.hieghtIcon
                        : 20,
                    },
                  ]}
                  resizeMode="contain"
                  source={this.props.rightImageSource2}
                />
              </TouchableOpacity>
            ) : this.props.rightVector2 ? (
              <TouchableOpacity
                style={[styles.leftBtnView]}
                onPress={this.props.rightBackBtnPress3}
              >
                <Icon name={this.props.rightVector2} size={20} color="#ffff" />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              disabled={this.props.rightDisable}
              style={[styles.leftBtnView, customStyles.leftBtnView]}
              onPress={this.props.rightBackBtnPress}
            >
              {this.props.unread && this.props.homeState.unreadCount > 0 ? (
                <TouchableOpacity
                  onPress={this.props.rightBackBtnPress}
                  style={{
                    backgroundColor: "red",
                    opacity: 1,
                    borderRadius: 9,
                    width: 22,
                    height: 18,
                    top: -3,
                    left: 21,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    zIndex: 100,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{ color: "white", fontSize: 12 }}
                  >
                    {this.props.homeState.unreadCount > 99
                      ? 99
                      : this.props.homeState.unreadCount}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.props.rightHeaderText ? (
                <Text
                  numberOfLines={1}
                  style={[styles.rightText, this.props.rightStyle]}
                >
                  {this.props.rightHeaderText}
                </Text>
              ) : this.props.rightVector ? (
                this.props.ionicV?
                <Ionic name={this.props.rightVector} size={20} color="#ffff" />
                :
                <Icon name={this.props.rightVector} size={20} color="#ffff" />
              ) : (
               this.props.rightImageSource?<Image
                  style={[
                    styles.rightBtn,
                    {
                      width: this.props.rightImageSource1Width
                        ? this.props.rightImageSource1Width
                        : this.props.profileTed
                        ? 20
                        : 35,
                      height: this.props.rightImageSource1Height
                        ? this.props.rightImageSource1Height
                        : this.props.profileTed
                        ? 20
                        : 35,
                    },
                  ]}
                  resizeMode="cover"
                  source={this.props.rightImageSource}
                />:null
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
Header.defaultProps = { customStyles: {} };
function mapStateToProps(state) {
  return {
    stat: state,
    homeState: state.HomeState,
    terminalDetailState: state.TerminalDetailState,
    chatUserHistoryState: state.ChatUserHistoryState,
    chatHistoryState: state.ChatHistoryState,
  };
}
export default connect(mapStateToProps, null)(Header);
