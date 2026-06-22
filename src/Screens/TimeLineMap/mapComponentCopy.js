import React, { Component } from "react";
import { View } from "react-native";
import { DataManager } from '../../Components'
import geolocation from "react-native-geolocation-service";
import { getPreciseDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

class MapComponentCopy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      mapZoomin: 5,
      mapZoomout: 18,
      stop: false,
      pause: false,
      start: false,
      coordinates: [],
      oneMinCord: [],
      appenedOneMinCord: true,
      distance: Number(0),
      prevLatlog: {},
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      makeRoute: false,
      snapObj: null,
    };
  }

  componentDidMount() {
    this.getUserId()
    this.getLatLong();
  }
  getUserId = async () => {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);
    this.setState({ userId: jsonData.data._id })

  }
  oneMinuteCordArray = async (cord, timeStamp) => {
    let seconds = 0;
    if (this.state.oneMinCord.length > 0) {
      let diff = moment.duration(
        moment(new Date()).diff(moment(this.state.oneMinCord[0].timeStamp))
      );
      seconds = Math.floor(diff.asSeconds());
    }
    if (seconds > 60) {
      await this.state.oneMinCord.splice(0, 1);
      await this.state.oneMinCord.push({
        latitude: cord.latitude,
        longitude: cord.longitude,
        timeStamp: timeStamp,
      });
    } else {
      await this.state.oneMinCord.push({
        latitude: cord.latitude,
        longitude: cord.longitude,
        timeStamp: timeStamp,
      });
    }
    await this.setState({ oneMinCord: this.state.oneMinCord });
    await AsyncStorage.setItem(
      "oneMinCordArray",
      JSON.stringify(this.state.oneMinCord)
    );
  };
  getLatLong() {

    geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 0.0922,
        };

        if (this.mapRef) {
          this.mapRef.animateToRegion(region, 1000);
        }

        if (!this.state.makeRoute) {
          this.setState({
            coordinates: this.state.coordinates.concat({
              latitude: region.latitude,
              longitude: region.longitude,
            }),
            region,
            latitude: region.latitude,
            longitude: region.longitude,
          });
        }
      },
      (error) => {
        let region = {
          latitude: 40.741231,
          longitude: -74.101984,
          latitudeDelta: 28.857763630813984,
          longitudeDelta: 109.58674516528845,
        };
        this.setState(
          { region, latitude: region.latitude, longitude: region.longitude },
          () => { }
        );
        if (this.mapRef) {
          this.mapRef.animateToRegion(region, 1000);
        }
      },
      {
        distanceFilter: 1,
      }
    );
  }

  changeLocation = (location) => {
    if (this.state.coordinates.length < 5) {
    }
    this.setState({
      coordinates: this.state.coordinates.concat({
        latitude: location.nativeEvent.coordinate.latitude,
        longitude: location.nativeEvent.coordinate.longitude,
      }),
      region: {
        latitude: location.nativeEvent.coordinate.latitude,
        longitude: location.nativeEvent.coordinate.longitude,
      },
    });
  };

  //distance calculate
  calcDistance = (newLatlng) => {
    return getPreciseDistance(newLatlng, this.state.prevLatlog) || 0;
  };

  makeRoute() {
    this.setState(
      {
        makeRoute: true,
      },
      () => {
        this.mapSnapRef.fitToCoordinates(this.state.coordinates, {
          edgePadding: { top: 20, bottom: 20, right: 20, left: 20 },
          animated: false,
        });
      }
    );
  }

  takeSnap() {
    return new Promise((resolve, reject) => {
      this.mapSnapRef
        .takeSnapshot({
          format: "png", // image formats: 'png', 'jpg' (default: 'png')
          quality: 1, // image quality: 0..1 (only relevant for jpg, default: 1)
          result: "file", // result types: 'file', 'base64' (default: 'file')
        })
        .then((uri) => {
          resolve({
            uri: uri,
            region: this.state.region,
            distance: this.state.distance,
          });
        })
        .catch((e) => reject("Unable to take snap"));
    });
  }

  render() {
    return <View></View>;
  }
}

export default MapComponentCopy;
