import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions, Linking, Platform, TouchableOpacity } from 'react-native';
import Header from '../../Components/Header';
import { fontFamily } from '../../Themes/AppFontFamily';
import { images } from '../../Themes/AppImages';
import I18n from 'react-native-i18n'
export default class PhoneCall extends Component {
    // static navigationOptions = ({ navigation }) => {


    //     return {
    //         header: <Header
    //             headerTitle={I18n.t("Phone Number")}
    //             // maxWidth={Dimensions.get('screen').width * 0.48}
    //             leftImageSource={images.back}
    //             leftbackbtnPress={
    //                 () => navigation.goBack()}
    //         // rightImageSource={AppImages.images.chat}
    //         // rightBackBtnPress={
    //         //     () => thisParam.onChatPress()}

    //         />
    //     }
    // };
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {navigation}=this.props
        return (
            <View style={{ flex: 1 }}>
               {
               Platform.OS=='android'?
               <Header
                headerTitle={I18n.t("Phone Number")}
                // maxWidth={Dimensions.get('screen').width * 0.48}
                leftImageSource={images.back}
                leftbackbtnPress={
                    () => navigation.goBack()}/>
               :
               <View style={{flex:0.13}}>
                    
                <Header
                headerTitle={I18n.t("Phone Number")}
                // maxWidth={Dimensions.get('screen').width * 0.48}
                leftImageSource={images.back}
                leftbackbtnPress={
                    () => navigation.goBack()}/>

                </View>}
                <FlatList
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{}}
                    extraData={this.props}
                    data={this.props.route.params?.phoneNumbers}
                    ListEmptyComponent={() => {
                        return (
                            <View style={{height:Dimensions.get('screen').height*0.7,justifyContent:'center'}}>
                                <Text style={{
                                      color: '#000',
                                      fontFamily:fontFamily.regular,
                                      fontSize: 16,
                                      textAlign: 'center',
                                      marginLeft: 15,
                                }}>{I18n.t('noResult')}</Text>
                            </View>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity 
                            activeOpacity={1}
                            onPress={()=>{
                                Linking.openURL(`tel:${item.phone}`)
                            }}
                            style={{ borderWidth: 1, borderColor: '#29a2e1', borderRadius: 15, marginHorizontal: 5, marginTop: 5 }}>
                                <Text style={{ color: '#29a2e1', textAlign: 'center', alignSelf: 'center', paddingVertical: 10, fontSize: 16, fontFamily: fontFamily.regular }}>
                                    {item.name}
                                </Text>
                                <Text
                                 
                                style={{ color: '#29a2e1', textAlign: 'center', alignSelf: 'center', paddingBottom: 10, fontSize: 16, fontFamily: fontFamily.regular }}>
                                    {item.phone}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        );
    }
}
