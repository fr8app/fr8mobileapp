import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 20,
    flexDirection: 'row'
  },
  startPauseButton: {
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'silver',
    height: 80,
    width: 80,
    borderRadius: 40
  },
  stopButton: {
    alignItems: 'center',
    marginLeft: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'silver',
    height: 60,
    width: 60,
    borderRadius: 30
  },
  image:{
      height:100,
      width:100
  }

})

