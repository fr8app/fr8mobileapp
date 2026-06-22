import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

import { Header, LiveStreamRender, UserPosts, Loader, Pulse, DataManager, Button } from './../../Components';
import { AppStyles, AppImages, DateFormat, AppColor, Dimensions } from './../../Themes';

import  Icon  from 'react-native-vector-icons/dist/FontAwesome';
import { connect } from 'react-redux';
import { terminalPostReportAction } from '../../Redux/actions/TerminalDetail'

class ReportPost extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: <Header
                headerTitle={'Report Post '}
                leftImageSource={AppImages.images.back} leftbackbtnPress={() => navigation.goBack()} />
        }
    };
    constructor(props){
        super(props);
        this.state = {
            postData: this.props.route.params,
            message: null,
        }
    }
    componentDidMount(){
        // console.log(this.props.route.params)
    }
    render(){
        return (
            <View>
                <TextInput
                        style={{ width:'95%',height:300, padding:20,marginTop:25, borderColor:'#c2c2c2', borderWidth:2,marginLeft:10, borderRadius:10}}
                        placeholder={"Enter your message..."}
                        

                        keyboardType={"ascii-capable"}
                        returnKeyType={"done"}
                        keyboardType={"default"}
                        value={this.state.message}
                        onChangeText={(message) => this.setState({ message })}
                        multiline={true}
                    /> 
                    <View style={{margin:20}}>
                    <Button Text='Report' onPress={()=>{
                        if(!this.state.message||this.state.message.length<20){
                            alert('Please Enter Message Properly!')
                        }else{
                            this.props.terminalPostReportAction({post_id: this.state.postData._id, description:this.state.message,navigation:this.props.navigation})
                        }
                        // this.props.navigation.goBack(null)
                        
                        }}></Button> 
                    </View>
                   
            </View>
        )
    }
}
export default connect(null, {terminalPostReportAction})(ReportPost) ;