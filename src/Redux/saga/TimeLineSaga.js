import { call, put, delay } from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';
import I18n from 'react-native-i18n';
import { Alert } from 'react-native';
import { StackActions } from '@react-navigation/native';

export function* timeLineGetSaga(action) {
    try {
        const result = yield call(FetchApi.myTimeLine, action.page)
        console.log('timeLineGetSaga', result)
        if (result.status === 1) {
            //  console.log('Post route data', result)
            yield put({ type: ApiConstants.constants.API_TIMELINE_GET_SUCCESS, result: result, page: action.page })
        }
        else if (result.status === 3 || result.status === 4) {
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
            //  setTimeout(() => {
            //    alert("Session timed out.");
            //  }, 800);
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_GET_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_GET_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}

export function* timeLineAddSaga(action) {
    try {
        const result = yield call(FetchApi.addTimeLine, action.id, action.message, action.friends, action.location,action.latitude,action.longitude,action.userId)
        console.log('saga responce', result)
        if (result.status === 1) {
            //  console.log('Post route data', result)
            yield put({ type: ApiConstants.constants.API_TIMELINE_ADD_SUCCESS, result: result, page: action.page, navigation: action.navigation.popToTop() })
            //  setTimeout(() => { 
            //      alert(result.result.message)
            //     // Alert.alert(
            //     //  'Alert',
            //     //  result.result.message,
            //     //  [
            //     //      {text:'OK',onPress:()=>{ }}
            //     //  ])
            //      }, 200)
            yield action.navigation.navigate('Feed')
        }
        else if (result.status === 3 || result.status === 4) {
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
            //  setTimeout(() => {
            //    alert("Session timed out.");
            //  }, 800);
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_ADD_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_ADD_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* timeLinePostLike(action) {
    try {
        const result = yield call(FetchApi.timeLineLike, action.id, action.value,action.likeType)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_LIKE_SUCCESS, result: result, navigation: action.navigation, id: action.id, isLike: action.isLike })

        }
        else if (result.status === 3 || result.status === 4) {
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
            //  setTimeout(() => {
            //    alert("Session timed out.");
            //  }, 800);
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_LIKE_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        console.log('error',e);
        yield put({ type: ApiConstants.constants.API_TIMELINE_LIKE_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* timeLinePostComment(action) {
    try {
        const result = yield call(FetchApi.timeLineComment, action.id, action.message,action.commentId)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_SUCCESS, result: result,
                commentId:action.commentId,
                navigation: action.navigation, id: action.id })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_ERROR })

            // setTimeout(() => { alert(result.result.message) }, 800)
            if(result?.result?.data?.is_deleted==true){
                setTimeout(() => {
                 Alert.alert(
                     'Alert',
                     result.result.message,
                     [
                         {
                          text:'OK',onPress:()=>{action.navigation.goBack()}
                         }
                     ]
                 )
                }, 800);
             }
             else{
                 setTimeout(() => { alert(result.result.message) }, 800)
 
             }

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}

//comment like
export function* timeLinePostCommentLike(action) {
    console.log('action.id, action.isLike,action.types',action.id, action.isLike,action.types);

    try {
        const result = yield call(FetchApi.timeLineCommentLike,action.postId, action.id, action.isLike,action.types)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_SUCCESS,
                reactionType:action.types,
                result: result,
                commentId:action.commentId,
                navigation: action.navigation, id: action.id })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* deleteCommentSaga(action) {
    try {
        const result = yield call(FetchApi.timeLineCommentDelete, action.id)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_SUCCESS, 
                result: result,
                 navigation: action.navigation,
                  id: action.id,
                   index: action.index,
                    postId: action.postId,
                    commentId:action.commentId
                })
            setTimeout(() => { alert(result.result.message) }, 800)
        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* editCommentSaga(action) {
    try {
        const result = yield call(FetchApi.timeLineCommentEdit, action.item,action.message)
        console.log('Edit comment saga responce', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_EDIT_SUCCESS, 
                result: result,
                 navigation: action.navigation.goBack(),
                  item:action.item,
                   
                })
            setTimeout(() => { alert(result.result.message) }, 800)
        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_EDIT_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_COMMENT_EDIT_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* timeLinePostShare(action) {
    try {
        const result = yield call(FetchApi.timeLineShare,action.message, action.id)
        console.log('saga responce', result)
        if (result.status === 1) {
            action.navigation.goBack()

            yield put({ type: ApiConstants.constants.API_TIMELINE_SHARE_SUCCESS, result: result, id: action.id })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_SHARE_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_SHARE_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}

//shared user list saga
export function* timeLinePostShareList(action) {
    try {
        const result = yield call(FetchApi.timeLineShareList, action.item._id)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_SHARE_LIST_SUCCESS, result: result, navigation: action.navigation, id: action.id })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_SHARE_LIST_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_SHARE_LIST_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
//liked user list saga
export function* timeLinePostLikeList(action) {
    try {
        const result = yield call(FetchApi.timeLineLikeList, action.item._id,action.types,action.category)
        console.log('saga responce like list', result)
        if (result.status === 1) {

            yield put({ type: ApiConstants.constants.API_TIMELINE_LIKE_LIST_SUCCESS, result: result, navigation: action.navigation, id: action.id })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_LIKE_LIST_ERROR })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_LIKE_LIST_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* timeLinePostDetail(action) {
    try {
        const result = yield call(FetchApi.timeLinePostDetail, action.id,action.commentId)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({
                type: ApiConstants.constants.API_TIMELINE_POST_DETAIL_SUCCESS,
                result: result.result.data.details, navigation: action.navigation
            })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: ApiConstants.constants.API_TIMELINE_POST_DETAIL_ERROR })

            if(result?.result?.data?.is_deleted==true){
               setTimeout(() => {
                Alert.alert(
                    'Alert',
                    result.result.message,
                    [
                        {
                         text:'OK',onPress:()=>{action.navigation.goBack()}
                        }
                    ]
                )
               }, 800);
            }
            else{
                setTimeout(() => { alert(result.result.message) }, 800)

            }

        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.API_TIMELINE_POST_DETAIL_FAIL })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* deleteTimeLineSaga(action) {
    try {
        const result = yield call(FetchApi.timeLinePostDelete, action.id)
        console.log('saga responce', result)
        if (result.status === 1) {

            yield put({ type: 'API_TIMELINE_POST_DELETE_SUCCESS', navigation: action.navigation.goBack() })

        }
        else if (result.status === 3 || result.status === 4) {
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
        }
        else {
            yield put({ type: 'API_TIMELINE_POST_DELETE_FAIL' })

            setTimeout(() => { alert(result.result.message) }, 800)

        }
    } catch (e) {
        yield put({ type: 'API_TIMELINE_POST_DELETE_ERROR' })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}