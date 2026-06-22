import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './style'
import Entypo from 'react-native-vector-icons/Entypo'
import { imageBaseUrl } from '../../Config';
import { Dimensions } from 'react-native';

export default class ManualHorizontalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pause: false
        };
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {

                }}
                style={[styles.imagesTouchable2, { marginLeft: index > 0 ? 10 : 0 }]}
            >
                {item.is_image ?
                    <Image
                        resizeMode={'cover'}
                        style={[styles.imagesStyle2, { borderWidth: 0.5, borderColor: 'gray', marginBottom: 10 }]}
                        source={{ uri: imageBaseUrl + item.url }}
                    />
                    :
                    <View style={styles.imagesStyle2}>
                        <Image
                            resizeMode={'cover'}
                            style={[styles.imagesStyle2, { borderWidth: 0.5, borderColor: 'gray', marginBottom: 10 }]}
                            source={{ uri: imageBaseUrl + item?.thumbnail }}
                        />
                        {this.props.play(item)}
                    </View>
                }
                {<TouchableOpacity onPress={() => this.props.deletePostCall(index, item)} activeOpacity={0.7} style={[styles.crossButton, { right: 1, top: 1 }]}>
                    <Entypo color={'#fff'} name="cross" size={24} />
                </TouchableOpacity>}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, borderBottomWidth: 0.25, borderBottomColor: 'silver', paddingBottom: 20, width: Dimensions.get('screen').width }}>
                <FlatList
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 10, paddingTop: 10, paddingLeft: 20, }}
                    horizontal
                    data={this.props.media}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}
