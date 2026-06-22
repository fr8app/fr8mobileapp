import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, Alert, Linking, Dimensions } from 'react-native';
import AppImages from '../../Themes/AppImages';
import moment from 'moment';
import I18n from 'react-native-i18n'
import Geolocation from '@react-native-community/geolocation';
import { AppFontFamily } from '../../Themes'
import FadeInView from './FadeAnim';

class TimeLineBtns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStart: true,
            showStop: false,
            showPause: false,
            startTime: '',
            disabled: false,
            check: false,
            hold: false
        };
    }

    componentDidMount() {
        this.setState({
            showPause: false,
            showStart: false,
            showStop: true,
            startTime: this.state.startTime == '' ? moment().utc() : this.state.startTime
        });
        this.props.startTrack();
    }
    shouldComponentUpdate(prevState) {
        if (this.props !== prevState) {
            return false
        }
        return true
    }

    getStartTime() {
        return this.state.startTime
    }

    renderStartBtn() {
        return (
            <TouchableHighlight style={{ display: this.props.display ? 'none' : 'flex' }} onPress={() => {
                Geolocation.getCurrentPosition(
                    position => {
                        this.setState({
                            showPause: false,
                            showStart: false,
                            showStop: true,
                            startTime: this.state.startTime == '' ? moment().utc() : this.state.startTime
                        });
                        this.props.startTrack();
                    },
                    error => {
                        if (error.code == 1) {
                            Alert.alert(
                                'Allow "FR8" to use your location?',
                                'FR8 would like access to your location',
                                [
                                    { text: 'Ok', onPress: () => { Linking.openSettings() } }
                                ]
                            )
                        }
                        else if (error.code == 2) {
                            Alert.alert(
                                'Allow "FR8" to use your location?',
                                'FR8 would like access to your location',

                                [
                                    { text: 'Ok', onPress: () => { Linking.openSettings() } }
                                ]
                            )
                        }
                    }
                )
            }}
                underlayColor={'transparent'}>
                {I18n.currentLocale() == 'pt' ?
                    <Image
                        source={AppImages.images.startPortuguse}
                        style={{ height: 100, width: 100 }} resizeMode='contain'
                    />
                    :
                    I18n.currentLocale() == 'es' ?
                        <Image
                            source={AppImages.images.startSpanish}
                            style={{ height: 100, width: 100 }} resizeMode='contain'
                        />
                        :
                        <Image
                            source={AppImages.images.start}
                            style={{ height: 100, width: 100 }} resizeMode='contain'
                        />
                }
            </TouchableHighlight>
        )
    }

    renderStopBtn() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: '20%', bottom: '-10%' }}>
                <FadeInView style={{ backgroundColor: 'red', position: 'absolute', zIndex: 99999, alignSelf: 'center', borderRadius: Dimensions.get('screen').width / 2 / 2 }} ref={ani => this.fade = ani}>
                </FadeInView>
                <TouchableHighlight
                    onPressIn={() => this.fade.animatebutton()}
                    onPressOut={() => this.fade.Discard()}
                    onLongPress={() => { this.props.onPressOut() }}
                    style={{ display: this.props.display ? 'none' : 'flex', }}
                    underlayColor={'transparent'}
                >
                    {I18n.currentLocale() == 'pt' ?
                        <Image
                            source={AppImages.images.stopPortuguse}
                            style={{ height: 140, width: 140 }} resizeMode='contain'
                        />
                        :
                        I18n.currentLocale() == 'es' ?
                            <Image
                                source={AppImages.images.stopSpanish}
                                style={{ height: 140, width: 140 }} resizeMode='contain'
                            />
                            :
                            I18n.currentLocale() == 'hi' ?
                                <Image style={{
                                    height: 100, width: 100,
                                }} resizeMode='contain' source={require('../../Images/Stop/Hindi.gif')} />
                                :
                                I18n.currentLocale() == 'zh' ?
                                    <Image style={{
                                        height: 100, width: 100,
                                    }} resizeMode='contain' source={require('../../Images/Stop/Chinese.gif')} />
                                    :
                                    I18n.currentLocale() == 'ph' ?
                                        <Image style={{
                                            height: 100, width: 100,
                                        }} resizeMode='contain' source={require('../../Images/Stop/Tagalog.gif')} />
                                        :
                                        I18n.currentLocale() == 'bn' ?
                                            <Image style={{
                                                height: 100, width: 100,
                                            }} resizeMode='contain' source={require('../../Images/Stop/Bengali.gif')} />
                                            :
                                            I18n.currentLocale() == 'fr' ?
                                                <Image style={{
                                                    height: 100, width: 100,
                                                }} resizeMode='contain' source={require('../../Images/Stop/French.gif')} />
                                                :
                                                I18n.currentLocale() == 'de' ?
                                                    <Image style={{
                                                        height: 100, width: 100,
                                                    }} resizeMode='contain' source={require('../../Images/Stop/German.gif')} />
                                                    :
                                                    I18n.currentLocale() == 'ko' ?
                                                        <Image style={{
                                                            height: 100, width: 100,
                                                        }} resizeMode='contain' source={require('../../Images/Stop/Korean.gif')} />
                                                        :
                                                        I18n.currentLocale() == 'ru' ?
                                                            <Image style={{
                                                                height: 100, width: 100,
                                                            }} resizeMode='contain' source={require('../../Images/Stop/Russian.gif')} />
                                                            :
                                                            I18n.currentLocale() == 'it' ?
                                                                <Image style={{
                                                                    height: 100, width: 100,
                                                                }} resizeMode='contain' source={require('../../Images/Stop/Italian.gif')} />
                                                                :
                                                                I18n.currentLocale() == 'vi' ?
                                                                    <Image style={{
                                                                        height: 100, width: 100,
                                                                    }} resizeMode='contain' source={require('../../Images/Start/Vietnamese.gif')} />
                                                                    :
                                                                    <Image
                                                                        source={AppImages.images.stop}
                                                                        style={{ height: 140, width: 140 }} resizeMode='contain'
                                                                    />
                    }
                </TouchableHighlight>
                <Text style={{ fontSize: 16, color: '#fff', fontFamily: AppFontFamily.fontFamily.bold }}>
                    {I18n.t("Hold to Stop")}
                </Text>
            </View>
        )
    }
    renderPauseBtn() {
        return (
            <TouchableHighlight style={{ display: this.props.display ? 'none' : 'flex' }} onPress={() => {
                this.setState({
                    showPause: false,
                    showStart: true,
                    showStop: true
                });
                this.props.pauseTrack();
            }}
                underlayColor={'transparent'}>
                {I18n.currentLocale() == 'pt' ?
                    <Image
                        source={AppImages.images.pausePortuguse}
                        style={{ height: 100, width: 100 }} resizeMode='contain'
                    />
                    :
                    I18n.currentLocale() == 'es' ?
                        <Image
                            source={AppImages.images.pauseSpanish}
                            style={{ height: 100, width: 100 }} resizeMode='contain'
                        />
                        :
                        <Image
                            source={AppImages.images.pause}
                            style={{ height: 100, width: 100 }} resizeMode='contain'
                        />
                }
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                display: this.props.display ? this.props.display : 'flex'
            }}>
                {this.state.showStart && this.renderStartBtn()}
                {this.state.showStop && this.renderStopBtn()}
                {this.state.showPause && this.renderPauseBtn()}
            </View>
        );
    }
}

export default TimeLineBtns;
