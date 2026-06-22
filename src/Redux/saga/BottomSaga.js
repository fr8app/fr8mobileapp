import { ApiConstants } from '../../Themes';
import { put, call } from 'redux-saga/effects';
import { FetchApi } from '../../Components';

export function* feedPostSaga ({payload}){
    // console.log('feedPostSaag',payload)
    try{
        // const result = yield call(FetchApi, payload)
        // if(result.status ==1){
        //     yield put({type: ApiConstants.constants.FEED_POST_SUCCESS, payload: result})
        // }else{
        //     yield put({type:ApiConstants.constants.FEED_POST_ERROR, result:result})
        //     yield setTimeout(() => {
        //         alert(result.message)
        //     }, 800);
        // }

    }catch(e){
        // yield put({type:ApiConstants.constants.FEED_POST_ERROR, result:result})
        // yield setTimeout(() => {
        //     alert(result.message)
        // }, 800);
    }
}
export function* addPostBottomSaga ({payload}){
    // console.log('payload addpostBottomSaga',payload)
    try{
        // const result = yield call(FetchApi, payload)
        // if(result.status ==1){
        //     yield put({type: ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_SUCCESS, payload: result})
        // }else{
        //     yield put({type:ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_ERROR, result:result})
        //     yield setTimeout(() => {
        //         alert(result.message)
        //     }, 800);
        // }

    }catch(e){
        // yield put({type:ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_ERROR, result:result})
        // yield setTimeout(() => {
        //     alert(result.message)
        // }, 800);
    }
}











