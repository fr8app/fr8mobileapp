import { MyFriendsModal, ContactsModal } from "./../../Components";
import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager,FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";
const initialState = {
  onLoad: false,
  error: null,
  result: [],
  localContacts: [],
  status: 0,
  navigation: null,
  selectedItem: null,
};

function removeFriendSuccess(result, updateVal) {
  let updateResult = result;
  for (let i in updateResult[0]?.data) {
    if (updateResult[0]?.data[i].id == updateVal) {
      updateResult[0]?.data.splice(i, 1);
    }
  }
  return updateResult;
}
function MyFriends(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_MY_FRIENDS_LOAD:
      return { ...state, onLoad: true, localContacts: action.allContacts };

    case ApiConstants.constants.API_MY_FRIENDS_SUCCESS:
      let resultList = MyFriendsModal.getFriendsSection(
        { friends: action.result.result.data }
      );
      state.result = resultList;
     
      return {
        ...state,
        onLoad: false,

        status: action.status,
      };

    case ApiConstants.constants.API_MY_FRIENDS_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_MY_FRIENDS_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })],
      // });
      // const resetAction= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        // navigation: action.navigation.dispatch(resetAction),
      };

    case ApiConstants.constants.API_ADD_FRIEND_SUCCESS:
      return { ...state, onLoad: false };

    case ApiConstants.constants.API_MY_FRIENDS_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_REMOVE_FRIEND_SUCCESS:
      let removeUpdateResult = removeFriendSuccess(state.result, action.id);
      return { ...state, onLoad: false, result: removeUpdateResult };

    default:
      return state;
  }
}
export default MyFriends;
