import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    SafeAreaView,
    Image,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';
import styles from './styles'
import { Header } from './../../Components';
import { AppStyles, AppConstants, AppImages } from './../../Themes';


class ListStream extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={I18n.t('SocialMediaAccounts')}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()}
            />
        }
    };

    constructor(props) {
        super(props);
        this.state = {

        }
        // alert(Dimensions.get('window').width)
    }


    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={[AppStyles.container, { paddingHorizontal: 50, paddingTop: 50, alignItems: 'center' }]}>

                    <ImageBackground resizeMode="contain" source={AppImages.images.facebookBack} style={styles.facebookBack}>
                        <TouchableOpacity style={[styles.facebookBack, { justifyContent: 'space-between' }]}>
                            <View style={styles.imageView}>
                                <Image  source={AppImages.images.facebookLogo} style={styles.logoImage} />
                            </View>
                            <Text style={styles.buttonText}>{I18n.t('Facebook')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <ImageBackground resizeMode="contain" source={AppImages.images.googleBack} style={styles.facebookBack}>
                        <TouchableOpacity style={[styles.facebookBack, { justifyContent: 'space-between' }]}>
                            <View style={styles.imageView}>
                                <Image  source={AppImages.images.googleLogo} style={styles.logoImage} />
                            </View>
                            <Text style={styles.buttonText}>{I18n.t('Google')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>

                    <ImageBackground resizeMode="contain" source={AppImages.images.instagramBack} style={[styles.facebookBack]}>
                        <TouchableOpacity style={[styles.facebookBack, { justifyContent: 'space-between' }]}>
                            <View style={styles.imageView}>
                                <Image  source={AppImages.images.instagramLogo} style={styles.logoImage} />
                            </View>
                            <Text style={styles.buttonText}>{I18n.t('Instagram')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </SafeAreaView>
        )
    }
}

export default ListStream;