import { ApiConstants, AppConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager, FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: [{ data: [] }],
  resultUTag: [{ data: [] }],
  status: 0,
  navigation: null,
  selectedItem: null,
  currentPage: 1,
  nextPageUrl: null,
  selectedItemUser: "",
  tags: [],
};

function addFriendSuccess(result, updateVal) {
  let updateResult = result;
  for (let i in updateResult[0].data) {
    if (updateResult[0].data[i]._id == updateVal) {
      updateResult[0].data[i].isFriend = 0;
      updateResult[0].data[i].isFriendRequestSent = 1;
    }
  }
  return updateResult;
}

function canelFriendSuccess(result, updateVal) {
  let updateResult = result;
  for (let i in updateResult[0].data) {
    if (updateResult[0].data[i]._id == updateVal) {
      updateResult[0].data[i].isFriend = 0;
      updateResult[0].data[i].isFriendRequestSent = 0;
    }
  }
  return updateResult;
}
function removeFriendSuccess(result, updateVal) {
  let updateResult = result;
  for (let i in updateResult[0]?.data) {
    if (updateResult[0]?.data[i]._id == updateVal?.data) {
      updateResult[0].data[i].isFriend = 0;
      updateResult[0].data[i].isFriendRequestSent = 0;
    }
  }
  return updateResult;
}

function getResultfUser(result, updateVal) {
  let updateResult = result,
    updateUserResult = null;
  for (let i in updateResult[0].data) {
    if (updateResult[0].data[i]._id == updateVal.data) {
      updateResult[0].data[i].isFriend = 0;
      updateResult[0].data[i].isFriendRequestSent = 0;
      updateUserResult = updateResult[0].data[i];
    }
  }
  return updateUserResult;
}

function searchUser(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_SEARCH_USER_LOAD:
      if (action.user_name == "") {
        return { ...state, onLoad: true, result: [{ data: [] }] };
      } else {
        return { ...state, onLoad: true };
      }

    case ApiConstants.constants.API_SEARCH_USER_SUCCESS:
      state.result = [{ data: [] }];
      state.resultUTag = [{ data: [] }];
      let result = action.result.result;
      for (let i in result.data.listUsers) {
        let tagFriends = [...state.tags];
        tagFriends.map((x, index) => {
          if (x._id == action.result.result.data.listUsers[i]._id) {
            action.result.result.data.listUsers[i].isSelected = x.isSelected;
            (x.name = action.result.result.data.listUsers[i].name),
              (x.userName = action.result.result.data.listUsers[i].userName);
          }
        });
        state.result[0].data.push(action.result.result.data.listUsers[i]);
        if (action.result.result.data.listUsers[i].isFriend == 1) {
          state.resultUTag[0].data.push(action.result.result.data.listUsers[i]);
        }
      }

      return {
        ...state,
        onLoad: false,
        result: state.result,
        status: action.status,
        // currentPage: result.data.current_page,
        // nextPageUrl: result.data.next_page_url
      };

    case "ALREADY_SELECTED_FRIENDS":
      console.log("tagFriendss", action);
      let tagFriendss = action.friends;
      tagFriendss.map((x, index) => {
        x.isSelected = true;
      });

      return {
        ...state,
        onLoad: false,
        tags: tagFriendss,
      };

    case ApiConstants.constants.API_SEARCH_USER_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_SEARCH_USER_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      const resetAction = StackActions.replace("FavouriteTerminal2");

      DataManager.clearData();
      FetchApi.setAccessToken("");
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: action.navigation.dispatch(resetAction),
      };

    case ApiConstants.constants.API_SEARCH_USER_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_ADD_FRIEND_SUCCESS:
      let updateResult = addFriendSuccess(
        state.result,
        state.selectedItemUser.friendInfo
          ? state.selectedItemUser.friendInfo.id
          : state.selectedItemUser.id
      );
      if (state.selectedItemUser.friendInfo) {
        state.selectedItemUser.friendInfo.isFriend = 0;
        state.selectedItemUser.friendInfo.isFriendRequestSent = 1;
      } else {
        state.selectedItemUser.isFriend = 0;
        state.selectedItemUser.isFriendRequestSent = 1;
      }
      return { ...state, onLoad: false, result: updateResult };

    case ApiConstants.constants.API_CANCEL_FRIEND_SUCCESS:
      let cancelUpdateResul = canelFriendSuccess(
        state.result,
        state.selectedItemUser.friendInfo
          ? state.selectedItemUser.friendInfo.id
          : state.selectedItemUser.id
      );
      if (state.selectedItemUser.friendInfo) {
        state.selectedItemUser.friendInfo.isFriend = 0;
        state.selectedItemUser.friendInfo.isFriendRequestSent = 0;
      } else {
        state.selectedItemUser.isFriend = 0;
        state.selectedItemUser.isFriendRequestSent = 0;
      }
      return { ...state, onLoad: false, result: cancelUpdateResul };

    case ApiConstants.constants.API_REMOVE_FRIEND_SUCCESS:
      let removeUpdateResult = removeFriendSuccess(
        state?.result,
        action?.result?.result
      );
      let item = getResultfUser(state?.result, action?.result?.result);
      return { ...state, onLoad: false, result: removeUpdateResult };

    case "ApiConstants.constants.API_REMOVE_FRIEND_LOAD":
      return { ...state, selectedItemUser: action.item };

    case "API_TAG_FRIENDS_SELECTED_LOAD":
      let allFriends = [...state.result];
      let tag = [...state.tags];
      allFriends[0].data.map((x, index) => {
        if (action.id == x._id) {
          if (x.isSelected) {
            x.isSelected = !x.isSelected;
            if (x.isSelected == true) {
              tag.push(x);
            } else {
              tag.map((x1, index1) => {
                if (x._id == x1._id) {
                  tag.splice(index1, 1);
                }
              });
            }
          } else {
            x.isSelected = true;
            tag.push(x);
          }
        }
      });
      if (allFriends[0].data.length == 0) {
        tag.map((x, index) => {
          if (action.id == x._id) {
            tag.splice(index, 1);
          }
        });
      }

      return { ...state, onLoad: false, result: allFriends, tags: tag };

    case ApiConstants.constants.API_TIMELINE_ADD_SUCCESS:
      return {
        ...state,
        onLoad: false,
        tags: [],
        result: [{ data: [] }],
        resultUTag: [{ data: [] }],
      };
    default:
      return state;
  }
}
export default searchUser;
