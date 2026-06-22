/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { openTokApiKey } from './../../Config';
import { Header, Loader } from './../../Components';
import { AppImages, AppConstants } from './../../Themes';
// import { OTSubscriber, OTSession, OTSubscriberView } from 'opentok-react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { terminalDetailsAction, } from '../../Redux/actions/TerminalDetail';
import I18n from 'react-native-i18n'
let thisParam = null
class SelectedSubscriber extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header:
                <Header
                    headerTitle={JSON.parse(route.params.item.name).name}
                    leftImageSource={require('./../../Images/close.png')} leftbackbtnPress={() => {
                        // thisParam.backPressed()
                        // route.params.onNavigationBack()
                        navigation.goBack("ListStream")
                    }} />
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            streamProperties: {

            },
            subscriberResult: [],
            subscribeVisible: false
        };
        thisParam = this
        this.sessionEventHandlers = {
            streamCreated: event => {
                // this.setState({
                //     loading: true
                // })
                // let response= this.state.subscriberResult
                // response.push(event)
                // this.setState({subscriberResult: response})
                // console.log('OTP SESSSION Stream created!!!!!!', event);
            },

            streamDestroyed: event => {

                this.props.navigation.goBack("ListStream")
                // this.props.navigation.replace("ListStream")
                setTimeout(() => {
                    alert(I18n.t('Stream_stopped_by_user') + JSON.parse(this.props.route.params.item.name).name + ".")
                }, 500);
                this.setState({
                    loading: false
                })


            },
            sessionConnected: event => {
                this.setState({
                    loading: false
                })
            },
            sessionDisconnected: (error) => {
                console.log(`sessionDisconnected Subscriber: ${JSON.stringify(error)}`);

            },
        };


        this.subscriberEventHandlers = {
            connected: (data) => {
                console.log(`subscriberEventHandlers connected: ${JSON.stringify(data)}`);
            },

            error: (error) => {
                this.props.navigation.goBack("ListStream")
                console.log(`subscriberEventHandlers There was an error with the subscriber: ${error}`);
            },
            // videoDisableWarning: () => {
            //     this.props.navigation.goBack()
            //     setTimeout(() => {
            //         alert(AppConstants.constants.Stream_stopped_by_user + JSON.parse(this.props.route.params.item.name).name + ".")
            //     }, 500);
            // }
        };
    }



    backPressed() {
        this.props.terminalDetailsAction(this.props.homeState.selectedItem.id,this.props.terminalDetailState.currentPage + 1, this.props.navigation)
    }

    // componentDidUpdate(nextProps) {
    //     // console.log("nextProps", nextProps)
    //     // console.log(this.props.terminalDetailState, "this.props.terminalDetailState")
    //     // console.log(this.props.terminalDetailState == nextProps)
    //     if (this.props.terminalDetailState !== nextProps.terminalDetailState) {
    //         // this.props.route.params.onNavigationBack()
    //         // this.props.navigation.goBack()
    //     }
    // }

    renderSubscribers = (subscribers) => {
      
        return subscribers.map((res) => (
            res == this.props.route.params.item.streamId ?
                // <TouchableOpacity
                //     onPress={() => this.handleStreamPress(streamId)}
                //     key={res}
                //     style={{ width: 100, height: 100, marginVertical: 15, marginHorizontal: 15 }}
                // >
                //     <Text style={{ backgroundColor: "green", fontSize: 15, marginVertical: 15 }}>{this.props.route.params.item.name}</Text>
                <OTSubscriberView key={res} streamId={res} style={{ flex: 1 }} />

                // </TouchableOpacity>
                :
                null

        ))

    }


    render() {
        const { terminalDetailState } = this.props;
        return (
            <SafeAreaView style={{ flex: 1, }}>
                {this.state.loading == true ?
                    <View style={{ flex: 7, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator loading={this.state.loading} />
                    </View>
                    : null
                }
                <Loader loading={this.props.terminalDetailState.onLoad} />
                {/* <OTSession 
                apiKey={"46440032"}
                    sessionId={terminalDetailState.result.session_id}
                    token={terminalDetailState.result.publisher_token}
                    eventHandlers={this.sessionEventHandlers}
                    ref={this.otSessionRef}
                >

                    <OTSubscriber
                        // eventHandlers={this.subscriberEventHandlers}
                        children={this.renderSubscribers}
                    />

                </OTSession> */}
            </SafeAreaView>

        );
    }
}


function mapStateToProps(state) {
    return {
        homeState: state.HomeState,
        terminalDetailState: state.TerminalDetailState,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ terminalDetailsAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedSubscriber);
