import React, { Component } from 'react';
import {
    SafeAreaView,
    ActivityIndicator,
    View,
    Alert
} from 'react-native';
import styles from './styles'
import { Header, Loader } from '../../Components';
import { AppImages, AppConstants } from '../../Themes';
import { openTokApiKey } from './../../Config';
// import { OTPublisher, OTSession, OT } from 'opentok-react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import KeepAwake from 'react-native-keep-awake';
import I18n from 'react-native-i18n'
let thisParam = null
class Publisher extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header:
                <Header
                    headerTitle={route.params.item ? route.params.item.name : ""}
                    leftImageSource={require('./../../Images/close.png')} leftbackbtnPress={() => thisParam.backPressed()}
                    rightImageSource={require('./../../Images/cameraRotation.png')} rightBackBtnPress={() => thisParam.cameraRotate()}
                    rightImageSource1Height={25}
                    rightImageSource1Width={25}
                />
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            userDetail: this.props.route.params.item,
            loading: true,
            cameraPosition: "front"
        }
        // KeepAwake.activate();
        thisParam = this
        this.otSessionRef = React.createRef();
        this.sessionEventHandlers = {
            streamCreated: event => {

            },

            streamDestroyed: event => {
                this.setState({
                    loading: false
                })
            },
            sessionConnected: event => {
                this.setState({
                    loading: false
                })

                setTimeout(() => {
                    alert(I18n.t('you_are_live_now'))
                }, 800);
            },

            otrnError: (error) => {
                console.log(`otrnError otrnError: ${error}`);
            }, sessionDisconnected: (error) => {
                console.log(`sessionDisconnected otrnError: ${JSON.stringify(error)}`);
             
            },
            sessionReconnected: (error) => {
                console.log(`sessionReconnected otrnError: ${error}`);
            },
            sessionReconnecting: (error) => {
                console.log(`sessionReconnecting otrnError: ${error}`);
            },
            error: (error) => {
                console.log(`There was an error with the subscriber: ${error}`,error);
            },
        };
        this.publisherProperties = {
            publishAudio: true,
            cameraPosition: 'front',
            // name:  {"userDetail": this.props.route.params.item ,"val":"Mohit"}
            name: this.props.route.params.item ? JSON.stringify(this.props.route.params.item) : "Not Available"
        };
        this.publisherEventHandlers = {
            streamCreated: event => {
                console.log('Publisher stream created!', event);

            },
            streamDestroyed: event => {
                console.log('Publisher stream destroyed!', event);
            },
        };
    }

    backPressed() {
        Alert.alert(
            I18n.t('Alert'),
            I18n.t('end_publisher_video'),
            [
                {
                    text: I18n.t('No'),
                },
                {
                    text: I18n.t('Yes'), onPress: () => {
                        // this.props.route.params.onNavigationBack()
                        this.props.navigation.goBack()
                        // "ListStream"
                        setTimeout(() => {
                            alert(I18n.t('end_publisher_video_successfully'))
                        }, 800);
                    }
                },
            ],
            { cancelable: false },
        )
    }

    cameraRotate() {
        if (this.state.cameraPosition == "front") {
            this.setState({ cameraPosition: "back" })
            this.publisherProperties = {
                publishAudio: true,
                cameraPosition: 'back',
                // name:  {"userDetail": this.props.route.params.item ,"val":"Mohit"}
                name: this.props.route.params.item ? JSON.stringify(this.props.route.params.item) : "Not Available"
            };
        }
        else {
            this.setState({ cameraPosition: "front" })
            this.publisherProperties = {
                publishAudio: true,
                cameraPosition: 'front',
                // name:  {"userDetail": this.props.route.params.item ,"val":"Mohit"}
                name: this.props.route.params.item ? JSON.stringify(this.props.route.params.item) : "Not Available"
            };
        }
    }


    render() {
        const { terminalDetailState } = this.props;
        return (
            <SafeAreaView style={[styles.mainContainer]}>
                <KeepAwake />
                {this.state.loading == true ?
                    <View style={{ flex: 7, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator loading={this.state.loading} />
                    </View>
                    : null
                }
                {/* <OTSession 
                    apiKey={'46440032'}
                    // apiKey={openTokApiKey}
                    // sessionId={"1_MX40NjQ0MDAzMn5-MTU4OTE4NjIyNTk3NX4zSVFzd2IyYm01aUdxZy9wdmJvT0tReTh-fg"}
                    sessionId={terminalDetailState.result.session_id}
                    // token={'T1==cGFydG5lcl9pZD00NjQ0MDAzMiZzaWc9Y2YzZWU0YmQyMjhkOGRkNmEwM2U3MTA0NWViZmM4YWEwOTZkYjFiNjpzZXNzaW9uX2lkPTFfTVg0ME5qUTBNREF6TW41LU1UVTRPVEU0TmpJeU5UazNOWDR6U1ZGemQySXlZbTAxYVVkeFp5OXdkbUp2VDB0UmVUaC1mZyZjcmVhdGVfdGltZT0xNTg5MTg2MjQ1Jm5vbmNlPTAuNjkxMzIzMjAxODA4MjczNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg5MjcyNjQ0JmNvbm5lY3Rpb25fZGF0YT1UZXN0aW5nJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9'}
                    token={terminalDetailState.result.publisher_token}
                    eventHandlers={this.sessionEventHandlers}
                    ref={this.otSessionRef} 
                >
                    <OTPublisher
                        properties={this.publisherProperties}
                        eventHandlers={this.publisherEventHandlers}
                        style={{ flex: 1 }}
                    />
                </OTSession> */}
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        terminalDetailState: state.TerminalDetailState,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Publisher);