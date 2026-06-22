import React, { Component } from 'react';
import { View, Platform, BackHandler } from 'react-native';
import MapComponent from './mapComponent';
import { Header, DataManager } from "./../../Components";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { CreatePostAction } from '../../Redux/actions/RoutePostAction'
import moment from "moment";
import Timer from '../../Components/Timer';
import TimeLineBtns from './timeLineBtns';
import NetInfo from '@react-native-community/netinfo'
import BackgroundTime from 'react-native-background-timer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'react-native-i18n'
import { socket } from '../../Config/socket';
import { Alert } from 'react-native';
import FadeInView from './FadeAnim';

let interval
class NewTimeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            timeButtonPress: 5,
            isConnected: true,
            userId: ''
        };
        this.timerRef = null;
        this.mapRef = null;
        this.back = null
    }
    socketCall = async () => {
        let userData = await DataManager.getUserDetails();
        let jsonData = await JSON.parse(userData);
        this.setState({ userId: jsonData.data._id })
        if (jsonData?.data?._id) {
            socket.emit('manual_socket',
                {
                    start: true,
                    time: moment().utc(),
                    user_id: jsonData?.data?._id
                }
            )
        }

    }

    animatebuttonOut() {
        this.stopTrack()
    }
    getManualTimeLine = () => {
        AsyncStorage.getItem('manualLatLng').then((res) => {
            let parseRes = JSON.parse(res)
            console.log('parseResparseResparseResparseRes', parseRes);
            AsyncStorage.getItem('startTimer').then((res33) => {
                let res3Parse = JSON.parse(res33)
                if (res3Parse) {
                    this.timerRef.seconds = Math.ceil(moment(new Date()).diff(moment(res3Parse.time)) / 1000)
                }
                else {
                    AsyncStorage.setItem('startTimer', JSON.stringify({ start: true, time: moment(new Date()) })).then((res) => {
                    }).catch((e) => {

                    })
                    this.socketCall()
                }
            })
            if (parseRes) {
                this.mapRef.setState({ coordinates: parseRes.manualCoordinates })
            }
        })
    }

    hardwareBackPress = () => {
        this.back = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                "Alert",
                I18n.t("backgroundProcess"),
                [
                    {
                        text: I18n.t('Ok'), onPress: () => {
                            this.props.navigation.goBack()
                        }
                    },
                    {
                        text: I18n.t('Cancel')
                    },
                ]
            )
            return true
        })
    }

    componentWillUnmount() {
        this.back.remove()
    }

    componentDidMount() {
        this.hardwareBackPress()
        this.getUserId()
        this.getManualTimeLine()
        NetInfo.addEventListener(state =>
            this.handleConnectionChange(state.isConnected)
        );
    }

    getUserId = async () => {
        let userData = await DataManager.getUserDetails();
        let jsonData = await JSON.parse(userData);
        this.setState({ userId: jsonData.data._id })
    }

    _handleAppStateChange = nextAppState => {
        if (nextAppState === "active") {
            NetInfo.addEventListener(state =>
                this.handleConnectionChange(state.isConnected)
            );
            this.forceUpdate();
        }
    };
    handleConnectionChange = () => {
        NetInfo.fetch().then((res) => {
            this.setState({ isConnected: res.isConnected })
        })
    }

    //set timer interval
    callInterval = () => {
        this.timerInterval = null;
        if (Platform.OS == 'ios') {
            this.timerInterval = setInterval(async () => {
                if (this.timerRef) {
                    this.timerRef.add();
                }
            }, 1000);
        }
        else {
            this.timerInterval = BackgroundTime.setInterval(async () => {
                if (this.timerRef) {
                    this.timerRef.add();
                }
            }, 1000);
        }
    };

    startTrack() {
        this.mapRef.setState({ start: true })
        this.callInterval();

    }


    pauseTrack() {
        if (Platform.OS == 'ios') {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        else {
            BackgroundTime.clearInterval(this.timerInterval);
        }
    }

    stopTrack() {
        if (this.timerRef.seconds >= 60 && this.mapRef.state.coordinates.length > 1) {
            AsyncStorage.removeItem('manualLatLng').then((res) => {
                console.log('remove redddsadasdsa', res);
                socket.emit('manual_socket',
                    {
                        start: false,
                        time: moment(new Date()).utc(),
                        user_id: this.state.userId
                    }
                )
                AsyncStorage.removeItem('startTimer')
                this.props.navigation.navigate('ManualTimeline', { coordinates: this.mapRef.state.coordinates })
                this.mapRef.setState({ start: false, stop: true, coordinates: [], makeRoute: false })
            })
        }
        else {
            Alert.alert(
                I18n.t("NotMoving"),
                I18n.t("oneMinuteLongerAlert"),
                [
                    {
                        text: I18n.t('Stop'), onPress: () => {
                            AsyncStorage.removeItem('manualLatLng').then((res) => {
                                console.log('remove redddsadasdsa', res);
                                socket.emit('manual_socket',
                                    {
                                        start: false,
                                        time: moment().utc(),
                                        user_id: this.state.userId
                                    }
                                )
                                this.props.navigation.goBack()
                                this.mapRef.setState({ start: false, stop: true, coordinates: [], makeRoute: false })
                                AsyncStorage.removeItem('startTimer')
                            })
                        }
                    },
                    {
                        text: I18n.t('continue'),
                        onPress: () => { console.log('ll') }
                    }
                ]
            )
        }
    }


    render() {
        return (
            <>
                {Platform.OS == 'android' ?
                    <Header
                        headerTitle={I18n.t('Timeline')}
                        leftImageSource={AppImages.images.back}
                        leftbackbtnPress={() => {
                            Alert.alert(
                                "Alert",
                                I18n.t("backgroundProcess"),
                                [
                                    {
                                        text: I18n.t('Ok'), onPress: () => {
                                            this.props.navigation.goBack()
                                        }
                                    },
                                    {
                                        text: I18n.t('Cancel')
                                    },
                                ]
                            )
                        }}
                    />
                    :
                    <View style={{ flex: Platform.OS == 'android' ? 0.11 : 0.13 }}>
                        <Header
                            headerTitle={I18n.t('Timeline')}
                            leftImageSource={AppImages.images.back}
                            leftbackbtnPress={() => {
                                Alert.alert(
                                    "Alert",
                                    I18n.t("backgroundProcess"),
                                    [
                                        {
                                            text: I18n.t('Ok'), onPress: () => {
                                                this.props.navigation.goBack()
                                            }
                                        },
                                        {
                                            text: I18n.t('Cancel')
                                        },
                                    ]
                                )
                            }}
                        />
                    </View>}
                {/* Main Map Component  */}
                <MapComponent ref={refs => this.mapRef = refs} />
                {/* Timer  */}
                <View style={{
                    position: 'absolute',
                    top: '15%',
                    alignSelf: 'center'
                }}>
                    <Timer ref={refs => this.timerRef = refs} />
                </View>
                {/* Btns Component  */}
                <View style={{
                    position: 'absolute',
                    bottom: 30,
                    alignSelf: 'center'
                }}>
                    <TimeLineBtns
                        onPressOut={() => this.animatebuttonOut()}
                        startTrack={() => this.startTrack()}
                        pauseTrack={() => this.pauseTrack()}
                        ref={refs => this.timelineBtnRef = refs}
                    />
                </View>
                <FadeInView style={{ backgroundColor: 'powderblue', position: 'absolute', bottom: 0, alignSelf: 'center' }} ref={ani => this.fade = ani}>
                </FadeInView>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        routeState: state.RoutePostData,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ CreatePostAction }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewTimeline);


