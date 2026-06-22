import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily, Dimensions } from './../../Themes';
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: AppColor.colors.white
  },
  greenMarker: {
    height: 20,
    width: 20,
    backgroundColor: '#37a828',
  },
  map: {
    flex: 1,
    height: 200,
    width: "100%",
  },
  noValueText: {
    color: AppColor.colors.twoTwo,
    fontFamily: AppFontFamily.fontFamily.regular,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 15,
  },
  goToSettingView: {
    paddingHorizontal: 80,
    width: "100%",
    position: 'absolute',
    bottom: 30,
    alignSelf: "center"
  },
  listEmptyComponentView: {
    height: Dimensions.deviceHeight / 2,
    justifyContent: 'center'
  },
  animatedView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
  outerImage: {
    width: 80,
    height: 80,
    alignItems: "center",
    borderRadius: 2,
  },
  innerImage: {
    height: '56%',
    width: '85%',
    top: 6,
    position: "absolute",
    zIndex: 1,
    borderRadius: 2,
  },
  zoom: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 30,
    marginLeft: '80%',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  zoomView: {
    position: 'absolute',
    top: 75,
    width: '30%',
    right: 40,
  },
  createPost: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  }

})

export const darkMap = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0f1214"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1917"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  },

  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
];

