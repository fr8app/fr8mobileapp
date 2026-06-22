import {call, put,delay} from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';
import I18n from 'react-native-i18n'
import { StackActions } from '@react-navigation/native';
export function* notifySaga (action){
    try {
        yield delay(500)
        const result = yield call(FetchApi.fetchNotifictaion,action.page);
        console.log('response of noti',result)
        if(result.status===1){
            yield put({type:ApiConstants.constants.NOTIFY_NOTIFICATION_SUCCESS, payload:result,page:action.page})
        }

        else if (result.status === 3||result.status === 4) {
            yield put({
              type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
              result: result,
              status: result.status,
              navigation: action.navigation
            });
            const resetActions= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetActions)
            result.status === 3 ?
            setTimeout(() => { alert(result.result.message) }, 800)
            :
            setTimeout(() => { alert(result.result.message) }, 800)
            // setTimeout(() => {
            //   alert("Session timed out.");
            // }, 800);
          }
        
        else{
            yield put({type:ApiConstants.constants.NOTIFY_NOTIFICATION_ERROR, error:result.result.message})
            setTimeout(() => { alert(result.result.message) }, 800)
        }
    }catch(e){
        yield put({type:ApiConstants.constants.NOTIFY_NOTIFICATION_ERROR, error:e.message})
        if(!e.message){
            setTimeout(()=>{
                alert(I18n.t('please_check_your_internet_connection'))
            },800)
        }else{
        setTimeout(() => { alert(e.message) }, 800)
       }
        
    }
}
export function* notifyReadSaga (action){
    try {
        yield delay(500)
        const result = yield call(FetchApi.readNotifictaion,action.id);
        if(result.status===1){
            yield put({type:ApiConstants.constants.API_NOTIFICATION_READ_SUCCESS, payload:result,index:action.index})
        }

        else if (result.status === 3||result.status === 4) {
            yield put({
              type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
              result: result,
              status: result.status,
              navigation: action.navigation
            });
            const resetActions= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetActions)
            result.status === 3 ?
            setTimeout(() => { alert(result.result.message) }, 800)
            :
            setTimeout(() => { alert(result.result.message) }, 800)
            // setTimeout(() => {
            //   alert("Session timed out.");
            // }, 800);
          }
        
        else{
            yield put({type:ApiConstants.constants.API_NOTIFICATION_READ_FAIL, error:result.result.message})
            // setTimeout(() => { alert(result.result.message) }, 800)
        }
    }catch(e){
        yield put({type:ApiConstants.constants.API_NOTIFICATION_READ_ERROR, error:e.message})
        if(!e.message){
            setTimeout(()=>{
                alert(I18n.t('please_check_your_internet_connection'))
            },800)
        }else{
        setTimeout(() => { alert(e.message) }, 800)
       }
        
    }
}
export function* notifyDeleteSaga (action){
    try {
        yield delay(500)
        const result = yield call(FetchApi.deleteNotifictaion,action.id);
        if(result.status===1){
            yield put({type:ApiConstants.constants.API_NOTIFICATION_DELETE_SUCCESS, payload:result,index:action.index})
        }

        else if (result.status === 3||result.status === 4) {
            yield put({
              type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
              result: result,
              status: result.status,
              navigation: action.navigation
            });
            const resetActions= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetActions)
            result.status === 3 ?
            setTimeout(() => { alert(result.result.message) }, 800)
            :
            setTimeout(() => { alert(result.result.message) }, 800)
            // setTimeout(() => {
            //   alert("Session timed out.");
            // }, 800);
          }
        
        else{
            yield put({type:ApiConstants.constants.API_NOTIFICATION_DELETE_FAIL, error:result.result.message})
            setTimeout(() => { alert(result.result.message) }, 800)
        }
    }catch(e){
        yield put({type:ApiConstants.constants.API_NOTIFICATION_DELETE_ERROR, error:e.message})
        if(!e.message){
            setTimeout(()=>{
                alert(I18n.t('please_check_your_internet_connection'))
            },800)
        }else{
        setTimeout(() => { alert(e.message) }, 800)
       }
        
    }
}