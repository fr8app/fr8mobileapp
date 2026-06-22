import React, { Component } from 'react';
import {SafeAreaView,WebView} from 'react-native';
import styles from './styles'
import {  Header, Loader } from './../../Components';
import {   AppImages } from './../../Themes';
import I18n from 'react-native-i18n'
class FAQTermsPrivacy extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={route.params.key == "faq" ? I18n.t('FAQs') :
                    route.params.key == "termsConditions" ? I18n.t('Terms_And_Conditions') : I18n.t('Privacy_Policy')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    _onLoadEnd() {
        this.setState({ loading: false })
    }
    // Method for WebView loads start
    onLoadStart() {setState({ loading: true })
    }

    render() {
       let pdf = this.props.route.params.pdf
        return (
            <SafeAreaView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <WebView
                    source={pdf}
                    style={{ flex: 1 }}
                    onLoadStart={this.onLoadStart.bind(this)}
                    onLoadEnd={this._onLoadEnd.bind(this)}
                />
            </SafeAreaView>
        )
    }
}

export default FAQTermsPrivacy;