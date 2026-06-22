import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import styles from './style'
import { AppFontFamily } from './../../Themes';
import DeviceInfo from 'react-native-device-info';
import I18n from 'react-native-i18n'
export default class CameraModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disable: false
        }

    }
    render() {
        return (

            <Modal
                style={styles.MainWrapper}
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    console.log("Modal has been closed.");
                }}
            >
                <ImageBackground source={require('../../Images/addPostMap.png')} style={{ backgroundColor: 'black', marginBottom: -1, flex: 1, marginTop: DeviceInfo.hasNotch() ? 100 : 75, alignItems: "center" }}>
                    <View style={{ width: '100%', height: 50, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>

                        <TouchableOpacity onPress={() => {
                            this.props.oncancel(1)
                        }}>
                            <Image style={{ width: 35, height: 35, marginRight: 10 }} resizeMode="contain" source={require('../../Images/down-arrowClient.png')} />

                        </TouchableOpacity>
                    </View>


                    <View style={{ width: '100%', height: 350, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[this.props.onVideo&&this.props.onImage?null:{justifyContent:'center'},{ backgroundColor: 'black', opacity: 0.8, width: 250, height: 280, borderRadius: 20 }]}>
                           {this.props.onVideo&& <TouchableOpacity activeOpacity={1} disabled={this.state.disable} onPress={() => {
                                this.props.onVideo(), this.setState({ disable: true }), setTimeout(() => {
                                    this.setState({ disable: false })
                                }, 200)
                            }} style={{ width: '90%', height: 80, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ borderColor: '#29a2e1', borderWidth: 2, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginLeft: 15 }}>
                                    <Image style={{ width: 30, height: 30 }} resizeMode='contain' source={require('../../Images/videoClientAdd.png')} />
                                </View>
                                <Text style={{ color: 'white', fontSize: 20, fontFamily: AppFontFamily.fontFamily.regular, marginLeft: 12 }}>VIDEO </Text>
                            </TouchableOpacity>}
                            {this.props.onImage&&<TouchableOpacity activeOpacity={1} disabled={this.state.disable} onPress={() => {
                                this.props.onImage(), this.setState({ disable: true }), setTimeout(() => {
                                    this.setState({ disable: false })
                                }, 200)
                            }} style={{ width: '90%', height: 80, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ borderColor: '#29a2e1', borderWidth: 2, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginLeft: 15 }}>
                                    <Image style={{ width: 30, height: 30 }} resizeMode='contain' source={require('../../Images/cameraAddClient.png')} />
                                </View>
                                <Text style={{ color: 'white', fontSize: 20, fontFamily: AppFontFamily.fontFamily.regular, marginLeft: 12 }}>{I18n.t('photo')} </Text>
                            </TouchableOpacity>}
                            <TouchableOpacity activeOpacity={1} disabled={this.state.disable} onPress={() => {
                                this.props.onLibrary(), this.setState({ disable: true }), setTimeout(() => {
                                    this.setState({ disable: false })
                                }, 200)
                            }} style={{ width: '70%', height: 80, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ borderColor: '#29a2e1', borderWidth: 2, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginLeft: 15 }}>
                                    <Image style={{ width: 30, height: 30 }} resizeMode='contain' source={require('../../Images/photo-libraryClient.png')} />
                                </View>
                                <Text style={{ color: 'white', fontSize: 20, fontFamily: AppFontFamily.fontFamily.regular, marginLeft: 12 }}>{I18n.t('photoLibrary')} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>

            </Modal>
        )
    }
}
