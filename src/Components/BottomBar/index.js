// // import React, { useState, useEffect } from 'react';
// // import { View, Text, Image, TouchableOpacity, Platform, Keyboard } from 'react-native';
// // import style from './style';
// // import Icon from 'react-native-vector-icons/dist/FontAwesome';
// // import { NavigationActions, StackActions } from 'react-navigation';
// // import DeviceInfo from 'react-native-device-info'
// // import { AppImages } from '../../Themes';
// // const listofBottom = [
// //     { no: 1, name: 'FR8', icon: AppImages.images.homeClient, icon2: AppImages.images.homeClient2 },
// //     // { no:2,name: 'Feed', icon:AppImages.images.flashClient , icon2: AppImages.images.flashClient2},
// //     { no: 2, name: 'Feed', icon: AppImages.images.community2, icon2: AppImages.images.community1 },
// //     { no: 3, name: 'ADDPost', icon: AppImages.images.addClient, icon2: AppImages.images.addClient },
// //     // { no:4,name: 'MyFreightingNetwork', icon: require('../../Images/clockClient.png'), icon2: require('../../Images/clockClient2.png') },
// //     { no: 4, name: 'TimeLine', icon: AppImages.images.clockClient, icon2: AppImages.images.clockClient2 },
// //     { no: 5, name: 'Notification', icon: AppImages.images.notificationClient, icon2: AppImages.images.notificationClient2 },

// // ]
// // const BottomBar = ({ name, navigation }) => {

// //     // console.log('route',navigation.navigation)
// //     const [selected, setSelected] = useState(1)
// //     const [showKeyBoard, setShowKeyboard] = useState(false)
// //     const resetActions = StackActions.reset({
// //         index: 0,
// //         // actions: [NavigationActions.navigate({ routeName: "OnBoarding" })]
// //     });

// //     useEffect(() => {
// //         if (navigation.navigation.state.index == 3) {
// //             setSelected(5)
// //         }
// //         console.log('navigation.navigationnavigation.navigation', navigation.navigation);
// //     }, [navigation.navigation])
// //     useEffect(() => {
// //         Keyboard.addListener('keyboardDidShow', () => {
// //             setShowKeyboard(true)
// //         })
// //         Keyboard.addListener('keyboardDidHide', () => {
// //             setShowKeyboard(false)
// //         })
// //     }, [])
// //     return (
// //         showKeyBoard == false ?
// //             <View style={style.mainContainer}>
// //                 {
// //                     listofBottom.map(data => (
// //                         selected === data.no ?
// //                             data.no === 3 ?
// //                                 <TouchableOpacity
// //                                     activeOpacity={0.5}
// //                                     onPress={() => {
// //                                         // if (selected !== data.no) {
// //                                             setSelected(data.no)
// //                                             console.log(data.name, navigation)

// //                                             // navigation.navigation.push(data.name)
// //                                             // navigation.navigation.push(data.name)
// //                                             Platform.OS=='android'?
// //                                             navigation.navigation.navigate(data.name)
// //                                             :
// //                                             navigation.navigation.push(data.name)
// //                                         // }

// //                                         // navigation.navigate(data.name)
// //                                     }} style={[style.smallBox, { top: DeviceInfo.hasNotch() ? -35 : -30 }]}>
// //                                     <View style={style.smallBox}>
// //                                         {Platform.OS == 'ios' ?
// //                                             <Text style={{ color: "white" }}>

// //                                                 <Image style={{ width: 50, height: 50 }} source={data.icon} />

// //                                             </Text>
// //                                             :
// //                                             <View style={{ color: "white" }}>
// //                                                 <Image style={{ width: 50, height: 50 }} source={data.icon} />
// //                                             </View>
// //                                         }
// //                                     </View>
// //                                 </TouchableOpacity> :

// //                                 <TouchableOpacity onPress={() => {
// //                                     if (selected !== data.no) {

// //                                         setSelected(data.no)
// //                                         // setSelected(navigation.navigation.state.index)

// //                                         // navigation.navigation.push(data.name)
// //                                         navigation.navigation.navigate(data.name)
// //                                     }

// //                                     // navigation.navigate(data.name)
// //                                 }} style={style.smallBox1}>
// //                                     <View style={style.smallBox}>
// //                                         {Platform.OS == 'ios' ?
// //                                             <Text style={{ color: "white" }}>

// //                                                 <Image resizeMode={data.no === 5 || 2 ? 'contain' : 'contains'} style={{ width: 40, height: 40 }} source={data.icon2} />

// //                                             </Text>
// //                                             :
// //                                             <View style={{ color: "white" }}>
// //                                                 <Image resizeMode={data.no === 5 || 2 ? 'contain' : 'contains'} style={{ width: 40, height: 40 }} source={data.icon2} />
// //                                             </View>
// //                                         }
// //                                     </View>
// //                                 </TouchableOpacity> :

// //                             data.no === 3 ?
// //                                 <TouchableOpacity
// //                                     activeOpacity={0.5}
// //                                     onPress={() => {
// //                                         setSelected(data.no)
// //                                         console.log(data.name, navigation)
// //                                         Platform.OS=='android'?

// //                                         navigation.navigation.navigate(data.name)
// //                                         :
// //                                         navigation.navigation.push(data.name)

// //                                         // navigation.navigate(data.name)
// //                                     }} style={[style.smallBox, {  top: DeviceInfo.hasNotch() ? -35 : -30 }]}>
// //                                     <View style={style.smallBox}>
// //                                         {/* <Text style={{ color: "white" }}> */}

// //                                         <Image resizeMode='contain' style={{ zIndex: -1, width: 50, height: 50 }} source={data.icon} />

// //                                         {/* </Text> */}
// //                                     </View>
// //                                 </TouchableOpacity>

// //                                 : <TouchableOpacity onPress={() => {

// //                                     setSelected(data.no)
// //                                     console.log(data.name, navigation)
// //                                     if (data.no == 2) {

// //                                         navigation.navigation.navigate(data.name)
// //                                     }
// //                                     else {

// //                                         navigation.navigation.navigate(data.name)
// //                                     }
// //                                     // navigation.navigation.push(data.name)

// //                                     // navigation.navigate(data.name)
// //                                 }} style={[style.smallBox]}>
// //                                     <View style={style.smallBox}>
// //                                         {Platform.OS == 'ios' ?
// //                                             <Text style={{ color: "white" }}>

// //                                                 <Image
// //                                                     resizeMode={data.no === 5 || 2 ? "contain" : 'contain'}
// //                                                     style={{ width: 40, height: 40 }} source={data.icon} />
// //                                             </Text> :
// //                                             <View style={{ color: "white" }}>
// //                                                 <Image
// //                                                     resizeMode={data.no === 5 || 2 ? "contain" : 'contain'}
// //                                                     style={{ width: 40, height: 40 }} source={data.icon} />
// //                                             </View>
// //                                         }
// //                                     </View>
// //                                 </TouchableOpacity>
// //                     ))
// //                 }
// //             </View>
// //             : null
// //     )
// // }
// // export default BottomBar;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, Platform, Keyboard } from 'react-native';
// import style from './style';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
// import { NavigationActions, StackActions } from 'react-navigation';
// import DeviceInfo from 'react-native-device-info'
// import { AppImages } from '../../Themes';
// import { connect } from 'react-redux';
// const listofBottom = [
//     { no: 1, name: 'FR8', icon: AppImages.images.homeClient, icon2: AppImages.images.homeClient2 },
//     // { no:2,name: 'Feed', icon:AppImages.images.flashClient , icon2: AppImages.images.flashClient2},
//     { no: 2, name: 'Feed', icon: AppImages.images.community2, icon2: AppImages.images.community1 },
//     // { no: 3, name: 'ADDPost', icon: AppImages.images.addClient, icon2: AppImages.images.addClient },
//     // { no:4,name: 'MyFreightingNetwork', icon: require('../../Images/clockClient.png'), icon2: require('../../Images/clockClient2.png') },
//     { no: 3, name: 'TimeLine', icon: AppImages.images.clockClient, icon2: AppImages.images.clockClient2 },
//     { no: 4, name: 'Notification', icon: AppImages.images.notificationClient, icon2: AppImages.images.notificationClient2 },

// ]
// const BottomBar = ({ name, navigation,notificationAlert,homeState }) => {

//     const [selected, setSelected] = useState(1)
//     const [showKeyBoard, setShowKeyboard] = useState(false)
//     const resetActions = StackActions.reset({
//         index: 0,
//         // actions: [NavigationActions.navigate({ routeName: "OnBoarding" })]
//     });
//     useEffect(()=>{
//         console.log('navigation',notificationAlert,homeState);
//     },[navigation.navigation])

//     useEffect(() => {
//         if(navigation.navigation.state.index==0){
//             setSelected(1)
//         }
//         if (navigation.navigation.state.index == 1) {
//             setSelected(2)
//         }
//         if(navigation.navigation.state.index == 2){
//             setSelected(4)
//         }
//     }, [navigation.navigation])
//     useEffect(() => {
//         Keyboard.addListener('keyboardDidShow', () => {
//             setShowKeyboard(true)
//         })
//         Keyboard.addListener('keyboardDidHide', () => {
//             setShowKeyboard(false)
//         })
//     }, [])
//     return (
//         showKeyBoard == false ?
//             <View style={style.mainContainer}>
//                 {
//                     listofBottom.map(data => (
//                         selected === data.no ?
//                             // data.no === 3 ?
//                             //     <TouchableOpacity
//                             //         activeOpacity={0.5}
//                             //         onPress={() => {
//                             //             // if (selected !== data.no) {
//                             //                 setSelected(data.no)
//                             //                 console.log(data.name, navigation)

//                             //                 // navigation.navigation.push(data.name)
//                             //                 // navigation.navigation.push(data.name)
//                             //                 Platform.OS=='android'?
//                             //                 navigation.navigation.navigate(data.name)
//                             //                 :
//                             //                 navigation.navigation.push(data.name)
//                             //             // }

//                             //             // navigation.navigate(data.name)
//                             //         }} style={[style.smallBox, { top: DeviceInfo.hasNotch() ? -35 : -30 }]}>
//                             //         <View style={style.smallBox}>
//                             //             {Platform.OS == 'ios' ?
//                             //                 <Text style={{ color: "white" }}>

//                             //                     <Image style={{ width: 50, height: 50 }} source={data.icon} />

//                             //                 </Text>
//                             //                 :
//                             //                 <View style={{ color: "white" }}>
//                             //                     <Image style={{ width: 50, height: 50 }} source={data.icon} />
//                             //                 </View>
//                             //             }
//                             //         </View>
//                             //     </TouchableOpacity> :

//                                 <TouchableOpacity onPress={() => {
//                                     if (selected !== data.no) {

//                                         setSelected(data.no)
//                                         // setSelected(navigation.navigation.state.index)

//                                         // navigation.navigation.push(data.name)
//                                         navigation.navigation.navigate(data.name)
//                                     }

//                                     // navigation.navigate(data.name)
//                                 }} style={style.smallBox1}>
//                                     <View style={style.smallBox}>
//                                         {Platform.OS == 'ios' ?
//                                             <Text style={{ color: "white" }}>

//                                                 <Image resizeMode={data.no === 5 || 2 ? 'contain' : 'contains'} style={{ width: 40, height: 40 }} source={data.icon2} />

//                                             </Text>
//                                             :
//                                             <View style={{ color: "white" }}>
//                                                 <Image resizeMode={data.no === 5 || 2 ? 'contain' : 'contains'} style={{ width: 40, height: 40 }} source={data.icon2} />
//                                             </View>
//                                         }
//                                     </View>
//                                 </TouchableOpacity> :

//                             // data.no === 3 ?
//                             //     <TouchableOpacity
//                             //         activeOpacity={0.5}
//                             //         onPress={() => {
//                             //             setSelected(data.no)
//                             //             console.log(data.name, navigation)
//                             //             Platform.OS=='android'?

//                             //             navigation.navigation.navigate(data.name)
//                             //             :
//                             //             navigation.navigation.push(data.name)

//                             //             // navigation.navigate(data.name)
//                             //         }} style={[style.smallBox, {  top: DeviceInfo.hasNotch() ? -35 : -30 }]}>
//                             //         <View style={style.smallBox}>
//                             //             {/* <Text style={{ color: "white" }}> */}

//                             //             <Image resizeMode='contain' style={{ zIndex: -1, width: 50, height: 50 }} source={data.icon} />

//                             //             {/* </Text> */}
//                             //         </View>
//                             //     </TouchableOpacity>

//                             //     :
//                                 <TouchableOpacity onPress={() => {

//                                     setSelected(data.no)
//                                     console.log(data.name, navigation)
//                                     if (data.no == 2) {

//                                         navigation.navigation.navigate(data.name)
//                                     }
//                                     else {

//                                         navigation.navigation.navigate(data.name)
//                                     }
//                                     // navigation.navigation.push(data.name)

//                                     // navigation.navigate(data.name)
//                                 }} style={[style.smallBox]}>
//                                     <View style={style.smallBox}>
//                                         {Platform.OS == 'ios' ?
//                                             <Text style={{ color: "white" }}>

//                                                 <Image
//                                                     resizeMode={data.no === 5 || 2 ? "contain" : 'contain'}
//                                                     style={{ width: 40, height: 40 }} source={data.icon} />
//                                             </Text> :
//                                             <View style={{ color: "white" }}>
//                                                 <Image
//                                                     resizeMode={data.no === 5 || 2 ? "contain" : 'contain'}
//                                                     style={{ width: 40, height: 40 }} source={data.icon} />
//                                             </View>
//                                         }
//                                     </View>

//                                     {data.no==4?notificationAlert.unread_notification>0||homeState.unread_notification>0?
//                                     <View style={{position:'absolute',top:DeviceInfo.hasNotch()? '20%':'15%',right:'30%',height:22,width:22,borderRadius:11,backgroundColor:'red',alignItems:'center',justifyContent:'center'}}>
//                                         <Text style={style.text}>{[notificationAlert.unread_notification==0?homeState.unread_notification>0?homeState.unread_notification:notificationAlert.unread_notification:notificationAlert.unread_notification]>99?" 99+":notificationAlert.unread_notification==0?homeState.unread_notification>0?homeState.unread_notification:notificationAlert.unread_notification:notificationAlert.unread_notification}</Text>
//                                     </View>:null:null}
//                                 </TouchableOpacity>
//                     ))
//                 }
//             </View>
//             : null
//     )
// }

// function mapStateToProps(state) {
//     return {
//         notificationAlert: state.Notify,
//         homeState: state.HomeState,
//     }
// }
// export default connect(mapStateToProps, {   })(BottomBar)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import style from "./style";
import Icon from "react-native-vector-icons/dist/FontAwesome";
// import { NavigationActions, StackActions } from 'react-navigation';
import DeviceInfo from "react-native-device-info";
import { AppImages } from "../../Themes";
import { connect } from "react-redux";
import { StackActions } from "@react-navigation/native";
const listofBottom = [
  {
    no: 1,
    name: "FR8",
    icon: AppImages.images.homeClient,
    icon2: AppImages.images.homeClient2,
  },
  // { no:2,name: 'Feed', icon:AppImages.images.flashClient , icon2: AppImages.images.flashClient2},
  {
    no: 2,
    name: "Feed",
    icon: AppImages.images.community2,
    icon2: AppImages.images.community1,
  },
  // { no: 3, name: 'FavouriteTerminal2', icon: AppImages.images.gifInfinty, icon2: AppImages.images.gifInfinty },
  {
    no: 3,
    name: "FavouriteTerminal2",
    icon: require("../../Images/700.gif"),
    icon2: require("../../Images/700.gif"),
  },
  // { no:4,name: 'MyFreightingNetwork', icon: require('../../Images/clockClient.png'), icon2: require('../../Images/clockClient2.png') },
  {
    no: 4,
    name: "TimeLine",
    icon: AppImages.images.clockClient,
    icon2: AppImages.images.clockClient2,
  },
  {
    no: 5,
    name: "Notification",
    icon: AppImages.images.notificationClient,
    icon2: AppImages.images.notificationClient2,
  },
];
const BottomBar = ({ name, navigation, notificationAlert, homeState }) => {
  // console.log('route',navigation.navigation)
  const [selected, setSelected] = useState(3);
  const [showKeyBoard, setShowKeyboard] = useState(false);
  // const resetActions = StackActions.reset({
  //     index: 0,
  //     // actions: [NavigationActions.navigate({ routeName: "OnBoarding" })]
  // });

  useEffect(() => {
    if (navigation.state.index == 3) {
      setSelected(4);
    } else if (navigation.state.index == 1) {
      setSelected(2);
    } else if (navigation.state.index == 2) {
      setSelected(5);
    }
    // else if(navigation.navigation.state.index == 4){
    //     setSelected(1)
    // }
    else if (navigation.state.index == 0) {
      setSelected(3);
    }
    console.log("navigation.navigationnavigation.navigation", navigation);
  }, [navigation]);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setShowKeyboard(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setShowKeyboard(false);
    });
  }, []);
  return showKeyBoard == false ? (
    <View style={style.mainContainer}>
      {listofBottom.map((data) =>
        selected === data.no ? (
          data.no === 3 ? (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                // if (selected !== data.no) {
                setSelected(data.no);
                console.log(data.name, navigation);

                // navigation.navigation.push(data.name)
                // navigation.navigation.push(data.name)
                Platform.OS == "android"
                  ? navigation.navigation.navigate(data.name)
                  : navigation.navigation.navigate(data.name);
                // }

                // navigation.navigate(data.name)
              }}
              style={[
                style.smallBox,
                { top: DeviceInfo.hasNotch() ? -35 : -30 },
              ]}
            >
              <View style={style.smallBox}>
                {Platform.OS == "ios" ? (
                  // <Text style={{ }}>

                  <Image
                    style={{
                      width: 70,
                      height: 70,
                      borderWidth: 2,
                      borderRadius: 35,
                      borderColor: "rgb(0,156,216)",
                    }}
                    source={data.icon}
                  />
                ) : (
                  // </Text>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 72,
                      height: 72,
                      borderWidth: 2,
                      borderRadius: 36,
                      borderColor: "rgb(0,156,216)",
                    }}
                  >
                    <Image
                      style={{ width: 70, height: 70, borderRadius: 35 }}
                      source={data.icon}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (selected !== data.no) {
                  setSelected(data.no);
                  // setSelected(navigation.navigation.state.index)

                  // navigation.navigation.push(data.name)
                  navigation.navigation.navigate(data.name);
                }

                // navigation.navigate(data.name)
              }}
              style={style.smallBox1}
            >
              <View style={style.smallBox}>
                {Platform.OS == "ios" ? (
                  <Text style={{ color: "white" }}>
                    <Image
                      resizeMode={data.no === 5 || 2 ? "contain" : "contain"}
                      style={{ width: 40, height: 40 }}
                      source={data.icon2}
                    />
                  </Text>
                ) : (
                  <View style={{ color: "white" }}>
                    <Image
                      resizeMode={data.no === 5 || 2 ? "contain" : "contain"}
                      style={{ width: 40, height: 40 }}
                      source={data.icon2}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )
        ) : data.no === 3 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setSelected(data.no);
              console.log(data.name, navigation);
              Platform.OS == "android"
                ? navigation.navigation.navigate(data.name)
                : navigation.navigation.navigate(data.name);

              // navigation.navigate(data.name)
            }}
            style={[style.smallBox, { top: DeviceInfo.hasNotch() ? -35 : -30 }]}
          >
            <View style={style.smallBox}>
              {/* <Text style={{ color: "white" }}> */}

              <Image
                resizeMode="contain"
                style={{ width: 70, height: 70 }}
                source={AppImages.images.gifInfinty}
              />

              {/* </Text> */}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSelected(data.no);
              console.log(data.name, navigation);
              if (data.no == 2) {
                navigation.navigation.navigate(data.name);
              } else {
                navigation.navigation.navigate(data.name);
              }
            }}
            style={[style.smallBox]}
          >
            <View style={style.smallBox}>
              {Platform.OS == "ios" ? (
                <Text style={{ color: "white" }}>
                  <Image
                    resizeMode={data.no === 5 || 2 ? "contain" : "contain"}
                    style={{ width: 40, height: 40 }}
                    source={data.icon}
                  />
                </Text>
              ) : (
                <View style={{ color: "white" }}>
                  <Image
                    resizeMode={data.no === 5 || 2 ? "contain" : "contain"}
                    style={{ width: 40, height: 40 }}
                    source={data.icon}
                  />
                </View>
              )}
            </View>
            {data.no == 5 ? (
              notificationAlert.unread_notification > 0 ||
              homeState.unread_notification > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: DeviceInfo.hasNotch() ? "20%" : "15%",
                    right: "30%",
                    height: 22,
                    width: 22,
                    borderRadius: 11,
                    backgroundColor: "red",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={style.text}>
                    {[
                      notificationAlert.unread_notification == 0
                        ? homeState.unread_notification > 0
                          ? homeState.unread_notification
                          : notificationAlert.unread_notification
                        : notificationAlert.unread_notification,
                    ] > 99
                      ? " 99+"
                      : notificationAlert.unread_notification == 0
                      ? homeState.unread_notification > 0
                        ? homeState.unread_notification
                        : notificationAlert.unread_notification
                      : notificationAlert.unread_notification}
                  </Text>
                </View>
              ) : null
            ) : null}
          </TouchableOpacity>
        )
      )}
    </View>
  ) : null;
};
function mapStateToProps(state) {
  return {
    notificationAlert: state.Notify,
    homeState: state.HomeState,
  };
}
export default connect(
  mapStateToProps,
  {}
)(BottomBar);
