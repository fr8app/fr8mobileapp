import { StyleSheet } from "react-native";
import { AppFontFamily, AppColor, Dimensions } from "../../Themes";
export default StyleSheet.create({
  mainView: {
    flex: 1,
    overflow: "hidden",
    marginTop: 15,
    marginBottom: 15,
    // backgroundColor:'red'
  },
  noOfViews: {
    position: "absolute",
    top: 10,
    right: 30,
    flexDirection: "row",
  },
  viewsText: {
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 14,
    marginLeft: 5,
  },
  image: {
    width: Dimensions.deviceWidth - 40,
    height: (Dimensions.deviceWidth - 40) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  playImage: {
    width: 40,
    height: 40,
    // backgroundColor:'green'
  },
  likeDislikeView: {
    flex: 1,
    flexDirection: "row",
    marginTop: 15,
    // justifyContent: "space-between",
    // alignItems: 'center',
  },
  likeContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeView: {
    flexDirection: "row",
    flex: 0.3,
    // justifyContent: "space-between",
    alignItems: "center",
  },
  timeView: {
    flex: 0.5,
    flexDirection: "row",
    // alignItems: 'center',
    justifyContent: "flex-end",
    // backgroundColor:'red'
  },
  imageShare: {
    width: 25,
    height: 25,
  },
  likeText: {
    color: AppColor.colors.sixThree,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 14,
    marginLeft: 5,
  },
  lineView: {
    width: "100%",
    height: 0.5,
    backgroundColor: AppColor.colors.placeHolder,
    marginTop: 25,
  },
  userView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
  },
  userPostsText: {
    // marginTop:30,
    color: AppColor.colors.twoTwo,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 16,
    textAlign: "center",
    marginLeft: 15,
  },

  // userImageView: {
  //     flex: 0.25,
  //     // height:"100%",
  //     height:70,
  //     justifyContent: "center",
  //     alignItems: 'center',
  //     backgroundColor: AppColor.colors.imageBackground,
  //     overflow:'hidden'
  // },
  // userImage: {
  //     width: 50,
  //     height: 50,
  // },
  // textView: {
  //     flex: 0.55,
  //     overflow:'hidden',
  //     paddingTop:5,
  //     paddingBottom:5,

  // },
  // buttonView: {
  //     flex: 0.4,
  //     flexDirection: 'row',
  //     justifyContent: "center",
  //     alignItems: 'center',
  //     overflow:'hidden',
  //     paddingRight:5 ,
  //     // backgroundColor:"green"
  // },
  // tittleText: {
  //     color: AppColor.colors.black,
  //     fontFamily: AppFontFamily.fontFamily.regular,
  //     fontSize: 15,
  //     paddingLeft:8
  // },
  // descText: {
  //     color: AppColor.colors.placeHolder,
  //     fontFamily: AppFontFamily.fontFamily.regular,
  //     fontSize: 15,
  //     paddingLeft:8
  // },
  // darkBlueButton: {
  //     backgroundColor: AppColor.colors.darkBlue,
  //     borderRadius: 2,
  //     paddingLeft:8    ,
  //     paddingBottom:5,
  //     paddingTop:5,
  //     paddingRight:8,
  //     marginRight:2,
  //     alignSelf:'center'
  // },
  // lightBlueButton: {
  //     backgroundColor: AppColor.colors.lightBlue,
  //     borderRadius: 2,
  //     paddingLeft:8,
  //     paddingBottom:5,
  //     paddingTop:5,
  //     paddingRight:8,
  //     // marginLeft:2
  // },
  // selectedButton: {
  //     borderColor: AppColor.colors.darkBlue,
  //     borderWidth: 1,
  //     borderRadius: 2,
  //     paddingLeft:8,
  //     paddingBottom:5,
  //     paddingTop:5,
  //     paddingRight:8
  // },
  // selectedAcceptText: {
  //     color: AppColor.colors.darkBlue,
  //     fontSize: 14,
  //     fontFamily: AppFontFamily.fontFamily.regular,
  // },
  // acceptText: {
  //     color: AppColor.colors.white,
  //     fontSize: 14,
  //     fontFamily: AppFontFamily.fontFamily.regular,
  // }
});
