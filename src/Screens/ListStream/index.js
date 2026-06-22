import React, { Component } from 'react';
import {
    View,
    FlatList,
    SafeAreaView,
    Text,
} from 'react-native';
import styles from './styles'
import { Header, LiveStreamRender, DataManager } from './../../Components';
import { AppImages } from './../../Themes';
import { openTokApiKey, imageBaseUrl } from './../../Config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n'

let thisParm = null, updatedValue = []
class Subscriber extends Component {
    static navigationOptions = ({ navigation }) => {
        navigation.state.key = "ListStream"
        return {
            header:
                <Header
                    headerTitle={I18n.t('Live_Streams')}
                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()}
                />
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            userDetail: "",
            selectedSubscriberItem: "",
            subscriberResult: [],
            loading: true,
            publisherView: false,
            subscriberView: false,
            listView: true,
            OTSessionView: true
        }
        this.otSessionRef = React.createRef();
        thisParm = this;
        this.getUserDetail()
        updatedValue = [],
            response = this.state.subscriberResult
        this.sessionEventHandlers = {
            streamCreated: async (event) => {
                await updatedValue.push(event)
                let responseUpdate = this.removeDuplicates(updatedValue, "streamId")
                this.setState({ subscriberResult: responseUpdate })
            },

            streamDestroyed: event => {
                let response = this.state.subscriberResult
                for (let i in response) {
                    if (response[i].streamId == event.streamId) {
                        response.splice(i, 1)
                    }
                }
                this.setState({ subscriberResult: response })
                for (let i in updatedValue) {
                    if (updatedValue[i].streamId == event.streamId) {
                        updatedValue.splice(i, 1)
                    }
                }
            },
            sessionConnected: event => {
                this.setState({
                    loading: false
                })
            },
            error: (error) => {
                this.setState({
                    loading: false
                })
            },
        };

        this.publisherProperties = {
            publishAudio: true,
            cameraPosition: 'front',
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
        this.subscriberEventHandlers = {
            connected: (data) => {
                console.log(`connected: ${JSON.stringify(data)}`);
            },
        };
    }


    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    publisherNavigation() {
        this.props.navigation.navigate("Publisher", { item: this.state.userDetail, onNavigationBack: () => this.sendSignal() })
    }

    sendSignal() {
        setTimeout(() => {
            let session = OT.initSession(openTokApiKey, this.props.terminalDetailState.result.session_id, {})
            OT.connect(openTokApiKey, this.props.terminalDetailState.result.session_id, (error) => {
                if (error) {
                } else {
                }
            });
        }, 1000);
    }
    componentDidMount() {
        const { terminalDetailState } = this.props;
    }
    getUserDetail() {
        DataManager.getUserDetails().then((response) => {
            if (response) {
                this.setState({ userDetail: JSON.parse(response).data })
            }
        })
    }
    renderSubscribers = (subscribers) => {
        return (this.state.selectedSubscriberItem ?
            <OTSubscriberView key={this.state.selectedSubscriberItem.streamId} streamId={JSON.stringify(this.state.selectedSubscriberItem.streamId)} style={{ flex: 1 }} />
            : null
        )
    }


    _renderItem = ({ item, index }) => (
        <LiveStreamRender
            onPress={() => this.props.navigation.navigate("SelectedSubscriber", { item, onNavigationBack: () => this.sendSignal() })}
            fullName={item.name ? JSON.parse(item.name).name + " is streaming now" : "Not Available"}
            userSource={item.name ? JSON.parse(item.name).image ? { uri: imageBaseUrl + JSON.parse(item.name).image } : AppImages.images.user01 : AppImages.images.user01}
        />
    );


    otSessionView = () => {
        const { terminalDetailState } = this.props;
        let sessionID = terminalDetailState.result.session_id
        return (
            <OTSession
                apiKey={'46440032'}
                sessionId={sessionID}
                token={terminalDetailState.result.publisher_token}
                eventHandlers={this.sessionEventHandlers}
                ref={this.otSessionRef}
                signal={
                    {
                        type: "signnl",
                        data: "some random message",
                    }}>

                <View style={{ paddingHorizontal: 20, flex: 1 }}>
                    <FlatList
                        bounces={false}
                        contentContainerStyle={{ paddingTop: 10, }}
                        data={this.state.subscriberResult}
                        extraData={[this.state, this.state.subscriberResult]}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        disableVirtualization={true}
                        ListEmptyComponent={<View style={styles.listEmptyComponentView}><Text style={styles.noValueText}>{I18n.t('Loading_streams')}</Text></View>}
                    />
                </View>
            </OTSession>
        )
    }

    render() {
        const { terminalDetailState } = this.props;
        let sessionID = terminalDetailState.result.session_id
        return (
            <SafeAreaView style={{ flex: 1, }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Subscriber);

