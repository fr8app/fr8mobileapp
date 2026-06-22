import { Dimensions, Platform, StyleSheet } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: AppColor.colors.white,
  },
  mainSearchView: {
    width: "100%",
    flexDirection: 'row',
    marginTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: AppColor.colors.placeHolder,
    overflow: "hidden"
  },
  map: {
    height: Dimensions.get('screen').height * 0.5,
    width: "100%",
    alignItems: 'center'
  },
  location: {
    width: 20,
    height: 20,
  },
  locationText: {
    fontSize: 15,
    color: AppColor.colors.twoTwo,
    fontFamily: AppFontFamily.fontFamily.regular,
    marginLeft: 15,
    textAlign: 'left',
  },
  tab_table: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15
  },
  tabs: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  division: {
    width: 1,
    backgroundColor: AppColor.colors.placeHolder,
    height: 50
  },
  hintImages: {
    height: 25,
    width: 25
  },
  hintHeading: {
    paddingTop: 5,
    fontSize: 17,
    textAlign: 'center',
    color: AppColor.colors.twoTwo
  },
  lineView: {
    width: "100%",
    height: 0.5,
    backgroundColor: AppColor.colors.placeHolder,
  },
  innerImage: {
    height: '56%',
    width: '85%',
    top: 6,
    position: "absolute",
    zIndex: 1,
    borderRadius: 2,
  },
  outerImage: {
    width: 80,
    height: 80,
    alignItems: "center",
    borderRadius: 2,
  },

  //////
  background: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  wrap: {
    borderRadius: 8,
    backgroundColor: "#FFF",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  headerText: {
    textAlign: "center",
    fontSize: 24,
  },
  regularText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007ffe",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
  },
})

export const darkMap = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
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
        "color": "#000000"
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
  }
];