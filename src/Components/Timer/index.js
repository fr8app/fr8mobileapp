import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import DataManager from '../DataManager';
import moment from 'moment';
export default class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: '00:00:00',      
    };
    this.seconds = 0;
  }

  add = () => {
    this.seconds++;
    this.getTime(this.seconds * 1000);
  };

  getTime = (miliseconds) => {
    let duration1 = moment.duration(miliseconds).seconds();
    let duration2 = moment.duration(miliseconds).minutes();
    let duration3 = moment.duration(miliseconds).hours();
  
    let time =
      (duration3 > 9 ? duration3 : '0' + duration3) +
      ':' +
      (duration2 > 9 ? duration2 : '0' + duration2) +
      ':' +
      (duration1 > 9 ? duration1 : '0' + duration1);
    this.setState({ timer: time });
  };

  getBackgroundTime = async () => {
    let getTime = await DataManager.getCallTime();
    if (getTime != null) {
      let currentTime = Date.now();
      let savedTime = JSON.parse(getTime);
      let diffInMS = currentTime - savedTime + 1000; //miliseconds
     
      let totalMiliSC = diffInMS + this.seconds * 1000;
      this.seconds = Number((totalMiliSC / 1000).toFixed());
      this.getTime(totalMiliSC);
      DataManager.setCallTime(null);
    }
  };

  getTotalTime = () => {
    
    return this.state.timer;
    
  };

  render() {
    return (
      <View style={[this.props.costumStyle,]}>
        <Text
          style={{
            // backgroundColor:'red',
            // width:Dimensions.get('screen').width*0.25,
            // alignItems:'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        >
          {this.state.timer}
        </Text>
        
      </View>
    );
  }
}
