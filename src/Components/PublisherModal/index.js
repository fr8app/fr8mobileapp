import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import {  AppImages } from '../../Themes';
// import { OTPublisher, OTSession } from 'opentok-react-native'

export default class ModalView extends Component {

    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        return (

            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.modalVisible}
            >
                <View style={{ flex: 1 }}>

                    {/* <OTSession apiKey={this.props.apiKey}
                        sessionId={this.props.sessionId}
                        token={this.props.token}
                        eventHandlers={this.props.eventHandlers}
                    >
                        <OTPublisher
                            properties={this.props.properties}
                            eventHandlers={this.props.eventHandlersPub}
                            style={{ flex: 1 }}
                        />
                    </OTSession> */}
                    
                </View>
                <TouchableOpacity style={{ top: 50, right: 20, height: 100, width: 100, borderRadius: 10, backgroundColor: "red" }} onPress={this.props.onPressCross}>
                        <Image resizeMode="stretch" style={{ width: 18, height: 18 }} source={AppImages.images.back} />
                    </TouchableOpacity>
                
            </Modal>

        )
    }
}

