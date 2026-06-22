import React, { Component } from 'react';
import { Header, Loader, Button, DataManager } from '../../Components';
import I18n from 'react-native-i18n';
import { AppImages, AppFontFamily } from '../../Themes'
import styles from './style'
import { Dimensions, Image, TextInput, View, Platform, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { timeLineShare } from '../../Redux/actions/timeLineAction';
import { CachedImage } from '../../Components/react-native-cached-image-master'
import { imageBaseUrl } from '../../Config';
import FBCollage from '../../../libs/react-native-fb-collage';
import Hyperlink from 'react-native-hyperlink'
import {ShareEditAction}from '../../Redux/actions/TerminalDetail';
import { AFLogEvent } from '../../Config/aws';


let _this = null
let height = Dimensions.get('screen').height
class SharePostEdit extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                null
            )
        };
    };
    constructor(props) {
        console.log('props', props);
        super(props)
        this.state = {
            userDetail: null,
            message: props.route.params.item.share.description?props.route.params.item.share.description:''
        }
        console.log('props.route.params', props.route.params);
        _this = this
        this.id = props.route.params.id
        this.item = props.route.params.item
        this.mediaImages = props.route.params.userImages
    }

    shareClick = () => {
        this.props.ShareEditAction(this.state.message?.trim(), this.props.navigation,this.props.route.params.item._id,this.item.description,this.props.route.params.item)
        // this.props.timeLineShare(this.id, this.state.message.trim(), this.props.navigation)

    }
    renderToolbar = () => {
        return (
            <View style={[styles.textInputView]}>
                <TextInput

                    selectionColor='#29a2e1'
                    style={styles.input}
                    value={this.state.message}
                    placeholder={I18n.t('whatsOnMind')}
                    keyboardType="ascii-capable"
                    returnKeyType={"default"}
                    onChangeText={(message) => {

                        this.setState({ message })
                    }}
                    multiline={true}
                    maxLength={300}
                />
            </View>
        );
    };
    componentDidMount() {
        AFLogEvent("SharePostEdit", { screen: 'SharePost Edit'})

        DataManager.getUserDetails().then(async (response) => {
            if (response) {
                let parseData = await JSON.parse(response);
                this.setState({ userDetail: parseData.data });
            }
        });
    }

    render() {


        return (
            <>
                <Loader loading={this.props.timeLine.onLoad} />
                <ScrollView style={{backgroundColor:'white'}} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

                    <Header
                        rightDisable={this.props.timeLine.onLoad}
                        rightBackBtnPress={() => {
                            this.shareClick()
                        }}
                        rightStyle={{ color: '#fff', width: 80 }}
                        rightHeaderText={I18n.t('Update')}
                        headerTitle={I18n.t('Share')}
                        leftImageSource={AppImages.images.back}
                        leftbackbtnPress={() => this.props.navigation.goBack()} />
                    <View style={[styles.userView]}>
                        <View style={{ borderRadius: 45 / 2, height: 45, width: 45 }}>
                            <CachedImage
                                resizeMode="cover"
                                source={
                                    this.state.userDetail ?
                                        this.state.userDetail?.profile !== "" &&
                                            this.state.userDetail?.profile !== null
                                            ? { uri: imageBaseUrl + this.state.userDetail.profile }
                                            : AppImages.images.user01
                                        : AppImages.images.user01
                                }
                                style={styles.userImage}
                            />
                        </View>
                        <View style={{ justifyContent: "center", alignItems: 'center', width: '90%', paddingTop: 2 }}>
                            <Text
                                numberOfLines={5}
                                style={[
                                    styles.userPostsText,
                                    {

                                        textAlign: "left",
                                        marginLeft: 15,
                                        fontWeight: "bold",
                                        lineHeight: 18,
                                        width: '95%'
                                    },
                                ]}
                            >
                                {this.state.userDetail?.userName + ' '}
                            </Text>
                        </View>
                    </View>

                    {this.renderToolbar()}

                    <>

                    </>



                    <TouchableOpacity activeOpacity={1} style={[styles.mainContainer, {
                        backgroundColor: 'rgb(240,240,240)',
                        width: '95%',
                        alignSelf: 'center',
                    }]}

                    >
                        <View style={{ backgroundColor: 'rgb(240,240,240)', overflow: 'hidden', }}>



                            <View style={styles.userView}>
                                <CachedImage source={this.item?.user.profile ? { uri: imageBaseUrl + this.item?.user?.profile } : AppImages.images.user01} resizeMode='cover' style={styles.userImage} />
                                <Text numberOfLines={2} style={[styles.userPostsText, {
                                    fontFamily: AppFontFamily.fontFamily.bold,
                                    alignSelf: 'center', textAlign: "left", flex: 1, marginLeft: 15
                                }]}>{this.item?.user?.userName}</Text>

                            </View>


                            <View style={{ width: '100%', alignSelf: 'center', backgroundColor: 'rgb(240,240,240)', paddingHorizontal: '3%', marginBottom: 10 }}>
                                {/* <Text numberOfLines={4} style={[styles.userPostsText, { fontSize: 14, textAlign: "left", flex: 1, marginLeft: 0, }]}>{this.props.discription}</Text> */}
                                {this?.item?.description ? <Hyperlink
                                    onPress={(url, text) => Linking.openURL(url)}

                                    linkStyle={{ color: '#2980b9', fontSize: 18 }}>
                                    <Text
                                        numberOfLines={3} style={[styles.userPostsText, { fontSize: 14, textAlign: "left", marginLeft: 0, }]}>
                                        {this.item.description}
                                    </Text>
                                </Hyperlink> : null}

                                {this?.mediaImages?.length > 0 && <View style={{ aspectRatio: 1 }}>


                                    <FBCollage
                                        spacing={4}
                                        arrayLength={this?.mediaImages?.length}
                                        // borderRadius={10}
                                        style={{ width: '100%', height: '100%' }}
                                        images={
                                            this?.mediaImages
                                        }

                                    />
                                </View>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </>
        );
    }
};

function mapStateToProps(state) {
    return {
        timeLine: state.timeLine,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        timeLineShare,
        ShareEditAction
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SharePostEdit);
