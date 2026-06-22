import { put, call } from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';
import I18n from 'react-native-i18n'
import { StackActions } from '@react-navigation/native';
export function* myPostApiSaga(action) {

    try {
        const result = yield call(FetchApi.myPosts,action.id,action.index);
        console.log('resultresultresultresult',result);

        if (result.status === 1) {
            console.log('resultresultresultresult',result);
            yield put({ type: ApiConstants.constants.API_MY_POSTS_SUCCESS,index:action.index, result: result, status: result.status, navigation: action.navigation });
            // setTimeout(() => { alert(result.result.message) }, 800)
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
        // else if (result.status === 3 || result.status === 4) {

        //     yield put({ type: ApiConstants.constants.API_MY_POSTS_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
        //     result.status === 3 ?
        //         setTimeout(() => { alert("Session timed out.") }, 800)
        //         :
        //         setTimeout(() => { alert(result.result.message) }, 800)
        // }
        else {
            yield put({ type: ApiConstants.constants.API_MY_POSTS_FAIL, result: result, status: result.status, navigation: action.navigation });
            // setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (error) {
        yield put({ type: ApiConstants.constants.API_MY_POSTS_ERROR, error: error });
            // setTimeout(() => { alert(error.result) }, 800)
    }
}

export function* deletePostSaga(action) {
    try{
        // console.log('delete Sagag !!!', action)
       const result = yield  call(FetchApi.deletePostofUser, action.payload.item)
    //    console.log(result)
       if(result.status===1 ){
        //    console.log('success')
           yield put({type:ApiConstants.constants.DELETE_POST_SUCCESS, resultmsg: result.result, navigation:action.payload.navigation, id:action.payload.item.id})
            // setTimeout(()=>{alert('Post Deleted')},800)
            if(action.payload.screen){
                if(action.payload.screen==='postDetails'){
                    console.log('inside')
                    // action.payload.navigation.navigate('MyPosts');
                    action.payload.navigation.goBack();
                }
            }
            
            // console.log('success next')
            // // this.props.action.navigation('myPost')
        }else{
            // console.log('result success')
            setTimeout(()=>{alert(I18n.t('something_went_wrong'))},800)
        }

    }catch(e){
        // console.log('erroo',e, e.message)
        setTimeout(()=>{alert(I18n.t('something_went_wrong'))},800)
    }
}
export function* onReachEndPostSaga({payload}){

    try {
        // console.log('called upgrade')
        const result = yield call(FetchApi.onReachEndPost, payload)
        // console.log('bro', result )
        if(result.status===1){
            // console.log('bro', result )
            yield put({type:ApiConstants.constants.ON_REACH_END_POST_SUCCESS, payload: result.result.data})
        }else{
            // console.log('bro', result )
            yield put({type:ApiConstants.constants.ON_REACH_END_POST_ERROR, payload: result})

        }
    }catch(e){
        // console.log('bro', e )
        yield put({type:ApiConstants.constants.ON_REACH_END_POST_ERROR, payload: e})
    }
}