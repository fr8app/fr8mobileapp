import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
} from 'react-native';
import styles from './styles'
import { Header, } from './../../Components';
import { AppStyles, AppImages } from './../../Themes';
import ImagePicker from 'react-native-image-picker';

class ListStream extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={I18n.t('CreatePost')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()}
            />
        }
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    launchCamera() {
        const options = {
            presentationStyle: 'overFullScreen',
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: "video"
        };
        return (
            ImagePicker.launchCamera(options, (response) => {
            })
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={[AppStyles.container, { paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }]}>
                    {this.launchCamera()}
                </View>
            </SafeAreaView>
        )
    }
}

export default ListStream;