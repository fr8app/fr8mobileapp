import React, { Component } from 'react';
import { Header, Loader,Button } from '../../Components';
import I18n from 'react-native-i18n';
import { AppImages } from '../../Themes'
import styles from './style'
import { Dimensions, Image,TextInput, View, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EditCommentAction } from '../../Redux/actions/timeLineAction';
import { CachedImage } from './../../Components/react-native-cached-image-master'
import { imageBaseUrl } from '../../Config';

let _this = null
let height = Dimensions.get('screen').height
class EditComment extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: (
                <Header
                headerTitle={I18n.t('Edit')}
                leftImageSource={AppImages.images.back}
                leftbackbtnPress={() => navigation.goBack()} />
            )
        };
    };
    constructor(props) {
console.log('props',props);
        super(props)
        this.state = {
           message:props.route.params.item.description
        }
        _this = this
        this.item=props.route.params.item
    }

    renderToolbar = () => {
        return (
            <View style={[styles.inputToolbar,{flexDirection:'row',alignItems:'center'}]}>
   <View style={[styles.userImage,{width:'20%',

paddingHorizontal: 10,
}]}>
                            <CachedImage resizeMode='cover' source={this.item?.user.profile !== '' && this.item?.user.profile !== null ? { uri: imageBaseUrl + this.item?.user.profile } : AppImages.images.user01} style={styles.userImage} />
                        </View>

                <TextInput
                    onFocus={() => {
                        this.setState({ isScrolling: true })
                    }}
                    ref={(InputRef) => this.InputRef = InputRef}
                    style={[styles.textInput]}
                    placeholder={I18n.t('enterYourComment')}
                    keyboardType={"ascii-capable"}
                    returnKeyType={"done"}
                    keyboardType={"default"}
                    value={this.state.message}
                    onChangeText={(message) => { this.setState({ message }) }}
                    multiline={true}
                    maxLength={3000}
                    autoFocus={false}
                />
            </View>

        );
    };
    componentDidMount() {

    }

    render() {


        return (

            <View style={{ flex:1 }}>
                 {this.renderToolbar()}
                 <View style={styles.buttonView}>
                
                   <Button
                   isCanceled={true}
                    onPress={() => {
                       this.props.navigation.goBack()
                    }}
                    Text={I18n.t('Cancel')}
                
                    customStyles={{ container: styles.button }}
                  />
                   <Button
                    onPress={() => {
                        if (this.state.message?.trim().length == 0) {
                            alert(I18n.t('enterTheComment'))
                        }
                        else{

                            this.props.EditCommentAction(this.props.route.params.item,this.state.message?.trim(),this.props.navigation)
                        }
                    }}
                    Text={I18n.t('Update')}
                
                    customStyles={{ container: styles.button }}
                  />
                 </View>
                
                <>

                </>
            </View>
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
        EditCommentAction
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditComment);
