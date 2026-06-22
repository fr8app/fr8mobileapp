import React, { Component } from "react";
import {
    AppState,
    Image,
    Platform,
    View,
} from "react-native";
import styles, { darkMap } from "./style";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import geolocation from '@react-native-community/geolocation';
import geolocationService from 'react-native-geolocation-service';
import { getPreciseDistance } from "geolib";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapZoomin: 5,
            mapZoomout: 18,
            stop: false,
            pause: false,
            start: false,
            coordinates: [],
            distance: Number(0),
            prevLatlog: {},
            mapReady: false,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            makeRoute: false,
            snapObj: null
        };
    }

    componentDidMount() {
        this.getLatLong()
        AppState.addEventListener('change', (statee) => {
            if (statee == 'active') {
                BackgroundGeolocation.getCurrentLocation((loc) => {
                    let region = {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        latitudeDelta: 1,
                        longitudeDelta: 0.0922
                    };
                    if (this.mapRef) {
                    }
                    this.setState(
                        {
                            coordinates: this.state.coordinates.concat({
                                latitude: region.latitude,
                                longitude: region.longitude
                            }),
                            region,
                            latitude: region.latitude,
                            longitude: region.longitude,
                        });
                })
            }
        })
    }

    getLatLong() {
        BackgroundGeolocation.getCurrentLocation((loc) => {
            let region = {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: 1,
                longitudeDelta: 0.0922
            };
            if (this.mapRef) {
            }
            this.setState(
                {
                    coordinates: this.state.coordinates.concat({
                        latitude: region.latitude,
                        longitude: region.longitude
                    }),
                    region,
                    latitude: region.latitude,
                    longitude: region.longitude,
                });
        })

        BackgroundGeolocation.on('location', (loc) => {
            let region = {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: 1,
                longitudeDelta: 0.0922
            };
            if (this.mapRef) {
            }
            this.setState(
                {
                    coordinates: this.state.coordinates.concat({
                        latitude: region.latitude,
                        longitude: region.longitude
                    }),
                    region,
                    latitude: region.latitude,
                    longitude: region.longitude,

                });
        })
        BackgroundGeolocation.on('stationary', (loc) => {
            let region = {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: 1,
                longitudeDelta: 0.0922
            };
            if (this.mapRef) {
            }
            this.setState(
                {
                    coordinates: this.state.coordinates.concat({
                        latitude: region.latitude,
                        longitude: region.longitude
                    }),
                    region,
                    latitude: region.latitude,
                    longitude: region.longitude,

                });
        })
        geolocation.getCurrentPosition(
            position => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 1,
                    longitudeDelta: 0.0922
                };
                if (this.mapRef) {
                    this.mapRef.animateToRegion(region, 1000);
                }
                if (!this.state.makeRoute) {
                    this.setState(
                        {
                            region,
                            latitude: region.latitude,
                            longitude: region.longitude,
                        });
                }
            },
            error => {
                let region = {
                    latitude: 40.741231,
                    longitude: -74.101984,
                    latitudeDelta: 28.857763630813984,
                    longitudeDelta: 109.58674516528845
                };
                this.setState(
                    { region, latitude: region.latitude, longitude: region.longitude },
                    () => { }
                );
                if (this.mapRef) {
                    this.mapRef.animateToRegion(region, 1000);
                }
            },
        );
        if (Platform.OS == 'android') {
            geolocationService.getCurrentPosition(
                position => {
                    let region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 1,
                        longitudeDelta: 0.0922
                    };
                },
                error => {
                    let region = {
                        latitude: 40.741231,
                        longitude: -74.101984,
                        latitudeDelta: 28.857763630813984,
                        longitudeDelta: 109.58674516528845
                    };
                },
            );
        }
    }

    changeLocation = (location) => {
        if (this.state.coordinates.length < 5) {
        }
    }

    //distance calculate
    calcDistance = newLatlng => {
        if (this.state.start == true) {
            return getPreciseDistance(newLatlng, this.state.prevLatlog) || 0
        }
        else {
            return 0
        }
    }

    makeRoute() {
        this.setState({
            makeRoute: true
        }, () => {
            this.state.mapReady == true &&
                this.mapSnapRef.fitToCoordinates(this.state.coordinates, { edgePadding: { top: 20, bottom: 20, right: 20, left: 20 }, animated: false })
        });
    }

    takeSnap() {
        return new Promise((resolve, reject) => {
            this.mapSnapRef.takeSnapshot({
                format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
                quality: 1,    // image quality: 0..1 (only relevant for jpg, default: 1)
                result: 'file',   // result types: 'file', 'base64' (default: 'file')
            }).then((uri) => {
                resolve({
                    'uri': uri,
                    'region': this.state.region,
                    'distance': this.state.distance
                })
            }).catch((e) => reject('Unable to take snap'))
        })
    }


    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
                {!this.state.makeRoute &&
                    <MapView
                        minZoomLevel={10}
                        maxZoomLevel={20}
                        showsUserLocation={!this.state.makeRoute ? true : false}
                        ref={mapRef => (this.mapRef = mapRef)}
                        style={[styles.map]}
                        customMapStyle={darkMap}
                        provider={PROVIDER_GOOGLE}
                        region={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}
                        zoomEnabled={true}
                    >
                        {<Polyline
                            coordinates={this.state.coordinates}
                            strokeColor="#29a2e1"
                            strokeWidth={6}
                        />
                        }
                        {this.state.coordinates.length > 0 &&
                            <Marker
                                zIndex={1}
                                coordinate={this.state.coordinates[0]}
                            >
                                <Image
                                    style={{ height: 30, width: 30 }}
                                    source={require('../../Images/mappingreen.png')}
                                />

                            </Marker>}
                        {this.state.coordinates.length > 0 && <Marker
                            coordinate={this.state.coordinates[this.state.coordinates.length - 1]}
                        >
                            <Image
                                style={{ height: 30, width: 30 }}
                                source={require('../../Images/mappinred.png')}
                            />
                        </Marker>}
                    </MapView>}
                {this.state.makeRoute &&
                    <View style={{
                        height: 200,
                        width: '100%',
                    }}>
                        <MapView
                            minZoomLevel={10}
                            maxZoomLevel={20}
                            onMapReady={() => { this.setState({ mapReady: true }) }}
                            showsUserLocation={!this.state.makeRoute ? true : false}
                            ref={mapRef => (this.mapSnapRef = mapRef)}
                            style={[styles.map]}
                            customMapStyle={darkMap}
                            provider={PROVIDER_GOOGLE}
                            customMapStyle={darkMap}
                            initialRegion={{
                                latitude: this.state.region.latitude,
                                longitude: this.state.region.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005
                            }}
                            onUserLocationChange={!this.state.makeRoute ? (location) => this.changeLocation(location) : () => { }}>
                            {
                                this.state.makeRoute && <Polyline
                                    coordinates={this.state.coordinates}
                                    strokeColor="#29a2e1"
                                    strokeWidth={6}
                                />
                            }
                            {this.state.makeRoute && this.state.coordinates.length > 0 &&
                                <Marker
                                    zIndex={1}
                                    coordinate={this.state.coordinates[0]}>
                                    <View style={styles.greenMarker}>
                                    </View>
                                </Marker>}
                            {this.state.makeRoute && <Marker
                                coordinate={this.state.region}>
                                <View style={[styles.greenMarker, { backgroundColor: 'red' }]}>
                                </View>
                            </Marker>}
                        </MapView>
                    </View>
                }
            </View>
        );
    }
}

export default MapComponent;
