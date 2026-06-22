import { call, put, delay } from 'redux-saga/effects';
import { FetchApi, DataManager } from '../../Components';
import { ApiConstants } from '../../Themes';
import I18n from 'react-native-i18n'
import { Alert } from 'react-native';
import { deleteFile } from '../../Config/aws';
import { StackActions } from '@react-navigation/native';
export function* profileSaga({ payload }) {
    try {
        yield delay(500)
        const result = yield call(FetchApi.userdetail, payload.userId)
        console.log('rs profile', result)
        if (result.status === 1) {
            yield put({ type: ApiConstants.constants.PROFILE_DATA_SUCCESS, payload: result.result.data.userDetails, userId: payload.userId })
        }
        else if (result.status === 3 || result.status === 4) {
            yield put({
                type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
                result: result,
                status: result.status,
                navigation: payload.navigation
            });

            const resetActions= StackActions.replace('FavouriteTerminal2')
            payload.navigation.dispatch(resetActions)

            result.status === 3 ?
                setTimeout(() => { alert(result.result.message) }, 800)
                :
                setTimeout(() => { alert(result.result.message) }, 800)
            // setTimeout(() => {
            //   alert("Session timed out.");
            // }, 800);
        }
        else {
            yield put({ type: ApiConstants.constants.PROFILE_DATA_ERROR, payload: result.result })

            setTimeout(() => {
                if (payload.userId) {
                    if (result.result.data?.is_block == true) {
                        Alert.alert(
                            'Alert',
                            result.result.message,
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        payload.navigation.goBack()
                                    }
                                }
                            ]
                        )
                    }
                    else {
                        alert(result.result.message)
                    }
                }
                else {

                    alert(result.result.message)
                }
            }, 800)


        }
    } catch (e) {
        console.log("::::::::e",e)
        yield put({ type: ApiConstants.constants.PROFILE_DATA_ERROR, payload: e })
        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => { alert(e.message) }, 800)
        }
    }
}
export function* userUploadImageSaga({ payload, oldImageArray }) {
    try {
        yield delay(500)
        console.log('data upload image', payload)
        const result = yield call(FetchApi.userImage, payload);
        if (result.status === 1) {
            console.log('result', result);
            DataManager.getUserDetails().then(async response => {
                if (response) {
                    let parseData = await JSON.parse(response)
                    console.log('parseData', parseData);
                    parseData.data.profile = result.result.data.data.profile
                    DataManager.setUserDetails(parseData)
                }
            });
            yield put({ type: ApiConstants.constants.Add_USER_IMAGE_SUCCESS, payload: payload })
            setTimeout(() => {
                alert(result.result.message)
                deleteFile(oldImageArray)
            }, 800)
        }
        // else if (result.status === 3||result.status === 4) {
        //     yield put({
        //       type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        //       result: result,
        //       status: result.status,
        //       navigation: action.navigation
        //     });
        //     result.status === 3 ?
        //     setTimeout(() => { alert("Session timed out.") }, 800)
        //     :
        //     setTimeout(() => { alert(result.result.message) }, 800)
        //     // setTimeout(() => {
        //     //   alert("Session timed out.");
        //     // }, 800);
        //   }
        else {
            yield put({ type: ApiConstants.constants.Add_USER_IMAGE_ERROR, payload: result })
            setTimeout(() => {
                alert(I18n.t('something_went_wrong'))
                deleteFile([payload])
            }, 800)
        }
    } catch (e) {
        yield put({ type: ApiConstants.constants.Add_USER_IMAGE_ERROR })
        deleteFile([payload])

        if (!e.message) {
            setTimeout(() => {
                alert(I18n.t('please_check_your_internet_connection'))
            }, 800)
        } else {
            setTimeout(() => {
                alert(I18n.t('something_went_wrong'))
            }, 800)
        }

    }
}