import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    FlatList,
    Text,
} from 'react-native';
import styles from './styles'
import { LiveStreamRender, Header, } from './../../Components';
import { AppImages } from './../../Themes';
import { imageBaseUrl } from '../../Config';
import I18n from 'react-native-i18n'
class ExploreCities extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    };

    constructor(porps) {
        super(porps);
        this.state = {

        }

    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("focus", () => {
            setTimeout(() => {

                this.liveStreamRef?.renderMount()
            }, 5000);

        });
        this.focusListener = this.props.navigation.addListener("blur", () => {
            this.liveStreamRef?.renderUnMount()

        });

    }

    _renderItem = ({ item, index }) => (

        <LiveStreamRender
            onPress={() => { }}
            ref={(ref) => { this.liveStreamRef = ref }}
            imagePreload={true}
            terminal={item.terminal_name}
            postSource={item.terminal_image_type == 'url' ? item.terminal_url : [imageBaseUrl + item.terminal_logo]}
        // postSource={item.terminal_logo !== null ? { uri: imageBaseUrl + item.terminal_logo } : AppImages.images.videoDummy}
        />
    );




    render() {
        let item = this.props.route.params.item.terminals
        return (
            <>
                <Header
                    headerTitle={this.props.route.params.item.region_name}
                    leftImageSource={AppImages.images.back} leftbackbtnPress={() => this.props.navigation.goBack()} />
                <SafeAreaView style={styles.mainContainer}>

                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        contentContainerStyle={{ paddingTop: 10 }}
                        data={item}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<View style={styles.listEmptyComponentView}><Text style={styles.noValueText}>{I18n.t('terminalNotFound')}</Text></View>}
                    />

                </SafeAreaView>
            </>
        )
    }
}

export default ((ExploreCities));

