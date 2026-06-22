import React, { Component } from "react";
import {
    View,
    Text,
    Image, Platform,
} from "react-native";
import styles, { darkMap } from "./styles";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import moment from "moment";
import { ImageBackground } from "react-native";
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Icon from "react-native-vector-icons/FontAwesome";
import I18n from "react-native-i18n";
const apiKey = 'AIzaSyAId9HPoVrtc6rDn9O-tAWERRJEelhkARc'

class MakeRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minZoomLevel: 16,
            coordinates: [],
            origin: null,
            destination: null,
            mapReady: false,
            directionReady: false
        }
    }
    shouldComponentUpdate(prevState) {
        if (this.props.ManualScreen) {
            if (this.props !== prevState) {
                return false
            }
            if (this.state !== prevState) {
                return false
            }
            return true
        }
        else {
            return true
        }
    }

    getTime = (seconds) => {
        seconds = Number(seconds);
        var h = Math.floor(seconds / (3600));
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var hDisplay = h > 0 ? h + (h == 1 ? " " + I18n.t('hrs') + ' ' : " " + I18n.t('hrs') + ' ') : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " " + I18n.t('mins') + ' ' : " " + I18n.t('mins') + ' ') : [s > 29 ? "1 " : "0 "] + I18n.t('mins');
        if (h > 0) {
            return hDisplay + mDisplay
        }

        else {
            return mDisplay
        }
    }

    getTime = (seconds) => {
        seconds = Number(seconds);
        var h = Math.floor(seconds / (3600));
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var hDisplay = h > 0 ? h + (h == 1 ? " " + I18n.t('hrs') + ' ' : " " + I18n.t('hrs') + ' ') : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " " + I18n.t('mins') + ' ' : " " + I18n.t('mins') + ' ') : [s > 29 ? "1 " : "0 "] + I18n.t('mins');
        if (h > 0) {
            return hDisplay + mDisplay
        }
        else {
            return mDisplay
        }
    }

    makeGradientColor(color1, color2, i) {
        let r = color1.r - i
        let g = color1.g + i
        let b = color1.b - i
        if (r >= 37) {
            r = color1.r - i
        }
        else if (r <= 4) {
            r = color1.r + i
        }
        if (g >= 226) {
            r = color1.g - i
        }
        else if (g <= 141) {
            r = color1.g + i
        }
        if (b >= 197) {
            b = color1.b - i
        }
        else if (b <= 144) {
            b = color1.b + i
        }
        return `rgb(${r},${g},${b})`
    }

    render() {
        return (
            <View style={{
                height: 300,
                width: '100%'
            }}>
                <MapView
                    {...this.props}
                    onMapReady={() => this.setState({ mapReady: true })}
                    ref={(mapRef) => this.mapSnapRef = mapRef}
                    style={styles.map}
                    customMapStyle={darkMap}
                    provider={PROVIDER_GOOGLE}
                    customMapStyle={darkMap}
                    initialRegion={{
                        latitude: this.props.initialRoute.latitude ? this.props.initialRoute.latitude : 40.741231,
                        longitude: this.props.initialRoute.longitude ? this.props.initialRoute.longitude : -74.101984,
                        latitudeDelta: 0.0019606594028154234,
                        longitudeDelta: 0.004690177738666534
                    }}
                    region={{
                        latitude: this.props.initialRoute.latitude ? this.props.initialRoute.latitude : 40.741231,
                        longitude: this.props.initialRoute.longitude ? this.props.initialRoute.longitude : -74.101984,
                        latitudeDelta: 0.0019606594028154234,
                        longitudeDelta: 0.004690177738666534
                    }}
                >
                    {
                        this.props.coordinate?.length > 0 &&
                        <Polyline
                            coordinates={this.props.coordinate}
                            strokeColor={"#2c9bd0"}
                            strokeWidth={6}
                        />
                    }
                    {this.props.coordinate?.length > 0 &&
                        <Marker
                            coordinate={this.props.coordinate[0]}>
                            <Image
                                style={{ height: 30, width: 30 }}
                                source={require('../../Images/mappingreen.png')}
                            />
                        </Marker>
                    }
                    {this.props.coordinate?.length > 0 &&
                        <Marker
                            coordinate={this.props.coordinate[this.props.coordinate.length - 1]}>
                            <Image
                                style={{ height: 30, width: 30 }}
                                source={require('../../Images/mappinred.png')}
                            />
                        </Marker>
                    }

                </MapView>
                {this.props.isDetail &&
                    <ImageBackground
                        style={{ width: '100%', height: 80, position: 'absolute', top: 0 }}
                        source={require('../../Images/top.png')}
                    >

                        <View style={{ paddingVertical: 4, position: 'absolute', marginHorizontal: 10, paddingHorizontal: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', height: 50, top: 0, }}>
                            <View style={{ width: '70%' }}>
                                <Text numberOfLines={1} style={{ alignItems: 'center', width: '100%', color: '#fff', fontSize: 20 }}>
                                    {this.props.titleName}
                                </Text>
                                <Text style={{ alignItems: 'center', color: '#fff', fontSize: 14 }}>
                                    {moment(this.props.created).format('MMMM DD, YYYY')}
                                </Text>
                            </View>
                            <Image
                                resizeMode={Platform.OS == 'ios' ? 'contain' : 'contain'}
                                style={{ height: 40, width: 50, tintColor: '#fff' }}
                                source={require('../../Images/Login_logo.png')}
                            />
                        </View>
                    </ImageBackground>
                }

                {this.props.isDetail &&
                    <ImageBackground
                        style={{ width: '100%', height: 80, position: 'absolute', bottom: 0 }}
                        source={require('../../Images/bottom.png')}>
                        <View style={{ justifyContent: 'space-between', paddingVertical: 4, paddingHorizontal: 20, position: 'absolute', marginHorizontal: 10, width: '100%', flexDirection: 'row', alignItems: 'center', alignSelf: 'center', height: 50, bottom: 0, }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>
                                {`${moment(this.props.startTime).format('HH:mm')} ${Platform.OS == 'ios' ? '\n' : ''}\n${moment(this.props.endTime).format('HH:mm')}`}
                            </Text>
                            <Text style={{ color: '#fff', fontSize: 15 }}>
                                <Icon name="dashboard" size={16} color="#fff" />
                                {`  ${this.props.distance} mi`}
                            </Text>
                            {this.props.avgTime ?
                                <View style={{ flexDirection: 'row' }}>
                                    <MaterialIcons
                                        name="query-builder"
                                        size={20}
                                        color="#fff"
                                    />
                                    <Text style={{ color: '#fff', fontSize: 15, alignItems: 'center' }}>
                                        {` ${this.getTime(this.props.avgTime)}`}
                                    </Text>
                                </View>
                                : null}
                        </View>
                    </ImageBackground>
                }
            </View>
        );
    }
}

export default MakeRoute;
