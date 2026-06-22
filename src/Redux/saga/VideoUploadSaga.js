import { Alert } from "react-native";
import { put, call } from "redux-saga/effects";
import { FetchApi } from "../../Components";
import { deleteFile } from "../../Config/aws";
import { ApiConstants } from "../../Themes";

export function* videoUploadApiSaga(action) {
  console.log("actiona", action?.isLogin);
  try {
    let result;
    if (!action.thumbnail) {
      result = yield call(
        FetchApi.imagePost,
        action.id,
        action.source,
        "",
        action.description,
        action.screen,
        action.video,
        action.location,
        action.tagUser,
        action.latitude,
        action.longitude,
        action?.userId
      );
    } else {
      result = yield call(
        FetchApi.videoPost,
        action.id,
        action.source,
        action.thumbnail,
        action.description,
        action.screen,
        action.video,
        action.location,
        action.tagUser,
        action.latitude,
        action.longitude,
        action?.userId
      );
    }
    if (result.status === 1) {
      if (action.screen) {
        if (action.screen === "addPost" || action.screen == "global") {
          yield put({
            type: ApiConstants.constants.API_VIDEO_UPLOAD_ERROR,
            screen: "addPost",
            error: "noerror",
          });
          !action?.isLogin &&
            (yield put({
              type: ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS,
              result: result,
              status: result.status,
              navigation: action.navigation,
              postCreated: true,
            }));

          if (action.screen === "addPost") {
            yield action.navigation.pop(2);
          } else {
            yield action.navigation.goBack();
            yield action.navigation.navigate("Feed");
          }
        } else {
          yield put({
            type: ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS,
            result: result,
            status: result.status,
            navigation: action.navigation,
            postCreated: false,
          });
          // yield put({type:ApiConstants.constants.ADD_Count, payload:1})
          yield action.navigation.navigate("TerminalDetails");
        }
      } else {
        yield put({
          type: ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS,
          result: result,
          status: result.status,
          navigation: action.navigation,
          postCreated: false,
        });
        // yield put({type:ApiConstants.constants.ADD_Count, payload:1})
        //
        yield action.navigation.navigate("TerminalDetails");
      }
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS,
        result: true,
        status: result.result.message,
      });
      console.log("!action?.isLogin", result);
      // !action?.isLogin &&
      //   setTimeout(() => {
      //     Alert.alert(
      //       "FR8",
      //       `${result.result.message} Click to add profile.`,
      //       [

      //         {
      //           text: "Cancel",
      //           onPress: () => {},
      //         },
      //         {
      //           text: "OK",
      //           onPress: () => {
      //             action.navigation.navigate("EditProfile", {
      //               addProfile: "Add Profile",
      //             });
      //           },
      //         },
      //       ]
      //     );
      //   }, 800);
    } else if (result.status === 3 || result.status === 4) {
      deleteFile(action.source.concat(action.video));
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      result.status === 3;
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      deleteFile(action?.source?.concat(action?.video));
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log(":::::::::::e", error);
    deleteFile(action?.source?.concat(action?.video));
    yield put({
      type: ApiConstants.constants.API_VIDEO_UPLOAD_ERROR,
      error: error,
    });
    // setTimeout(() => { alert(error.result) }, 800)
  }
}
export function* videoUploadEditApiSaga(action) {
  try {
    if (action.thumbnail === "") {
      var result = yield call(
        FetchApi.imagePostEdit,
        action.id,
        action.source,
        "",
        action.description,
        action.screen,
        action.video,
        action.location,
        action.tagUser,
        action._id,
        action.deletedImagesId,
        action.isVideoDeleted,
        action.latitude,
        action.longitude
      );
    } else {
      var result = yield call(
        FetchApi.videoPostEdit,
        action.id,
        action.source,
        action.thumbnail,
        action.description,
        action.screen,
        action.video,
        action.location,
        action.tagUser,
        action._id,
        action.deletedImagesId,
        action.isVideoDeleted,
        action.latitude,
        action.longitude
      );
    }
    console.log("result ininini", result, action);
    if (result.status === 1) {
      if (action.screen) {
        if (action.screen === "addPost" || action.screen == "global") {
          yield put({
            type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_ERROR,
            screen: "addPost",
            error: "noerror",
          });
          action.navigation.pop(2);
          // setTimeout(() => { alert(result.result.message) }, 800)
        } else {
          console.log(
            "called video terminal-------------------------------------------------"
          );
          yield put({
            type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_SUCCESS,
            result: result,
            status: result.status,
            navigation: action.navigation,
          });
          // yield put({type:ApiConstants.constants.ADD_Count, payload:1})
          // setTimeout(() => { alert(result.result.message) }, 800)
          yield action.navigation.navigate("TerminalDetails");
        }
      } else {
        console.log(
          "called video terminal-------------------------------------------------"
        );
        yield put({
          type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_SUCCESS,
          result: result,
          status: result.status,
          navigation: action.navigation,
        });
        // yield put({type:ApiConstants.constants.ADD_Count, payload:1})
        // setTimeout(() => { alert(result.result.message) }, 800)
        yield action.navigation.navigate("TerminalDetails");
      }
    } else if (result.status === 3 || result.status === 4) {
      deleteFile(action?.source?.concat(action?.video));
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      deleteFile(action?.source?.concat(action?.video));
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    deleteFile(action?.source?.concat(action?.video));
    yield put({
      type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* shareEditApiSaga(action) {
  try {
    var result = yield call(
      FetchApi.editSharePost,
      action._id,
      action.description,
      action.mainDescriptions,
      action.item
    );

    console.log("result ininini", result, action);
    if (result.status === 1) {
      console.log(
        "called video terminal-------------------------------------------------"
      );

      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_ERROR,
        screen: "addPost",
        error: "noerror",
      });
      action.navigation.pop();
      // setTimeout(() => { alert(result.result.message) }, 800)
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
