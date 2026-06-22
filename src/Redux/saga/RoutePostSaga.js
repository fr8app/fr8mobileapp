import { call, put, delay } from 'redux-saga/effects';
import { FetchApi } from '../../Components';
import { ApiConstants } from '../../Themes';
import I18n from 'react-native-i18n'
import { deleteFile } from '../../Config/aws';
import { StackActions } from '@react-navigation/native';

export function* routePostSaga(action) {
  try {
    console.log('yes', action)
    const result = yield call(FetchApi.routePostList, action.page,action.userId)
    console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.API_POST_SUCCESS, result: result, page: action.page })
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
      //  setTimeout(() => {
      //    alert("Session timed out.");
      //  }, 800);
      result.status === 3 ?
        setTimeout(() => { alert(result.result.message) }, 800)
        :
        setTimeout(() => { alert(result.result.message) }, 800)
    }
    else {
      yield put({ type: ApiConstants.constants.API_POST_ERROR })

      // setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.API_POST_FAIL })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* createPostSaga(action) {
  try {
    console.log('yes', action)
    const result = yield call(FetchApi.createRoutePost, action.id, action.distance, action.minute, action.image, action.startTime, action.endTime, action.coordinate)
    console.log('Post create route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.API_ROUTE_POST_CREATE_SUCCESS, result: result, navigation: action.navigation })
      // setTimeout(() => {
      //   alert(result.result.message)
      // }, 800);
    }
    //  else if (result.status === 3) {
    //      yield put({
    //        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //        result: result,
    //        status: result.status,
    //        navigation: action.navigation
    //      });
    //     //  setTimeout(() => {
    //     //    alert("Session timed out.");
    //     //  }, 800);
    //     result.status === 3 ?
    //     setTimeout(() => { alert("Session timed out.") }, 800)
    //     :
    //     setTimeout(() => { alert(result.result.message) }, 800)
    //    }

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
      yield put({ type: ApiConstants.constants.API_ROUTE_POST_CREATE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.API_ROUTE_POST_CREATE_ERROR })
    if (!e.message) {

    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}

export function* routeDeleteSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.routeDelete, action.id)
    console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.API_ROUTE_DELETE_SUCCESS, result: result, navigation: action.navigation })
      setTimeout(() => { alert(result.result.message) }, 200)
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
      yield put({ type: ApiConstants.constants.API_ROUTE_DELETE_ERROR })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.API_ROUTE_DELETE_FAIL })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}

//edit time line route
export function* routeEditSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.routeEdit, action.id, action.start, action.end, action.image, action.distance, action.time, action.terminalId, action.navigation)
    console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.API_ROUTE_EDIT_SUCCESS, result: result, navigation: action.navigation })
      if (action.navigation !== null) {
        setTimeout(() => { alert(result.result.message) }, 1000)
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
      //  setTimeout(() => {
      //    alert("Session timed out.");
      //  }, 800);
    }
    else {
      yield put({ type: ApiConstants.constants.API_ROUTE_EDIT_ERROR })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.API_ROUTE_EDIT_FAIL })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}

//time line route post detail
export function* routePostDetailSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.routeDetail, action.id)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_DETAIL_SUCESS, result: result, navigation: action.navigation })
      //    setTimeout(() => { alert(result.result.message) }, 1000)
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
      yield put({ type: ApiConstants.constants.API_ROUTE_EDIT_ERROR })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.API_ROUTE_EDIT_FAIL })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}

//interchange add
export function* interchangeAddSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.interchangeAdd, action.id, action.privates, action.source)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_SUCESS, result: result, navigation: action.navigation })
      //  setTimeout(() => { alert(result.result.message) }, 300)
    }
    else if (result.status === 3 || result.status === 4) {
      deleteFile(action?.source)
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
      deleteFile(action?.source)
      yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    deleteFile(action?.source)
    yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* interchangeEditSaga(action) {
  try {
    console.log('yes', action)
    const result = yield call(FetchApi.interchangeEdit, action.postId, action.privates, action.source, action.id)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_SUCESS, result: result, navigation: action.navigation, id: action.id })
      //  setTimeout(() => { alert(result.result.message) }, 300)
    }
    else if (result.status === 3 || result.status === 4) {
      deleteFile(action?.source)
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
      deleteFile(action?.source)
      yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    deleteFile(action?.source)
    yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
//interchange delete
export function* interchangeDeleteSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.interchangeDelete, action.id, action.privates, action.postId)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_SUCESS, result: result, navigation: action.navigation, id: action.id })
      setTimeout(() => { alert(result.result.message) }, 300)
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
      yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
//eqipment
export function* equipmentAddSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.equipmentAdd, action.id, action.privates, action.source)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_SUCESS, result: result, navigation: action.navigation })
      //  setTimeout(() => { alert(result.result.message) }, 300)
    }
    else if (result.status === 3 || result.status === 4) {
      deleteFile(action?.source)
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
      deleteFile(action?.source)
      yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    deleteFile(action?.source)
    yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* equipmentEditSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.equipmentEdit, action.postId, action.privates, action.source, action.id)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_SUCESS, result: result, navigation: action.navigation, id: action.id })
      //  setTimeout(() => { alert(result.result.message) }, 300)
    }
    else if (result.status === 3 || result.status === 4) {
      deleteFile(action?.source)
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
      deleteFile(action?.source)
      yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    deleteFile(action?.source)
    yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* equipmentDeleteSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.equipmentDelete, action.id, action.privates, action.postId, action.mediaType)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_SUCESS, result: result, navigation: action.navigation, id: action.id, mediaType: action.mediaType })
      setTimeout(() => { alert(result.result.message) }, 300)
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
      yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
//video
export function* videoAddSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.videoAdd, action.id, action.privates, action.source, action.thumbnail)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_ADD_SUCESS, result: result, navigation: action.navigation })
      //  setTimeout(() => { alert(result.result.message) }, 300)
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
      yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_ADD_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_ADD_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* videoEditSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.videoEdit, action.postId, action.privates, action.source, action.thumbnail, action.id)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_SUCESS, result: result, navigation: action.navigation, id: action.id })
      //  setTimeout(() => { alert(result.result.message) }, 300)
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
      yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* videoDeleteSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.videoDelete, action.id, action.privates, action.postId)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_SUCESS, result: result, navigation: action.navigation, id: action.id })
      setTimeout(() => { alert(result.result.message) }, 300)
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
      yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* routePrivateSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.receiptPrivate, action.postId, action.value)
    //  console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.ROUTE_POST_PRIVATE_SUCESS, result: result, navigation: action.navigation, id: action.id })
      //    setTimeout(() => { alert(result.result.message) }, 1000)
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
      yield put({ type: ApiConstants.constants.ROUTE_POST_PRIVATE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.ROUTE_POST_PRIVATE_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
//user is in terminal
export function* userInTerminalSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.userInTerminal)
    console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: 'API_USER_IS_IN_TERMINAL_SUCESS', result: result })
      //    setTimeout(() => { alert(result.result.message) }, 1000)
    }
    // else if (result.status === 3 || result.status === 4) {
    //   yield put({
    //     type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //     result: result,
    //     status: result.status,
    //     navigation: action.navigation
    //   });
    //   result.status === 3 ?
    //     setTimeout(() => { alert(result.result.message) }, 800)
    //     :
    //     setTimeout(() => { alert(result.result.message) }, 800)
    //   //  setTimeout(() => {
    //   //    alert("Session timed out.");
    //   //  }, 800);
    // }
    else {
      yield put({ type: 'API_USER_IS_IN_TERMINAL_FAIL' })


    }
  } catch (e) {
    yield put({ type: 'API_USER_IS_IN_TERMINAL_ERROR' })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* recentLOcationsSaga(action) {
  try {
    // console.log('yes',action)
    const result = yield call(FetchApi.recentLocations)
    console.log('Post route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: 'API_RECENT_LOCATIONS_SUCCESS', result: result })
      //    setTimeout(() => { alert(result.result.message) }, 1000)
    }
    // else if (result.status === 3 || result.status === 4) {
    //   yield put({
    //     type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
    //     result: result,
    //     status: result.status,
    //     navigation: action.navigation
    //   });
    //   result.status === 3 ?
    //     setTimeout(() => { alert(result.result.message) }, 800)
    //     :
    //     setTimeout(() => { alert(result.result.message) }, 800)
    //   //  setTimeout(() => {
    //   //    alert("Session timed out.");
    //   //  }, 800);
    // }
    else {
      yield put({ type: 'API_RECENT_LOCATIONS_FAIL' })


    }
  } catch (e) {
    yield put({ type: 'API_RECENT_LOCATIONS_ERROR' })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}

export function* manualTimeLineCreateSaga(action) {
  try {
    console.log('yes', action)
    const result = yield call(FetchApi.createManualRoutePost, action.name, action.location, action.category, action.phoneNumber, action.image, action.video, action.zoom
    )
    console.log('Post create route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_SUCESS, result: result, navigation: action.navigation })
      setTimeout(() => { alert(result.result.message) }, 800)
      action.navigation.pop(2)

    }
    else if (result.status === 3 || result.status === 4) {
      deleteFile(action?.image?.concat(action.video))
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
      deleteFile(action?.image?.concat(action.video))
      yield put({ type: ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    deleteFile(action?.image?.concat(action.video))
    yield put({ type: ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}
export function* manualTimeLineEditSaga(action) {
  try {
    console.log('yes', action)
    const result = yield call(FetchApi.editManualRoutePost, action.id, action.name, action.location, action.category, action.phoneNumber,
      action.start, action.end, action.distance, action.totalTime, action.navigation)
    console.log('Post create route data', result)
    if (result.status === 1) {
      console.log('Post route data', result)
      yield put({ type: ApiConstants.constants.API_EDIT_MANUAL_TIMELINE_SUCESS, result: result, navigation: action.navigation })
      setTimeout(() => { alert(result.result.message) }, 800)
      action.navigation.pop(2)

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
      yield put({ type: ApiConstants.constants.API_EDIT_MANUAL_TIMELINE_FAIL })

      setTimeout(() => { alert(result.result.message) }, 800)

    }
  } catch (e) {
    yield put({ type: ApiConstants.constants.API_EDIT_MANUAL_TIMELINE_ERROR })
    if (!e.message) {
      setTimeout(() => {
        alert(I18n.t('please_check_your_internet_connection'))
      }, 800)
    } else {
      setTimeout(() => { alert(e.message) }, 800)
    }
  }
}