import { Dimensions, Platform } from 'react-native'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
import PlatformStyleSheet from 'component/PlatformStyleSheet'

let CIRCLE_RADIUS = deviceWidth / 7;
export default PlatformStyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 35,
        textAlign: 'center',
        letterSpacing: 0.1,
        marginTop: 100
    },
    header: {
        elevation: 0,
        backgroundColor: '#F5FCFF',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        borderBottomWidth: Platform.OS == 'ios' ? 0 : .5,
        shadowOffset: { width: 0, height: 0.2 }
        , shadowOpacity: 1, shadowRadius: 0.1

    },
    backButton: {
        height: 15,
        width: 20,
        marginLeft: 10
    },
    headerTitle: {
        textAlign: 'center',
        marginLeft: 15,
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    wrapper: {
        flex: 1
    },
    slide1: {
        flex: 1,
        alignItems: 'center',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2b608a'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f8fe',
    },
    text: {
        fontSize: 28,
        marginTop: 60,
        color: '#404040',
        android: {
            fontWeight: '500'
        },
        ios: {
            fontWeight: '600'
        },
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center'
    },
    RecordTruetext: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 60,
        color: 'white'
    },
    bottomBar: {
        height: 70,
        width: deviceWidth,
        backgroundColor: 'white',
        borderTopWidth:Platform.OS=='android'?.5:1, // Changed by Deftsoft :- 30 April, 2018
        borderTopColor: 'silver',
        shadowOffset: { width: 0, height: 0.5 }
        , shadowOpacity: 0, shadowRadius: 0.1,
        elevation:Platform.OS=='android'? 3:0.5, // Changed by Deftsoft :- 30 April, 2018
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 130,
        ios: {
            position:'absolute'
        }
    },
    inputtext: {
        width: deviceWidth - 120,
        height: 40,
        borderRadius: 20,
        maxHeight: 100,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        android: {
            fontSize: 16,
            paddingLeft:15, // Changed by Deftsoft :- 30 April, 2018
            minHeight:40 // Changed by Deftsoft :- 30 April, 2018
        },
        ios: {
            fontSize: 15,    // Changed by Deftsoft :- 30 April, 2018
            padding:10,    // Changed by Deftsoft :- 30 April, 2018
        }
    },
    view: {
        width: deviceWidth,
        height: 40,
        marginTop: 10,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 15,
        paddingRight: 15
    },
    textbutton: {
        color: '#404040',
        ios: {
            fontSize: 17
        },
        android: {
            fontSize: 20
        }
    },
    recordActive: {
        ios: {
            fontSize: 17
        },
        android: {
            fontSize: 20
        },
        color: 'white'
    },
    holdtext: {
        alignSelf: 'center',
        fontSize: 16,
        color: '#348efc',
        position:'absolute',
        bottom: Platform.OS == 'android' ? 20 : 20
    },
    pulse: {
        ios: {
            marginTop: deviceHeight - 480,
        },
        android: {
            marginTop: 80,
        },
        zIndex: 0
    },
    slideuptext: {
        color: 'white',
        fontSize: 18,
        marginTop: 5
    },
    cancel: {
        height: deviceHeight,
        width: deviceWidth,
        //    backgroundColor: 'rgba(250,250,250,0.5)',
        zIndex: 999,
        position: 'absolute',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        android: {
            paddingBottom: 45
        }
        // paddingBottom: Platform.OS == 'ios' ? 100 : 150
    },
    cancelImage: {
        height: 55,
        width: 55,
        opacity: 1,
    },
    cancelImg: {
        height: Platform.OS == 'android' ? 30 : 32,
        width: Platform.OS == 'android' ? 30 : 32,
    },

    SectionStyle: {
        flexDirection: 'row',
        width: deviceWidth - 65,
        borderWidth:Platform.OS=='android'? .25:.5, // Changed by Deftsoft :- 30 April, 2018
        borderRadius: 20,
        paddingLeft: 15,
        borderColor: 'silver',
        shadowOffset: { width: 0, height: 0 }
        , shadowOpacity: 2, 
        shadowRadius: Platform.OS == 'android' ? 1 : 0.5,
        elevation: 1,
        // fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    SectionStyleNew: {
        flexDirection: 'row',
        width: deviceWidth - 65,
        borderWidth: .25,
        borderRadius: 20,
        paddingLeft: 15,
        borderColor: 'silver',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 2, 
        shadowRadius: Platform.OS == 'android' ? 1 : 0.5,
        elevation: 1,
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        left:0,
        // bottom:0,
        
    },

    ImageStyle: {
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
    activecircle: {
        backgroundColor: "#9bcdf4",
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        android: {
            position: 'absolute',
            bottom: 133
        },
        ios: {
            top: deviceHeight - 420 
        },
        zIndex: 99,
        borderColor: 'white',
    },
    nonActivecircle: {
        backgroundColor: "#FFF",
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 4,
        // borderColor: '#404040',
        // top: Platform.OS == 'android' ? deviceHeight===683.4285714285714?deviceHeight - 455: deviceHeight - 446 : deviceHeight - 400,
        zIndex: 99,
        // shadowColor: '#404040',
        // shadowOffset: { width: 0.8, height: .8 }
        // , shadowOpacity: .8, shadowRadius: Platform.OS == 'android' ? .5 : .5,
        elevation: .5,
        android: {
            position: 'absolute',
            bottom: 60
        },
        ios: {
            top: deviceHeight - 420 
        },
        padding: 10,
        shadowColor: '#404040',
        // shadowOffset: {
        //     width: 0,
        //     height: 3
        // },
        // shadowRadius: 5,
        // shadowOpacity: 1.0
    },
    cancel2: {
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: 'rgba(230,230,230,0.7)',
        zIndex: 10,
        position: 'absolute',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Platform.OS == 'ios' ? 100 : 150
    },
    cancelBlackBtn: {
        marginBottom: Platform.OS == 'android' ? deviceHeight - 495 : deviceHeight - 478
    },
    gigChatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: deviceWidth - 60,
        borderRadius: 20,
        paddingRight: 5,
        borderWidth: 1,
        borderColor: '#c7c7cc',
        height: 40
    },
    notifyView: {
        alignSelf: 'flex-end',
        height: 25,
        width: 25,
        borderRadius: 30,
        backgroundColor: '#1e88e5',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 90,
        bottom: 10
    },
    notifyTxt: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 13,
        color: 'white',
        left: 1
    }
})
