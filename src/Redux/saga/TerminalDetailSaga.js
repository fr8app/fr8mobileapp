import { Alert } from 'react-native';
import { put, call, delay } from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';
import I18n from 'react-native-i18n'
import { StackActions } from '@react-navigation/native';
export function* terminalDetailApiSaga(action) {

  try {
    yield delay(500)
    if (action.feed) {
      // console.log('hello', 'hello')
      var result = yield call(FetchApi.feedPost, action)

    } else {
      var result = yield call(FetchApi.terminalDetail, action.id, action.pageValue);
    }

    // console.log('callle',result)
    if (result.status === 1) {
      if (action.feed) {
        yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_SUCCESS, feed: true, result: result, status: result.status, navigation: action.navigation });

      } else {
        yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_SUCCESS, result: result, status: result.status, navigation: action.navigation });

      }
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
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    }

    // else if (result.status === 3) {
    //   yield put({
    //     type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //     result: result,
    //     status: result.status,
    //     navigation: action.navigation
    //   });
    //   setTimeout(() => {
    //     alert("Session timed out.");
    //   }, 800);
    // }
    // else if (result.status === 3 || result.status === 4) {
    //   result.status === 3 ?
    //   setTimeout(() => { alert("Session timed out.") }, 800)
    //   :
    //   setTimeout(() => { alert(result.result.message) }, 800)
    //   yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
    // }
    else {
      yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => {
        // alert(result.result.message) 

        Alert.alert(
          I18n.t("Alert"),
          result.result.message,
          [
            { text: 'Ok', onPress: () => action.navigation.goBack() }
          ]
        )

      }, 800)

    }
  } catch (error) {
    console.log('errorerror', error);
    yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_ERROR, error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* terminalRateApiSaga(action) {

  try {

    var result = yield call(FetchApi.terminalRate, action.id, action.message, action.rates);


    // console.log('callle',result)
    if (result.status === 1) {
      yield put({ type: "API_TERMINAL_RATE_ADD_SUCCESS", result: result, rates: action.rates, navigation: action.navigation });
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
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    }


    else {
      yield put({ type: "API_TERMINAL_RATE_ADD_FAIL" });

      setTimeout(() => {
        // alert(result.result.message) 

        Alert.alert(
          I18n.t("Alert"),
          result.result.message,
          [
            { text: 'Ok' }
          ]
        )

      }, 800)

    }
  } catch (error) {
    yield put({ type: "API_TERMINAL_RATE_ADD_ERROR", error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* timeLinePostByTerminal({index, data,userId, navigation }) {

  try {

    var result = yield call(FetchApi.routeByTerminal, data,userId);


    console.log('callle', result)
    if (result.status === 1) {
      yield put({ type: "API_TIMELINEPOST_BY_TERMINAL_SUCCESS", result: result,index:index, navigation: navigation });
    }
    else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: navigation
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


    else {
      yield put({ type: "API_TIMELINEPOST_BY_TERMINAL_FAIL" });

      setTimeout(() => {
        // alert(result.result.message) 

        // Alert.alert(
        //   I18n.t("Alert"),
        //   result.result.message,
        //   [
        //     { text: 'Ok' }
        //   ]
        // )

      }, 800)

    }
  } catch (error) {
    yield put({ type: "API_TIMELINEPOST_BY_TERMINAL_ERROR", error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* checkinPostByTerminalSaga({index, data, navigation }) {

  try {

    var result = yield call(FetchApi.checkinByTerminal, data);


    console.log('callle', result)
    if (result.status === 1) {
      yield put({ type: "API_CHECKIN_BY_TERMINAL_SUCCESS", result: result,index:index, navigation: navigation });
    }
    else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: navigation
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


    else {
      yield put({ type: "API_CHECKIN_BY_TERMINAL_FAIL" });
      setTimeout(() => {
        Alert.alert(
          I18n.t("Alert"),
          result.result.message,
          [
            { text: 'Ok' }
          ]
        )

      }, 800)

    }
  } catch (error) {
    yield put({ type: "API_CHECKIN_BY_TERMINAL_ERROR", error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* ratingByTerminal({index, data, navigation }) {

  try {

    var result = yield call(FetchApi.ratingList, data);


    console.log('callle', result)
    if (result.status === 1) {
      yield put({ type: "API_RATING_BY_TERMINAL_SUCCESS", result: result,index:index, navigation: navigation });
    }
    else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: navigation
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


    else {
      yield put({ type: "API_RATING_BY_TERMINAL_FAIL" });

      setTimeout(() => {
        // alert(result.result.message) 

        Alert.alert(
          I18n.t("Alert"),
          result.result.message,
          [
            { text: 'Ok' }
          ]
        )

      }, 800)

    }
  } catch (error) {
    yield put({ type: "API_RATING_BY_TERMINAL_ERROR", error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* terminalDetailApiSagaEND(action) {

  try {
    yield delay(500)
    if (action.feed) {
      var result = yield call(FetchApi.feedPosts, action.pageValue);

    } else {
      var result = yield call(FetchApi.terminalDetails, action.id, action.pageValue);
    }
    // const result = yield call(FetchApi.terminalDetails, action.id, action.pageValue);
    // console.log('end ======>',result)
    if (result.status === 1) {
      if (action.feed) {

        yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_SUCCESS_END, result: result, feed: 'feed', status: result.status, navigation: action.navigation });


      } else {
        console.log('end ======>', result)
        yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_SUCCESS_END, result: result, status: result.status, navigation: action.navigation });


      }
      // console.log('end saga 1', result.result.data.post)
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
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    }
    // else if (result.status === 3) {
    //   yield put({
    //     type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //     result: result,
    //     status: result.status,
    //     navigation: action.navigation
    //   });
    //   setTimeout(() => {
    //     alert("Session timed out.");
    //   }, 800);
    // }
    // else if (result.status === 3 || result.status === 4) {
    //   result.status === 3 ?
    //   setTimeout(() => { alert("Session timed out.") }, 800)
    //   :
    //   setTimeout(() => { alert(result.result.message) }, 800)
    //   yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_UNAUTHENTICATED_END, result: result, status: result.status, navigation: action.navigation });
    // }
    else {
      yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_FAIL_END, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_TERMINAL_DETAIL_ERROR_END, error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}

export function* likeDislikeApiSaga(action) {
  try {
    const result = yield call(FetchApi.likeDislike, action.id, action.isLike);
    if (result.status === 1) {
      // console.log('terminal Like callled')
      yield put({ type: ApiConstants.constants.API_LIKE_DISLIKE_SUCCESS, result: result, status: result.status, navigation: action.navigation, likeDislikeType: action.likeDislikeType, index: action.index });
    }
    else if (result.status === 3) {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation
      });
      const resetActions= StackActions.replace('FavouriteTerminal2')
      action.navigation.dispatch(resetActions)
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
    // else if (result.status === 3|| result.status === 4) {
    //   yield put({ type: ApiConstants.constants.API_LIKE_DISLIKE_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
    //   result.status === 3 ?
    //   setTimeout(() => { alert("Session timed out.") }, 800)
    //   :
    //   setTimeout(() => { alert(result.result.message) }, 800)
    // }
    else {
      yield put({ type: ApiConstants.constants.API_LIKE_DISLIKE_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    // console.log(error)
    yield put({ type: ApiConstants.constants.API_LIKE_DISLIKE_ERROR, error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}

export function* followUnfollowTerminalApiSaga(action) {
  try {
    const result = yield call(FetchApi.followUnfollowTerminal, action.terminalId, action.isFollow);
    if (result.status === 1) {
      yield put({ type: ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_SUCCESS, result: result, status: result.status, navigation: action.navigation, index: action.index });
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
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    }
    // else if (result.status === 3) {
    //   yield put({
    //     type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //     result: result,
    //     status: result.status,
    //     navigation: action.navigation
    //   });
    //   setTimeout(() => {
    //     alert("Session timed out.");
    //   }, 800);
    // }
    // else if (result.status === 3 || result.status === 4) {

    //   yield put({ type: ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
    //   result.status === 3 ?
    //   setTimeout(() => { alert("Session timed out.") }, 800)
    //   :
    //   setTimeout(() => { alert(result.result.message) }, 800)
    // }
    else {
      yield put({ type: ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_ERROR, error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}

export function* videoPlayApiSaga(action) {
  try {
    const result = yield call(FetchApi.videoPlay, action.item._id ? action.item._id : action.item.id,);
    // console.log("videoPlayApiSaga", result)
    if (result.status === 1) {
      yield put({ type: ApiConstants.constants.API_VIDEO_PLAY_SUCCESS, result: result, status: result.status, navigation: action.navigation, item: action.item, likeDislikeType: action.likeDislikeType, index: action.index });
    }
    // else if (result.status === 3 || result.status === 4) {

    //   yield put({ type: ApiConstants.constants.API_VIDEO_PLAY_UNAUTHENTICATED, result: result, status: result.status, navigation: action.navigation });
    //   result.status === 3 ?
    //   setTimeout(() => { alert("Session timed out.") }, 800)
    //   :
    //   setTimeout(() => { alert(result.result.message) }, 800)
    // }
    // else if (result.status === 3) {
    //   yield put({
    //     type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //     result: result,
    //     status: result.status,
    //     navigation: action.navigation
    //   });
    //   setTimeout(() => {
    //     alert("Session timed out.");
    //   }, 800);
    // }
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
      // setTimeout(() => {
      //   alert("Session timed out.");
      // }, 800);
    }
    else {
      yield put({ type: ApiConstants.constants.API_VIDEO_PLAY_FAIL, result: result, status: result.status, navigation: action.navigation });
      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (error) {
    yield put({ type: ApiConstants.constants.API_VIDEO_PLAY_ERROR, error: error });
    setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* deleteTerminalPost({ payload }) {
  try {
    yield console.log('hoho')
    const result = yield call(FetchApi.deletePostofUser, payload.item)
    //  console.log(result )
    if (result.status === 1) {
      yield put({ type: ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_SUCCESS, payload: payload.item.id })

    } else {
      yield put({ type: ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_ERROR, payload: payload.item.id })
      setTimeout(() => { alert(I18n.t('something_went_wrong')) }, 800)
    }
  } catch (e) {
    //  console.log(e)
    yield put({ type: ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_ERROR, payload: payload.item.id })
    setTimeout(() => { alert(e.message) }, 800)
  }
}
export function* reportTerminalPost({ payload }) {
  yield console.log('hoho', payload)
  try {
    const result = yield call(FetchApi.reportPost, payload)
    // console.log(result)
    if (result.status === 1) {
      yield put({ type: ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_SUCCESS })
      setTimeout(() => { alert(result.result.message) }, 800)
      // yield payload.navigation.goBack(null)

    } else {
      yield put({ type: ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_ERROR })
      setTimeout(() => { alert(result.result.message) }, 800)
      // yield payload.navigation.goBack(null)
    }
  } catch (e) {
    // console.log(e.message)
    yield put({ type: ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_ERROR })
    setTimeout(() => { alert(I18n.t('something_went_wrong')) }, 800)
  }

}