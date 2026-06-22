import React, { Component } from 'react';
import {
  View,
  FlatList,
  Platform,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';
import styles, { darkMap } from './styles'
import { AppImages } from './../../Themes';
import MapView, { Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import geolocation from '@react-native-community/geolocation'
import { imageBaseUrl } from '../../Config';
import { fontFamily } from '../../Themes/AppFontFamily';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getCurrentUser, getTerminalWaitingTime, getTerminalWaitingTimeNew, getTerminalWaitingTimeShowWithFormat, getTerminalWaitingTimeShowWithFormatNew } from '../../Components/getTerminalWaitingTime';
import WebView from 'react-native-webview';
import FullWeb from '../FullWebView/fullWeb';
const width = Dimensions.get('screen').width
const starts = [1, 2, 3, 4, 5]
class MapComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      toolTipVisible: false,
      ready: false,
      visible: false
    }
    this.item = null
  }

  componentDidMount() {
    this.getLatLong()
  }


  getLatLong = () => {
    geolocation.getCurrentPosition((position) => {
      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      this.setState({ region })
    }, (error) => {
      let region = {
        latitude: 40.741231,
        longitude: -74.101984,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      this.setState({ region })
    });
  }

  setonLineUSers = (data) => {
  }

  getRoundImage(result) {
    return result.terminal_category == "Port Terminal" ||
      result.terminal_category == "Empty Depot"
      ? parseInt(getTerminalWaitingTimeNew(result)) <=
        45
        ? require("../../Images/circleImages/location1.png")
        : parseInt(getTerminalWaitingTimeNew(result)) >
          45 &&
          parseInt(getTerminalWaitingTimeNew(result)) <=
          60
          ? require("../../Images/circleImages/location2.png")
          : parseInt(getTerminalWaitingTimeNew(result)) >
            60 &&
            parseInt(getTerminalWaitingTimeNew(result)) <=
            90
            ? require("../../Images/circleImages/location3.png")
            : parseInt(getTerminalWaitingTimeNew(result)) >
              90 &&
              parseInt(getTerminalWaitingTimeNew(result)) <=
              120
              ? require("../../Images/circleImages/location4.png")
              : parseInt(getTerminalWaitingTimeNew(result)) >
                120 &&
                parseInt(getTerminalWaitingTimeNew(result)) <=
                240
                ? require("../../Images/circleImages/location5.png")
                : require("../../Images/circleImages/location6.png")
      : parseInt(getTerminalWaitingTimeNew(result)) <=
        30
        ? require("../../Images/circleImages/location1.png")
        : parseInt(getTerminalWaitingTimeNew(result)) >
          30 &&
          parseInt(getTerminalWaitingTimeNew(result)) <=
          60
          ? require("../../Images/circleImages/location2.png")
          : parseInt(getTerminalWaitingTimeNew(result)) >
            60 &&
            parseInt(getTerminalWaitingTimeNew(result)) <=
            90
            ? require("../../Images/circleImages/location3.png")
            : parseInt(getTerminalWaitingTimeNew(result)) >
              90 &&
              parseInt(getTerminalWaitingTimeNew(result)) <=
              120
              ? require("../../Images/circleImages/location4.png")
              : parseInt(getTerminalWaitingTimeNew(result)) >
                120 &&
                parseInt(getTerminalWaitingTimeNew(result)) <=
                240
                ? require("../../Images/circleImages/location5.png")
                : require("../../Images/circleImages/location6.png")
  }
  getRoundTextColor(result) {
    return result.terminal_category == "Port Terminal" ||
      result.terminal_category == "Empty Depot"
      ? parseInt(getTerminalWaitingTimeNew(result)) <=
        45
        ? "rgb(95,178,75)"
        : parseInt(getTerminalWaitingTimeNew(result)) >
          45 &&
          parseInt(getTerminalWaitingTimeNew(result)) <=
          60
          ? "rgb(23,108,70)"
          : parseInt(getTerminalWaitingTimeNew(result)) >
            60 &&
            parseInt(getTerminalWaitingTimeNew(result)) <=
            90
            ? "rgb(226,181,58)"
            : parseInt(getTerminalWaitingTimeNew(result)) >
              90 &&
              parseInt(getTerminalWaitingTimeNew(result)) <=
              120
              ? "rgb(165,98,38)"
              : parseInt(getTerminalWaitingTimeNew(result)) >
                120 &&
                parseInt(getTerminalWaitingTimeNew(result)) <=
                240
                ? "rgb(199,6,32)"
                : "rgb(102,6,18)"
      : parseInt(getTerminalWaitingTimeNew(result)) <=
        30
        ? "rgb(95,178,75)"
        : parseInt(getTerminalWaitingTimeNew(result)) >
          30 &&
          parseInt(getTerminalWaitingTimeNew(result)) <=
          60
          ? "rgb(23,108,70)"
          : parseInt(getTerminalWaitingTimeNew(result)) >
            60 &&
            parseInt(getTerminalWaitingTimeNew(result)) <=
            90
            ? "rgb(226,181,58)"
            : parseInt(getTerminalWaitingTimeNew(result)) >
              90 &&
              parseInt(getTerminalWaitingTimeNew(result)) <=
              120
              ? "rgb(165,98,38)"
              : parseInt(getTerminalWaitingTimeNew(result)) >
                120 &&
                parseInt(getTerminalWaitingTimeNew(result)) <=
                240
                ? "rgb(199,6,32)"
                : "rgb(102,6,18)"
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ visible: true })
          this.item = item
        }}
        style={{ paddingLeft: 15, height: Dimensions.get('screen').width * 0.25, borderRadius: 10 }}>
        <WebView
          containerStyle={{ borderRadius: 20 }}
          showsHorizontalScrollIndicator={false}
          style={{ height: Dimensions.get('screen').width * 0.25, width: Dimensions.get('screen').width * 0.3, borderRadius: 10, }}
          scrollEnabled={false}
          source={{ uri: item, }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { terminalRegion, origin, destination, result } = this.props;
    console.log('map rerender');
    return (
      <View style={{ flex: 1 }}>
        <MapView
          onMapReady={() => this.setState({ ready: true })}
          onPress={() => this.setState({ toolTipVisible: false })}
          zoomTapEnabled={true}
          zoomEnabled={true}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: terminalRegion.latitude == undefined ? 0 : Number(terminalRegion.latitude),
            longitude: terminalRegion.longitude == undefined ? 0 : Number(terminalRegion.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          customMapStyle={darkMap}
          userInteraction={false}
          scrollEnabled={Platform.OS == 'ios' ? true : true}
          region={{
            latitude: terminalRegion.latitude == undefined ? 0 : Number(terminalRegion.latitude),
            longitude: terminalRegion.longitude == undefined ? 0 : Number(terminalRegion.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >

          <MapViewDirections
            origin={this.state.region}
            destination={destination}
            apikey={"AIzaSyADSoeBA92xN9hasoDOyEWHEKHHHePUYlM"}
          />

          {!Array.isArray(result) && result &&
            <Marker
              style={{ alignItems: 'center' }}
              onPress={() => this.setState({ toolTipVisible: !this.state.toolTipVisible })}
              icon={imageBaseUrl + result.map_logo}
              coordinate={{
                latitude: terminalRegion.latitude == undefined ? 0 : Number(terminalRegion.latitude),
                longitude: terminalRegion.longitude == undefined ? 0 : Number(terminalRegion.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}>
              {Platform.OS == 'ios'
              ?
               <Callout tooltip style={{ marginBottom: 30 }}>
                <ImageBackground
                  borderRadius={10}
                  resizeMode='cover' style={{ borderRadius: 5, justifyContent: 'space-between' }} source={require('../../Images/box2.png')}>
                  <View style={{ flexDirection: 'row', marginBottom: 16, marginTop: 10, justifyContent: 'space-between' }}>
                    <View style={{ width: width * 0.25, backgroundColor: '#0082b6', marginHorizontal: 5 }}>
                      <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: fontFamily.bold, padding: 2, color: '#fff' }}>
                      {console.log(getTerminalWaitingTimeShowWithFormat(result,"terminalDetails"),"manu")}
                        {
                          
                          [
                            getTerminalWaitingTimeShowWithFormat(result,"terminalDetails")

                          ] +
                          " "}

              
                        {'\n' +
                          'Est. Wait Time'}

                      </Text>
                    </View>
                    <View style={{ width: width * 0.25, backgroundColor: '#0082b6', marginRight: 5 }}>
                      <Text style={{ textAlign: 'center', padding: 2, color: '#fff', fontSize: 16, fontFamily: fontFamily.bold }}>
                        {getCurrentUser(result, this.props.totalUsers)}
                      </Text>
                      <MatIcon
                        style={{ alignSelf: 'center' }}
                        color='#fff'
                        name='account-group'
                        size={40}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </Callout> :
                this.state.toolTipVisible && <ImageBackground
                  borderRadius={10}
                  resizeMode='cover' style={{ borderRadius: 5, justifyContent: 'space-between' }} source={require('../../Images/box2.png')}>
                  <View style={{ flexDirection: 'row', marginBottom: 16, marginTop: 10, justifyContent: 'space-between' }}>
                    <View style={{ width: width * 0.25, backgroundColor: '#0082b6', marginHorizontal: 5 }}>
                      <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: fontFamily.bold, padding: 2, color: '#fff' }}>
                        {

                          [
                            getTerminalWaitingTimeShowWithFormat(result)

                          ] +
                          " "}
                          {console.log(getTerminalWaitingTimeShowWithFormat(result,"terminalDetails"),"manu")}

                        {'\n' +
                          'Est. Wait Time'}

                      </Text>
                    </View>
                    <View style={{ width: width * 0.25, backgroundColor: '#0082b6', marginRight: 5 }}>
                      <Text style={{ textAlign: 'center', padding: 2, color: '#fff', fontSize: 16, fontFamily: fontFamily.bold }}>
                        {getCurrentUser(result, this.props.totalUsers)}
                      </Text>
                      <MatIcon
                        style={{ alignSelf: 'center' }}
                        color='#fff'
                        name='account-group'
                        size={40}
                      />
                    </View>
                  </View>
                </ImageBackground>}
              <ImageBackground
                source={
                  result.terminal_category == "Port Terminal" ||
                    result.terminal_category == "Empty Depot"
                    ? parseInt(getTerminalWaitingTime(result)) <=
                      45
                      ? require("../../Images/location1.png")
                      : parseInt(getTerminalWaitingTime(result)) >
                        45 &&
                        parseInt(getTerminalWaitingTime(result)) <=
                        60
                        ? require("../../Images/location2.png")
                        : parseInt(getTerminalWaitingTime(result)) >
                          60 &&
                          parseInt(getTerminalWaitingTime(result)) <=
                          90
                          ? require("../../Images/location3.png")
                          : parseInt(getTerminalWaitingTime(result)) >
                            90 &&
                            parseInt(getTerminalWaitingTime(result)) <=
                            120
                            ? require("../../Images/location4.png")
                            : parseInt(getTerminalWaitingTime(result)) >
                              120 &&
                              parseInt(getTerminalWaitingTime(result)) <=
                              240
                              ? require("../../Images/location5.png")
                              : require("../../Images/location6.png")
                    : parseInt(getTerminalWaitingTime(result)) <=
                      30
                      ? require("../../Images/location1.png")
                      : parseInt(getTerminalWaitingTime(result)) >
                        30 &&
                        parseInt(getTerminalWaitingTime(result)) <=
                        60
                        ? require("../../Images/location2.png")
                        : parseInt(getTerminalWaitingTime(result)) >
                          60 &&
                          parseInt(getTerminalWaitingTime(result)) <=
                          90
                          ? require("../../Images/location3.png")
                          : parseInt(getTerminalWaitingTime(result)) >
                            90 &&
                            parseInt(getTerminalWaitingTime(result)) <=
                            120
                            ? require("../../Images/location4.png")
                            : parseInt(getTerminalWaitingTime(result)) >
                              120 &&
                              parseInt(getTerminalWaitingTime(result)) <=
                              240
                              ? require("../../Images/location5.png")
                              : require("../../Images/location6.png")
                }
                style={styles.outerImage}
              >
                <Image
                  style={styles.innerImage}
                  resizeMode="stretch"
                  source={
                    result.map_logo == "" ||
                      result.map_logo == null
                      ? result.terminal_category ==
                        "Port Terminal"
                        ? AppImages.images.port1
                        : result.terminal_category ==
                          "Empty Depot"
                          ? AppImages.images.Empty1
                          : result.terminal_category ==
                            "Warehouse"
                            ? AppImages.images.warehouse1
                            : result.terminal_category ==
                              "Rail Terminal"
                              ? AppImages.images.rail1
                              : AppImages.images.chassis :
                      { uri: imageBaseUrl + result.map_logo }
                  }
                />
              </ImageBackground>
            </Marker>
          }
        </MapView>
        <ImageBackground source={require('../../Images/Rectangle.png')} style={{ position: 'absolute', bottom: 0, paddingVertical: 15, width: '100%' }}>
          {result && <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            <View style={{ width: '70%' }}>
              <Text
                numberOfLines={2}
                style={{ color: 'white', fontSize: 22 }}
              >
                {result?.terminal_name}
              </Text>
              <Text
                numberOfLines={1}
                style={{ color: 'white', fontSize: 16 }}
              >
                {result?.region_name}
              </Text>
              {result?.averageRating ? <Text
                style={{ color: 'white', fontSize: 16 }}
              >
                {result?.averageRating + " "}
                {

                  result?.averageRating ?
                    Math.floor(result?.averageRating) ?
                      [
                        starts.map((x, index) => {
                          return (
                            <Image resizeMode='contain' source={Math.floor(result?.averageRating) >= x ? require('../../Images/circleImages/star.png') :
                              (!Number.isInteger(result?.averageRating) && (x - 1) == Math.floor(result?.averageRating)) ?
                                require('../../Images/circleImages/el_star.png')
                                :
                                require('../../Images/circleImages/emptyStar.png')} style={{ marginHorizontal: 1, height: 12, width: 12 }} />
                          )
                        })
                      ]
                      :
                      null
                    :
                    null
                }
              </Text> : null}
            </View>
            {!isNaN(result?.avg_total_stopage_time_in_minutes) ?
              <ImageBackground
                style={{ height: 65, width: 65, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
                source={this.getRoundImage(result)}>
                <Text
                  style={{ width: '60%', color: this.getRoundTextColor(result), textAlign: 'center', fontSize: 12, fontFamily: fontFamily.bold }}
                >
                  {getTerminalWaitingTimeShowWithFormatNew(result)}
                </Text>
              </ImageBackground>
              : null
            }
          </View>}
          {result.terminal_image_type == 'url' ?
            <FlatList
              contentContainerStyle={{ paddingRight: 20 }}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 15, }}
              horizontal={true}
              data={result.terminal_url}
              renderItem={this.renderItem}
            />
            :
            <TouchableOpacity
              style={{ marginBottom: 20, height: Dimensions.get('screen').width * 0.25, width: Dimensions.get('screen').width * 0.3, }}
              onPress={() => {
                this.setState({ visible: true })
                this.item = imageBaseUrl + result.terminal_logo
              }} >
              <Image
                source={{ uri: imageBaseUrl + result.terminal_logo }}
                style={{ marginTop: 15, height: Dimensions.get('screen').width * 0.25, width: Dimensions.get('screen').width * 0.3, borderRadius: 10, marginLeft: 15 }}
              />
            </TouchableOpacity>
          }
        </ImageBackground>
        <FullWeb
          isImage={result.terminal_image_type == 'url' ? false : true}
          close={() => this.setState({ visible: false })}
          visible={this.state.visible}
          uri={this.item}
        />
      </View>
    )
  }
}

export default MapComponent