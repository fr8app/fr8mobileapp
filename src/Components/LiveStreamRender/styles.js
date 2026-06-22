import { StyleSheet } from 'react-native'
import { AppFontFamily, AppColor, Dimensions } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        width: "100%",
        backgroundColor: '#0d131c',
        borderTopColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c',
        borderBottomColor: 'transparent'

    },
    readMore: {
        color: '#29a2e1',
        marginTop: 5
    },
    userView: {
        flexDirection: 'row',
        alignItems: "center",
        width: "100%",
        backgroundColor: '#3f9fe3',
        borderBottomColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c',
    },
    timeLineScreen: {
        flexDirection: 'row',
        alignItems: "center",
        width: "100%"
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
        flex: 1,
        // height:200,
        width:'100%'
    },
    lineView: {
        width: "100%",
        height: 0.5,
        backgroundColor: AppColor.colors.placeHolder,
        marginTop: 20
    },
    postImageView: {
        overflow: 'hidden',
    },
    backImage: {
        width: '100%',
        height: '100%'
    },
    playButton: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 25,
        alignSelf: 'center'
    },
    minuteView: {
        paddingHorizontal: 10,
        width: '98%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    likeShareView: {
        paddingVertical: 7,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    touchableHighlightView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '28%',
        paddingVertical: 5,
        borderRadius: 2
    },
    openCloseView: {
        marginTop: 5,
        marginBottom: 5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    avaliableView: {
        marginTop: 5,
        marginBottom: 5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    startEndView: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        width: '98%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    viewPager: {
        flex: 1,
        width: '100%',
        flexGrow: 1
    },
    dotView:{
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 10,
    },
    avgWaitTime:{
        // marginTop: 15, 
        width: 158, 
        height: 50,
        position: 'absolute', 
        alignItems: 'center', 
        justifyContent: 'center',
        top: 35, 
        backgroundColor: '#29a2e1', 
        height: 25, 
        left: -40, 
        transform: [{ rotate: "-45deg" }]
    }

})