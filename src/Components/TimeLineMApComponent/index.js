import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
} from "react-native";

import styles, { darkMap } from "./style";

import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { Marker } from "react-native-maps";
import geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from "geolib";

const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width




export default class mapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapZoomin: 5,
      mapZoomout: 16,
      stop: false,
      pause: false,
      start: false,
      coordinates: [],
      distance: Number(0),
      prevLatlog: {},
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    };
    this.mapRef = null
    this.mapReff = null

  }
  componentDidMount() {
    this.getLatLong()
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


  //map view
  mapView = () => {
    return (
      <View style={{ flex: 1 }}>
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
      </View>
    )
  }

  //distance calculate
  calcDistance = newLatlng => {
    return getPreciseDistance(newLatlng, this.state.prevLatlog) || 0

  }
  render() {
    return (
      <SafeAreaView>
        {this.mapView()}
      </SafeAreaView>
    )
  }

}