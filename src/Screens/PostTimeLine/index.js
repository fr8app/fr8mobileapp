import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { Header, LiveStreamRender, UserPosts, Loader, Pulse, DataManager } from './../../Components';
import { AppStyles, AppImages, DateFormat, AppColor, Dimensions } from './../../Themes';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { videoUploadAction } from '../../Redux/actions/TerminalDetail';
import { connect } from 'react-redux';
import deviceInfo from 'react-native-device-info';
class VideoPreview extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={'Community'}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }
    componentDidMount() {
        // console.log('video preview!!!', this.props.navigation.state)
    }
    render() {
        return (
            <KeyboardAvoidingView
                behavior='padding'

                style={{ flex: 1 }}
            >
                {/* <Loader loading={this.props.videoUploadState.onLoad}/>             */}
                <ScrollView

                    style={{ backgroundColor: 'black', height: Dimensions.deviceHeight }}>
                    <View style={{ flex: 1, }}>
                        <View style={{ width: Dimensions.deviceWidth, height: Dimensions.deviceHeight - 250, justifyContent: 'center' }}>

                            <Image
                                style={{ width: Dimensions.deviceWidth, height: deviceInfo.hasNotch() ? 650 : 600 }}
                                source={this.props.route.params.item.image}
                                resizeMode='contain'
                            ></Image>
                        </View>


                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', margin: 10, marginTop: deviceInfo.hasNotch() ? 50 : 110 }}>
                            <TextInput
                                style={{ width: '80%', minHeight: 48, maxHeight: 70, padding: 10, marginTop: 5, backgroundColor: 'white', borderRadius: 10, paddingTop: 10, paddingLeft: 20 }}
                                placeholder={"Enter your message..."}
                                keyboardType="ascii-capable"
                                // keyboardType="ascii-capable"
                                returnKeyType={"done"}
                                // keyboardType={"default"}
                                // value={this.state.message}
                                onChangeText={(message) => this.setState({ message })}
                                multiline={true}
                            />
                            <TouchableOpacity onPress={() => {
                                // this.props.navigation.goBack(null)
                                // console.log(this.state.message.length)

                                if (this.state.message.length < 10) {
                                    alert('Please enter description more then 10 characters .')
                                } else {

                                    const terminalId = this.props.route.params.terminalResult.id
                                    const thumbNail = this.props.route.params.thumbnail
                                    const source = { uri: this.props.route.params.response.uri };
                                    const { screen } = this.props.route.params

                                    this.props.videoUploadAction(terminalId, source, '', this.state.message, this.props.navigation, screen)
                                    this.setState({ message: '' })

                                }
                            }}>
                                <View style={{ backgroundColor: '#29a2e1', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', }}>
                                    {/* <Icon  name= 'arrow-right' size={20} color="#ffff"></Icon> */}
                                    <Image resizeMode="cover" style={{ width: 25, height: 25 }} source={require('../../Images/SendClient.png')} />
                                </View>
                            </TouchableOpacity>


                        </View>
                    </View>

                </ScrollView>

            </KeyboardAvoidingView>
        )



    }


}
function mapStateToProps(state) {
    return {
        videoUploadState: state.VideoUploadState,
    }
}
export default connect(mapStateToProps, { videoUploadAction })(VideoPreview);