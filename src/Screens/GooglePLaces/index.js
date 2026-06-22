import React, { Component } from 'react';
import { Header, Loader, } from '../../Components';
import I18n from 'react-native-i18n';
import { AppImages, AppFontFamily } from '../../Themes'
import { GooglePlacesAutocomplete } from '../../../libs/react-native-google-places-autocomplete';
import styles from './style'
import { Dimensions, Image, View, Platform, Text, TouchableOpacity, Keyboard, AppState, FlatList } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import GeolocationService from 'react-native-geolocation-service';
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux';
import { AFLogEvent } from '../../Config/aws';
const apiKey = 'AIzaSyAId9HPoVrtc6rDn9O-tAWERRJEelhkARc'
let _this = null
let height = Dimensions.get('screen').height
class GooglePlacesInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            keyboardShown: false,
            selection: {
                start: 0,
                end: 0
            },
            latitude: '',
            longitude: '',
            terminal_id: '',
            enetedText: '',
            selectedLocation: '',
            disabled: false,
            disabledLocationBtn: false,
            emptyData: true,
            locationVisible: true,
            loader: false
        }
        _this = this
    }


    componentDidMount() {
        AFLogEvent("CheckIn", { screen: 'CheckIn' })
        Keyboard.addListener('keyboardDidShow', () => {
            this.setState({ keyboardShown: true })
        })
        Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardShown: false })
            this?.places?.blur()
        })

        AppState.addEventListener('change', (state) => {
            if (state == 'active') {
                this.setState({ loader: false })
            }
        })

        setTimeout(() => {
            if (this.props.selectedText) {
                this.setState({ selectedLocation: this.props.selectedText })
            }
        }, 200);
        console.log('sdfdfdfgdfgddfsf', this.props.selectedText);
        Keyboard.addListener('keyboardDidShow', () => {
            this.setState({ locationVisible: false })
        })
        Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ locationVisible: true })
        })
    }

    async selectYourCurrentlocation() {
        this.setState({ disabledLocationBtn: true })
        setTimeout(() => {
            this.setState({ disabledLocationBtn: false })
        }, 2000);
        NetInfo.fetch().then((res) => {
            if (res.isConnected) {
                this.setState({ loader: true })
                setTimeout(() => {
                    Platform.OS == 'ios' ?
                        Geolocation.getCurrentPosition(
                            position => {
                                fetch(
                                    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                                    position.coords.latitude +
                                    "," +
                                    position.coords.longitude +
                                    "&key=" + apiKey
                                )
                                    .then(response => response.json())
                                    .then(responseJson => {
                                        this.setState({ loader: false })
                                        this.setState({ selectedLocation: responseJson.results[0].formatted_address, latitude: position.coords.latitude, longitude: position.coords.longitude })
                                        console.log('responseJson.results[0].formatted_address', responseJson.results[0].formatted_address);
                                    }).catch((e) => {
                                        this.setState({ loader: false })
                                    }).catch((e) => {
                                        this.setState({ loader: false })
                                    });
                            },
                            error => {
                                this.setState({ loader: false })
                            }
                        ) :
                        GeolocationService.getCurrentPosition(
                            position => {
                                fetch(
                                    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                                    position.coords.latitude +
                                    "," +
                                    position.coords.longitude +
                                    "&key=" + apiKey
                                )
                                    .then(response => response.json())
                                    .then(responseJson => {
                                        this.setState({ loader: false })
                                        this.setState({ selectedLocation: responseJson.results[0].formatted_address, latitude: position.coords.latitude, longitude: position.coords.longitude })
                                        console.log('responseJson.results[0].formatted_address', responseJson.results[0].formatted_address);

                                    }).catch((e) => {
                                        this.setState({ loader: false })
                                    }).catch((e) => {
                                        this.setState({ loader: false })
                                    });
                            },
                            error => {
                                this.setState({ loader: false })
                            }
                        );
                }, 1000);
            }
            else {
                alert(I18n.t('please_check_your_internet_connection'))
            }
        })
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ selectedLocation: item?.name, latitude: item?.latitude, longitude: item?.longitude })
                }}
                activeOpacity={0.7}
                style={{ borderColor: 'lightgray', borderBottomWidth: 1, width: Dimensions.get('screen').width, alignItems: 'flex-start', alignSelf: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20, }}>
                <Text>{item?.name}</Text>
            </TouchableOpacity>
        )
    }


    renderLeft = () => {
        return (
            Platform.OS == 'ios' ?
                <Image
                    resizeMode="contain"
                    style={styles.searchImage}
                    source={AppImages.images.search}
                />
                :
                <Text style={{ height: 30 }}>
                    <Image
                        resizeMode="contain"
                        style={styles.searchImage}
                        source={AppImages.images.search}
                    />
                </Text>
        )
    }
    emptyData = () => {
        return (
            this.state.selectedLocation.length == 0 && this.state.enetedText.length > 3 ? <View style={styles.empty}>
                <Text>{I18n.t('noPlace')}</Text>
            </View>
                : null
        )
    }
    render() {


        return (
            <>
                <View style={{ height: height }}>
                    <Loader loading={this.state.loader} />
                    <View style={{ flex: Platform.OS == 'ios' ? 0.12 : 0.109 }}>
                        <Header
                            rightDisable={this.state.disabled}
                            rightBackBtnPress={() => {
                                this.props.rightBackPress(this.state.selectedLocation?.trim(), this.state.latitude, this.state.longitude)
                                this.setState({ disabled: true })
                                setTimeout(() => {
                                    this.setState({ disabled: false })

                                }, 200);
                            }}
                            headerTitle={I18n.t('addLocation')}
                            leftImageSource={AppImages.images.back}
                            rightHeaderText={I18n.t('ADD')}
                            leftBackBlink={true}
                            leftbackbtnPress={() => this.props.leftBackPress()} />
                    </View>
                    <>
                        <GooglePlacesAutocomplete
                            ref={(ref) => this.places = ref}
                            predefinedPlacesAlwaysVisible={false}
                            fetchDetails={true}
                            listEmptyComponent={() => this.emptyData()}
                            currentLocation={true}
                            currentLocationLabel='Current Location'
                            predefinedPlaces={this.props.userInTerminal ?
                                [
                                    {
                                        description: this?.props?.userInTerminal?.terminal?.terminal_location + ', ' + this?.props?.userInTerminal?.terminal?.city
                                            + ', ' + this?.props?.userInTerminal?.terminal?.state_province + ', ' + this?.props?.userInTerminal?.terminal?.country,

                                        terminal_id: this?.props?.userInTerminal?.terminal?._id,
                                        geometry: {
                                            location:
                                            {
                                                lat: this?.props?.userInTerminal?.terminal?.latitude,
                                                lng: this?.props?.userInTerminal?.terminal?.longitude
                                            }
                                        }
                                    }
                                ]
                                : []
                            }
                            enableHighAccuracyLocation={true}
                            textInputProps={
                                this.props.isCustomText ?
                                    {
                                        onFocus: () => { this.setState({ keyboardShown: true }) },
                                        onBlur: () => { this.setState({ keyboardShown: false }) },
                                        value: this.state.selectedLocation,
                                        onChangeText: (text) => {
                                            if (this.props.isCustomText) {
                                                this.setState({ enetedText: text, selectedLocation: text })
                                            }
                                            else {
                                                this.setState({ enetedText: text })
                                            }
                                        }
                                    }
                                    :
                                    {
                                        onChangeText: (text) => {
                                            if (this.props.isCustomText) {

                                                this.setState({ enetedText: text, selectedLocation: text })
                                            }
                                            else {

                                                this.setState({ enetedText: text })
                                            }
                                        }
                                    }}
                            renderLeftButton={() => this.renderLeft()}
                            styles={{
                                textInput: styles.inputColor,
                                container: { marginHorizontal: 20 },
                                textInputContainer: styles.containerInputImage,
                                listView: {
                                    position: this.props.isCustomText ? "absolute" : 'relative',
                                    top: this.props.isCustomText ? Platform.OS == "ios" ? 100 : 100 : 0,
                                    backgroundColor: "white",
                                    zIndex: 1
                                }
                            }}
                            placeholder='Search'
                            onPress={(data, details = null) => {
                                console.log('dddd', data, details);
                                this.setState({ selectedLocation: data.description, latitude: data?.geometry ? data?.geometry?.location?.lat : details.geometry.location.lat, longitude: data?.geometry ? data?.geometry?.location?.lng : details.geometry.location.lng })

                            }}
                            query={{
                                key: apiKey,
                                language: 'en',
                            }}
                        />
                        {this.props.isCustomText &&
                            <View style={{ alignSelf: 'flex-end', position: 'absolute', top: Platform.OS == 'ios' ? "19.5%" : "18%", paddingRight: 20 }}>
                                <TouchableOpacity
                                    disabled={this.state.disabledLocationBtn}
                                    onPress={() => {
                                        this.selectYourCurrentlocation()

                                    }} style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }]}>
                                    {Platform.OS == 'ios' ?
                                        <Image style={{ width: 20, height: 20 }} resizeMode='contain' source={require('../../Images/pin.png')} />
                                        :
                                        <Text style={{ height: 30 }}>
                                            <Image style={{ width: 20, height: 20 }} resizeMode='contain' source={require('../../Images/pin.png')} />
                                        </Text>}
                                    <Text style={{
                                        fontFamily: AppFontFamily.fontFamily.regular,
                                        fontSize: 18,
                                        color: "#29a2e1",
                                        fontWeight: 'normal',
                                        textAlign: 'center',
                                        marginLeft: '2%'
                                    }}>{I18n.t('selectCurentLocation')}</Text>
                                </TouchableOpacity>
                            </View>}
                        {
                            this.props.isRecentLocations && this.state.keyboardShown == false &&
                            <View
                                style={{ position: 'absolute', top: Platform.OS == 'ios' ? "24%" : "21%", flexGrow: 1 }}>

                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 50 }}
                                    style={{ height: Dimensions.get('screen').height * 0.7 }}
                                    data={this.props.routePostData.recentLocations}
                                    renderItem={this.renderItem}
                                />
                            </View>
                        }
                    </>
                </View>
            </>
        );
    }
};

function mapStateToProps(state) {
    return {
        routePostData: state.RoutePostData
    }
}
export default connect(mapStateToProps, {})(GooglePlacesInput);
