import { Platform, StyleSheet } from 'react-native'
import { colors } from '../../Themes/AppColor';
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
// const height = Dimensions.get('screen').height
// const width = Dimensions.get('screen').width
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.black,
        // alignItems:'center',
        // justifyContent:'center'
    },
    dotView: {
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 0,
        // top: "50%"
    },
    icon: {
        height: 30,
        width: 30,
        // alignSelf: 'center',
        tintColor: colors.lightBlue
    },
    iconText: {
        marginLeft: 10,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    postView: {
        // //   flexDirection:'row',
        //     justifyContent: 'space-around',
        marginBottom: 10
    },
    textStyle: {
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 20,
        color: "white",
        fontWeight: '700',
        textAlign: 'center'
    },

    marginTop40: {
        position: 'absolute',
        bottom: 0
    },
    image: {
        // flex:1
        height: '100%',
        width: Dimensions.deviceWidth,

    },
    button: {
        borderRadius: 14,
        height: 50,
        width: '44%'
        // borderRadius: 14,
        // height: 50
    },
    text: {
        color: 'white',
        fontSize: 13,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    scrollView: {
        // backgroundColor: 'black',
        flex: 1
    },
    blueSquareView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#29a2e1',
        paddingVertical: 40,
        paddingHorizontal: 10,
        marginVertical: 40,
        marginHorizontal: 20,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1
    },
    textInput: {
        flex: 1,
        minHeight: 120,
        maxHeight: 140,
        padding: 10,
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingTop: 10,
        paddingLeft: 20,
        fontSize: 16
    },
    buttonView: {
        marginHorizontal: 25,
        justifyContent: 'flex-end',
        marginTop: 40,
        paddingBottom: 20
    },
    textInputView: {
        // flex: 1,
        height: Dimensions.deviceHeight / 3,
        maxHeight: Dimensions.deviceHeight / 3,
        // borderWidth: 1,
        borderColor: AppColor.colors.imageBackground,
        // maxHeight: 220,
        // padding: 10,
        marginTop: 0,
        backgroundColor: 'white',
        // borderRadius: 10,
        // paddingTop: 10,
        fontSize: 16,
        marginHorizontal: 18,
        // backgroundColor: 'pink'
    },
    input: {
        height: Dimensions.deviceHeight / 3,
        maxHeight: '100%',
        // minHeight: '90%',
        color: AppColor.colors.inputColor,
        textAlignVertical: 'top',
        fontSize: 22,
        paddingBottom: Platform.OS == 'ios' ? 40 : 5
    },
    container: {
        flex: 1,
        // paddingTop: 20
    },
    innerView: {
        // flex: 1,
        // marginVertical: 40,
        marginHorizontal: 20
    },
    userView: {
        flexDirection: 'row',
        width: "100%",
        borderBottomColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c',
        marginTop: 20,
        // marginBottom:10
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2
    },
    userPostsText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
    postImage: {
        // width: Dimensions.deviceWidth ,
        // height: (Dimensions.deviceWidth) / 2,
        width: 140,
        height: 140,
        borderRadius: 10
    },

    tagView: {
        marginHorizontal: 20,
        // marginTop:10,
        // marginVertical:20,
        // backgroundColor:'lightgray',
        // padding:10,
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row'
    },
    checkIn: {
        // zIndex:99999,
        marginHorizontal: 20,
        // marginVertical:20,
        // backgroundColor:'lightgray',
        // padding:10,
        marginTop: 10,
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row'
    },
    crossButton: {
        position: 'absolute',
        right: Platform.OS=='ios'? -4:1,
        top: 8,
        zIndex: 1,
        backgroundColor: '#29a2e1',
        height: 26,
        width: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomView: {
        borderRadius: 10,
        bottom: 0,
        paddingBottom: Platform.OS == 'ios' ? 20 : 10,
        flexDirection: 'row',
        width: '100%',
        shadowColor: 'black',
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        elevation: 5,
        shadowRadius: 3,
        shadowOpacity: 0.4,
        backgroundColor: '#fff',
    },
    swipablePanel: {
        // maxHeight:height*0.81,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        elevation: 5,
        shadowRadius: 3,
        shadowOpacity: 0.4,
        //  borderWidth:0.5,
        //  borderColor:'gray',
    }

})

