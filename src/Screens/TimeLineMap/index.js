import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions, Image,
  AppState
} from "react-native";
import styles, { darkMap } from "./style";
import { Header, Loader, DataManager } from "./../../Components";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { Marker } from "react-native-maps";
import geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from "geolib";
import { CreatePostAction } from '../../Redux/actions/RoutePostAction'
import moment from "moment";
import Timer from '../../Components/Timer';
const height = Dimensions.get('screen').height
class TimeLine extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          headerTitle={'Timeline'}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => navigation.goBack()}
        />
      )
    };
  };
  constructor(porps) {
    super(porps);
    this.state = {
      mapZoomin: 5,
      mapZoomout: 16,
      showsec: 0,
      mapHeight: 0.9,
      startTime: null,
      stop: false,
      pause: false,
      start: false,
      seconds: 0,
      min: (Math.floor((this.props.stepLength) / 60)) || 0,
      hour: 0,
      coordinates: [],
      indexing: 1,
      back: false,
      data: [],
      distance: Number(0),
      prevLatlog: {},
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      appState: AppState.currentState,
    };
    this.mapRef = null
    this.mapReff = null
    this.timerRef = null
  }
  componentDidMount() {
    this.getLatLong()
  }
  componentWillUnmount() {
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      this.timerRef.getBackgroundTime();
      if (this.timerInterval === null) {
        console.log('Start interval in Foreground');
        this.callInterval();
      }
    } else {
      DataManager.setCallTime(Date.now());
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.setState({ appState: nextAppState });
  };

  //set timer interval
  callInterval = () => {
    this.timerInterval = null;
    this.timerInterval = setInterval(async () => {
      if (this.timerRef) {
        this.timerRef.add();
      }
    }, 1000);
  };

  //remove timer interval
  removeTimer = () => {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    AppState.removeEventListener('change', this._handleAppStateChange);
  };

  startTrack = () => {
    this.callInterval();
    let startTime = new Date();
    this.setState({ start: true, pause: false, startTime: this.state.startTime == null ? moment(startTime.getTime()).format('HH:mm') : this.state.startTime })
  }

  pauseTrack = () => {
    this.removeTimer();
    this.setState({ start: false, pause: true })
  }

  takeSnapshot() {
    this.setState({ start: false, stop: true, mapHeight: 0.33 })
    setTimeout(() => {
      this.mapReff.takeSnapshot({
        width: 300, // optional, when omitted the view-width is used
        height: 165,     // optional, when omitted the view-height is used
        // region: {latitude:this.state.coordinates.latitude,longitude:this.state.coordinates.longitude,longitudeDelta:0.012,latitudeDelta:0.012},    // iOS only, optional region to render
        region: this.state.region,    // iOS only, optional region to render
        format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
        quality: 1,    // image quality: 0..1 (only relevant for jpg, default: 1)
        result: 'file',   // result types: 'file', 'base64' (default: 'file')
      }).then((uri) => {
        let endTime = new Date()
        this.timerRef.getTotalTime();
        this.props.CreatePostAction(this.props.route.params.terminalId, parseInt(this.state.distance), this.timerRef.seconds, uri, this.state.startTime, moment(endTime.getTime()).format('HH:mm'), this.props.navigation, [])
      }).catch((e) => {
      })
    }, 200);
  }

  calcDistance = newLatlng => {
    return getPreciseDistance(newLatlng, this.state.prevLatlog) || 0
  }

  getLatLong() {
    geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords
      const newCoordinate = {
        latitude,
        longitude
      };
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          longitudeDelta: 0.056,
          latitudeDelta: 0.066
        },
        distance: this.state.start == true ? +this.state.distance + +this.calcDistance(newCoordinate) : this.state.distance,
        prevLatlog: newCoordinate
      })
    });
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
        if (this.mapReff) {
          this.mapReff.animateToRegion(region, 2000)
        }
        this.setState(
          {
            region,
            latitude: region.latitude,
            longitude: region.longitude,
          },
          () => {
          }
        );
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
        if (this.mapReff) {
          this.mapReff.animateToRegion(region, 2000)
        }
      },
    );
  }


  changeLocation = (location) => {
    if (this.state.start == true) {
      if (this.state.coordinates.length < 5) {
        this.mapRef.fitToCoordinates(this.state.coordinates, { edgePadding: { top: 100, bottom: 100, right: 50, left: 50 }, animated: false })
      }
      this.mapReff.fitToCoordinates(this.state.coordinates, { edgePadding: { top: 40, bottom: 40, right: 50, left: 50 }, animated: false })
    }
    this.setState({
      coordinates: this.state.start == true ? this.state.coordinates.concat({
        latitude: location.nativeEvent.coordinate.latitude,
        longitude: location.nativeEvent.coordinate.longitude
      }) : this.state.coordinates,
      region: {
        latitude: location.nativeEvent.coordinate.latitude,
        longitude: location.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.054
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.routeState.onLoad} />
        <View style={[styles.mapView, { height: 200, position: 'absolute', top: 220 }]}>
          <MapView
            showsUserLocation={true}
            ref={mapRef => (this.mapReff = mapRef)}
            style={styles.map}
            customMapStyle={darkMap}
            provider={PROVIDER_GOOGLE}
            customMapStyle={darkMap}
            initialRegion={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta
            }}
            onUserLocationChange={(location) => this.changeLocation(location)}
          >
            {
              this.state.stop == true ?
                <Polyline
                  coordinates={this.state.coordinates}
                  strokeColor="#bf8221"
                  strokeColors={['#bf8221', '#ffe066', '#ffe066', '#ffe066', '#ffe066',]}
                  strokeWidth={3}
                />
                : null
            }
            {
              this.state.stop == true ?
                <Marker
                  coordinate={this.state.coordinates[0]}
                  pinColor={'blue'}
                /> : null}
            {this.state.stop == true ? <Marker
              coordinate={this.state.region}
            />
              : null
            }
          </MapView>
        </View>
        <View style={[styles.mapView, { height: height * 0.9, }]}>
          <MapView
            minZoomLevel={this.state.mapZoomin}
            maxZoomLevel={this.state.mapZoomout}
            showsUserLocation={true}
            ref={mapRef => (this.mapRef = mapRef)}
            style={styles.map}
            customMapStyle={darkMap}
            provider={PROVIDER_GOOGLE}
            customMapStyle={darkMap}
            initialRegion={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              latitudeDelta: 0.066,
              longitudeDelta: 0.056
            }}
            onUserLocationChange={(location) => this.changeLocation(location)}
          >
            {
              this.state.stop == true ?
                <Polyline
                  coordinates={this.state.coordinates}
                  strokeColor="#bf8221"
                  strokeColors={['#bf8221', '#ffe066', '#ffe066', '#ffe066', '#ffe066',]}
                  strokeWidth={3}
                />
                : null
            }
            {
              this.state.stop == true ?
                <Marker
                  coordinate={this.state.coordinates[0]}
                  pinColor={'blue'}
                /> : null}
            {this.state.stop == true ? <Marker
              coordinate={this.state.region}
            />
              : null
            }
          </MapView>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.start == true ?
            <TouchableOpacity onPress={() => this.pauseTrack()} style={styles.startPauseButton}>
              <Image style={{ height: 100, width: 100 }} resizeMode='contain' source={AppImages.images.pause} />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => this.startTrack()} style={styles.startPauseButton}>
              <Image style={{ height: 100, width: 100 }} resizeMode='contain' source={AppImages.images.start} />
            </TouchableOpacity>}
          {
            this.state.pause == true ?
              <TouchableOpacity onPress={() => this.takeSnapshot()} style={styles.stopButton}>
                <Image style={{ height: 80, width: 80 }} resizeMode='contain' source={AppImages.images.stop} />
              </TouchableOpacity>
              : null
          }
        </View>
        <View style={{ position: 'absolute', alignSelf: 'center', marginTop: 20 }}>
          <Timer
            ref={refs => this.timerRef = refs}
          />
        </View>
      </SafeAreaView>
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
)(TimeLine);

