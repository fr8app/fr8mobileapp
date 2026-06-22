import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {hasNotch} from 'react-native-device-info';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

// import {useDispatch} from 'react-redux';

import {ActivityIndicator} from 'react-native';
import { Component } from 'react';
import Header from '../../Components/Header'
import {AppImages}from '../../Themes'
import I18n from 'react-native-i18n';
// let colmments=[
//   {
//     image: "61b740e2be430f59dc8daa06",
// owner:"",
// avatar: "https://d3kofhcrutkkv8.cloudfront.net/default-pictures/default-avatar-gray.png",
// full_name: "rajvir singh",
// _id: "61e5466677166a57c24f329f",
// sub_comments: Array(1)
// 0:
// owner: {avatar: 'https://d3kofhcrutkkv8.cloudfront.net/default-pictures/default-avatar-gray.png', _id: '61e5466677166a57c24f329f', full_name: 'rajvir singh'}
// text: "sfsdfs"
// time_update: "2022-01-17T10:42:04.512Z"
// _id: "61e547fc77166a57c24f32a2"
// [[Prototype]]: Object
// length: 1
// [[Prototype]]: Array(0)
// text: "sfdsfdsgdf"
// time_update: "2022-01-17T10:38:04.086Z"
// __v: 1
// _id: "61e5470c77166a57c24f32a0"
// [[Prototype]]: Object
//   }
// ]

export default class CommentsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
        header: (
          <Header
          headerTitle={I18n.t("Comment")}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => _this.onNavigationBack()}
        />
        )
    };
};
constructor(props){
  super(props)
  this.state={
    msg:''
  }
}
render(){
  let props=this.props
  return (
    <View style={{flex: 1}}>
      <View style={{}}>
       

        <ScrollView
          //   contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          ref={(ref)=>this.scrollRef=ref}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}>
          <View style={styles.container}>
            <View style={styles.flexBox}>
              {(
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: responsiveHeight(80),
                    // backgroundColor:'red',
                    width: responsiveWidth(100),
                  }}>
                  <Text style={styles.commentsText}>{'No comment yet'}</Text>
                </View>
              ) }

              {props.item &&
                props.item.comments.map((item, index) => (
                  <View style={styles.newsFeed}>
                    <View style={styles.commentsBox}>
                      <View style={styles.userImage}>
                        <Image
                          onLoadStart={() => setLoad(true)}
                          onLoadEnd={() => setLoad(false)}
                          style={[styles.userImg, {borderRadius: 20}]}
                          source={{uri: item.owner.avatar}}
                          resizeMode="cover"
                        />
                        <View
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            opacity: 0.7,
                            // backgroundColor: "black",
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <ActivityIndicator
                            animating={loadImage}
                            size="small"
                            color="#7303C0"
                          />
                        </View>
                      </View>
                      <View style={styles.notiMsgContainer}>
                        <Text style={styles.commentsBy}>
                          {item.owner.full_name}
                        </Text>
                        <Text style={styles.commentsText}>{item.text}</Text>
                        <View style={styles.bottomTextPart}>
                          <View style={styles.replayBox}>
                            <Text style={styles.time}>
                              {getTimes(
                                new Date().getTime(),
                                new Date(item.time_update).getTime(),
                              )}{' '}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                openInput.current.focus(),
                                  setUserDetail(item),
                                  setName(item.owner.full_name);
                              }}>
                              <Text style={styles.replay}>Reply </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.replayBox}>
                            {item.owner._id == id ? (
                              <TouchableOpacity
                                onPress={() => {
                                  openInput.current.focus(),
                                    setMsg(item.text),
                                    setcommentEdit(item),
                                    setSub(false);
                                }}>
                                <MaterialCommunityIcons
                                  style={styles.icon}
                                  name="pencil"
                                  color={"black"}
                                  size={22}
                                />
                              </TouchableOpacity>
                            ) : null}

                            {item.owner._id == id ? (
                              <TouchableOpacity
                                onPress={() =>
                                  Alert.alert(
                                    '',
                                    'Are you sure, do you want to delete the comment?',

                                    [
                                      {
                                        text: 'Yes',
                                       
                                      },
                                      {
                                        text: 'Cancel',
                                      },
                                    ],
                                  )
                                }>
                                <MaterialCommunityIcons
                                  style={styles.icon}
                                  name="delete"
                                  color={"black"}
                                  size={22}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    </View>
                    {item.sub_comments.map((sub) => (
                      <View style={styles.commentsSubBox}>
                        <View style={styles.userImage}>
                          <Image
                            style={[styles.userImg, {borderRadius: 20}]}
                            source={{uri: item.owner.avatar}}
                            resizeMode="cover"
                          />
                        </View>
                        <View style={styles.notiMsgSubContainer}>
                          <Text style={styles.subCommentsBy}>
                            {sub.owner.full_name}
                          </Text>
                          <Text style={styles.subCommentsText}>
                            {sub.text}{' '}
                          </Text>
                          <View style={styles.subBottomTextPart}>
                            <View style={styles.replayBox}>
                              <Text style={styles.time}>
                                {getTimes(
                                  new Date().getTime(),
                                  new Date(sub.time_update).getTime(),
                                )}{' '}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  openInput.current.focus(),
                                    setName(sub.owner.full_name),
                                    setUserDetail(item);
                                }}>
                                <Text style={styles.replay}>Reply </Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.replayBox}>
                              {sub.owner._id == id ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    openInput.current.focus(),
                                      setMsg(sub.text),
                                      setcommentEdit(item),
                                      setSub(true),
                                      setSubId(sub._id);
                                  }}>
                                  <MaterialCommunityIcons
                                    style={styles.icon}
                                    name="pencil"
                                    color={"black"}
                                    size={22}
                                  />
                                </TouchableOpacity>
                              ) : null}
                              {sub.owner._id == id ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    Alert.alert(
                                      '',
                                      'Are you sure, do you want to delete the comment?',

                                      [
                                        {
                                          text: 'Yes',
                                          // onPress: () => {
                                          //   dispatch(
                                          //     deleteSubComment(
                                          //       sub._id,
                                          //       item._id,
                                          //     ),
                                          //   ),
                                          //     setcommentEdit(null);
                                          //   setUserDetail(null);
                                          //   // setName('')
                                          //   setSub(false);
                                          // },
                                        },
                                        {
                                          text: 'Cancel',
                                        },
                                      ],
                                    )
                                  }>
                                  <MaterialCommunityIcons
                                    style={styles.icon}
                                    name="delete"
                                    color={"black"}
                                    size={22}
                                  />
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* {userDetail ? (
        <View>
          <Text
            style={[
              styles.subCommentsBy,
              {
                maxWidth: responsiveWidth(80),
                paddingLeft: responsiveHeight(12),
              },
            ]}>
            Reply to {name}
          </Text>
        </View>
      ) : null} */}

      <View style={[styles.commentBox]}>
        {/* <View style={[styles.inputContainer]}> */}
          <TextInput
            onChangeText={(value) => setMsg(value)}
            value={this.state.msg}
            ref={(ref)=>this.openInput=ref}
            style={styles.textInput}
            numberOfLines={2}
            autoCapitalize={false}
            multiline={true}
            placeholder="Write a comment..."
          />
        {/* </View> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // sendSms(),
                userDetail
                  ? null
                  : setTimeout(() => {
                      this.scrollRef.scrollToEnd();
                    }, 500);
            }}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* </View> */}
    </View>
  );
          }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: responsiveWidth(0.5),
    paddingHorizontal: responsiveWidth(0.5),
  },
  flexBox: {
    marginBottom: responsiveHeight(3),
  },
  newsFeed: {
    marginBottom: responsiveHeight(2),
  },
  commentsTop: {
    marginBottom: responsiveHeight(1),
  },
  commentImage: {
    width: responsiveWidth(29),
    height: responsiveWidth(25),
  },
  commentTop: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  commentsBox: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: responsiveHeight(2),
  },
  commentsByTop: {
    color: "black",
    // fontFamily: Roboto_Medium,
    fontSize: 17,
    paddingLeft: 10,
    display: 'flex',
    flexWrap: 'wrap',
    width: responsiveWidth(60),
  },
  commentsTopText: {
    color: "black",
    // fontFamily: Roboto_Regular,
    fontSize: 15,
    paddingLeft: 10,
    display: 'flex',
    flexWrap: 'wrap',
    width: responsiveWidth(60),
  },
  commentsIconBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveWidth(65),
    paddingVertical: responsiveHeight(1),
    paddingLeft: 10,
  },
  iconTopImg: {
    width: 20,
    height: 19,
  },
  notiMsgSubContainer: {
    flexDirection: 'column',
  },
  text: {
    paddingLeft: 1,
    color: "black",
    // fontFamily: Roboto_Bold,
  },
  col: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  userImage: {
    width: 40,
    height: 40,
  },
  userImg: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
  notiMsgContainer: {
    flexDirection: 'column',
  },
  commentsSubBox: {
    display: 'flex',
    flexDirection: 'row',
    width: responsiveWidth(85),
    marginLeft: responsiveWidth(15),
    marginBottom: responsiveHeight(2),
  },
  subCommentsBy: {
    color: "black",
    // fontFamily: Roboto_Medium,
    fontSize: 16,
    paddingLeft: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: responsiveWidth(40),
  },
  subCommentsText: {
    color: "black",
    // fontFamily: Roboto_Regular,
    fontSize: 15,
    paddingLeft: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: responsiveWidth(55),
  },
  subBottomTextPart: {
    display: 'flex',
    flexDirection: 'row',
    width: responsiveWidth(69),
    justifyContent: 'space-between',
  },
  commentsBy: {
    color: "black",
    // fontFamily: Roboto_Medium,
    fontSize: 16,
    paddingLeft: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: responsiveWidth(80),
  },
  commentsText: {
    color: "black",
    // fontFamily: Roboto_Regular,
    fontSize: 15,
    paddingLeft: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: responsiveWidth(80),
  },
  bottomTextPart: {
    // display: 'flex',
    flexDirection: 'row',
    width: responsiveWidth(84),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  replayBox: {
    // display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    color: "gray",
    // fontFamily: Roboto_Regular,
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  replay: {
    fontSize: 16,
    color: "gray",
    // fontFamily: Roboto_Bold,
  },
  icon: {
    marginLeft: 15,
  },
  topClose: {
    flexDirection: 'row',
  },
  iconClose: {
    marginTop: -responsiveHeight(1),
  },
  inputContainer: {
    flex: 3,
  },
  textInput: {
    fontSize: 16,
    color: "black",
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: 80,
    paddingHorizontal: 10,
    paddingBottom: 12,
    paddingTop: 10,
    overflow: 'scroll',
    height: 60,
  },
  commentBox: {
    flexDirection: 'row',
    flex: 1,
    maxHeight: Platform.OS == 'android' ? 50 : 60,
    alignItems: 'center',
    marginBottom: hasNotch() ? 15 : 2,
    paddingLeft: 7,
    paddingRight: 4,
    marginTop: 5,
    marginHorizontal: responsiveHeight(10),
    // borderWidth:1
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    maxHeight: 80,
    backgroundColor: "gray",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 9,
    padding: Platform.OS === 'ios' ? 19 : 19,
  },
  buttonText: {
    color: "white",
  },
});
