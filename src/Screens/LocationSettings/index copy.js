import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    AppState,
    Platform
} from 'react-native';
import styles from './styles'
import { Header, Loader } from './../../Components';
import { AppImages, AppFontFamily } from './../../Themes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { PERMISSIONS, check } from 'react-native-permissions';
class LocationSetting extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={I18n.t('location_Setting')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            status: 1,
        }
    }

    componentDidMount() {
        if (Platform.OS == 'android') {
            check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then((res) => {
                if (res == 'granted') {
                    this.setState({ status: 1 })
                }
                else {
                    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((resF) => {
                        if (resF == 'granted') {
                            this.setState({ status: 2 })
                        }
                        else {
                            this.setState({ status: 99 })
                        }
                    })
                }
            })
        }
        else {
            BackgroundGeolocation.checkStatus((res) => {
                console.log('csjdfsadffdj', res.authorization);
                this.setState({ status: res.authorization })
            })
        }
        AppState.addEventListener('change', (state) => {
            if (state == 'active') {
                if (Platform.OS == 'ios') {
                    BackgroundGeolocation.checkStatus((res) => {
                        console.log('csjdfsadffdj', res, BackgroundGeolocation);
                        this.setState({ status: res.authorization })
                    })
                }
                else {
                    check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then((res) => {
                        console.log('fdjhfdjfhjfjdfsfd', res);
                        if (res == 'granted') {
                            this.setState({ status: 1 })
                        }
                        else {
                            check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((resF) => {
                                if (resF == 'granted') {
                                    this.setState({ status: 2 })
                                }
                                else {
                                    this.setState({ status: 99 })
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={[styles.boxView, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text numberOfLines={1} style={[styles.text, { width: '60%', color: 'black', fontFamily: AppFontFamily.fontFamily.semiBold }]}>{I18n.t("Manage location Settings")}</Text>
                    <Text
                        onPress={() => BackgroundGeolocation.showAppSettings()}
                        style={[styles.text, { color: '#29a2e1', width: '40%', textAlign: 'right' }]}>
                        {
                            this.state.status == 1 ? I18n.t('Always Allow') : this.state.status == 0 ? I18n.t('Never') :
                                this.state.status == 2 || this.state.status == 99 ? I18n.t('While Using') + "/" + I18n.t('Ask next time') : I18n.t('While Using') + "/" + I18n.t('Ask next time')
                        }
                    </Text>
                </View>
                {this.state.status !== 1 && <View style={[styles.boxInnerView,]}>
                    <View style={{ padding: 10, width: '20%', marginVertical: 10, justifyContent: 'center', borderRightWidth: 1, borderRightColor: 'lightgray' }}>
                        <Image
                            style={{ height: 50, width: 50 }}
                            source={require('../../Images/location-icon.png')}
                        />
                    </View>
                    <Text
                        style={[styles.text, { padding: 10, width: '80%', fontSize: 17, color: '#414040' }]}>{I18n.t('switchFrom')}
                        <Text
                            onPress={() => BackgroundGeolocation.showAppSettings()}
                            style={{ color: '#29a2e1', fontFamily: AppFontFamily.fontFamily.semiBold }}>
                            {
                                this.state.status == 1 ? I18n.t('Always Allow') : this.state.status == 0 ? I18n.t('Never') :
                                    this.state.status == 2 || this.state.status == 99 ? I18n.t('While Using') + "/" + I18n.t('Ask next time') : I18n.t('While Using') + "/" + I18n.t('Ask next time')
                            }
                        </Text> {'to '}
                        <Text
                            onPress={() => BackgroundGeolocation.showAppSettings()}
                            style={{ color: '#29a2e1', fontFamily: AppFontFamily.fontFamily.semiBold }}>{I18n.t('Always Allow')}.</Text></Text>
                </View>}
            </View>
        )
    }

}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationSetting);