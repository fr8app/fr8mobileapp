import { TerminalModal } from "./../../Components";
import { ApiConstants } from "./../../Themes";
import { DataManager, FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  isLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null,
  selectedItem: null,
  feed: null,
  unreadCount: null,
  searchData: false,
  arrayData: [],
  unread_notification: 0,
  onLoadEnd: false,
  geofences: [],
  terminalSearch: "",
  geofencesGet: false,
  regionList: [],
  regionSelectedList: [],
  favRegion: [],
  detailCalled: false,
  regionsAvailable: false,
  fromLanguage: false,
  favTerminals: [],
  dataStatus: 0,
};

function home(state = initialState, action) {
  switch (action.type) {
    case "API_GET_GEOFENCES_LOAD":
      return { ...state, onLoad: false };
    case "API_GET_GEOFENCES_SUCCESS":
      return {
        ...state,
        onLoad: false,
        geofences: action.result,
        geofencesGet: true,
      };
    case "API_GET_GEOFENCES_FAIL":
      return { ...state, onLoad: false };
    case "API_GET_GEOFENCES_ERROR":
      return { ...state, onLoad: false };
    case ApiConstants.constants.API_HOME_LOAD:
      return { ...state, onLoad: action.loader == false ? false : true };
    case "API_HOME_DETAIL_LOAD":
      return { ...state, onLoad: false };
    case ApiConstants.constants.API_HOME_UNREAD_COUNT:
      return { ...state, unreadCount: state.unreadCount + 1 };
    case ApiConstants.constants.API_LOGIN_SUCCESS:
      // console.log('action.result?.result?.data',action.result?.result?.data);
      DataManager.setFavLocations(action.result?.result?.data?.selectedRegions);
      // action.navigation.replace("FR8")
      return {
        ...state,
        onLoad: false,
        // favRegion:action.result?.result?.data?.selectedRegions,
        // regionSelectedList:action.result?.result?.data?.selectedRegions
      };
    case ApiConstants.constants.API_HOME_SUCCESS:
      console.log(":::::::::Action.payload", action.payload);
      if (action.payload) {
        return {
          ...state,
          onLoad: false,
          result: action.payload.list_terminals,
          searchData: true,
          terminalSearch: action.termialSearch,
        };
      } else {
        let result = TerminalModal.TerminalModal.getTerminalData(
          action.result.result.data.list_near_terminals
        );

        return {
          ...state,
          onLoad: false,
          // unread_notification: action.result.result.data.unread_notification,
          result: result,
          feed: result,
          // unreadCount: action.result.result.data.unread,
          status: action.status,
          paginationData: {
            currentPage: action.result.result.data.current_page,
            nextPageurl: action.result.result.data.next_page_url,
            lastPage: action.result.result.data.last_page,
            total: action.result.result.data.total,
          },
        };
      }
    case "API_HOME_DETAIL_SUCCESS":
      DataManager.setFavLocations(action.result?.result?.data?.selectedRegions);
      if (state.fromLanguage == false) {
        if (
          action.result?.result?.data?.selectedRegions?.length == 0 &&
          action.result?.result?.data?.regionsAvailable
        ) {
        }
      }
      return {
        ...state,
        unreadCount: action?.result?.result?.data?.unread,
        unread_notification: action?.result?.result?.data?.unread_notification,
        detailCalled: 1,
        regionsAvailable: action.result?.result?.data?.regionsAvailable,
      };
    case ApiConstants.constants.API_CHAT_HISTORY_SUCCESS:
      let chatCounterData = 0;
      action.result.result.data.chat_history.map((item) => {
        chatCounterData = chatCounterData + item?.unread;
      });
      return {
        ...state,
        unreadCount: chatCounterData,
      };
    case ApiConstants.constants.API_HOME_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null,
      };
    case "API_HOME_DETAIL_FAIL":
      return {
        ...state,
        onLoad: false,
        navigation: null,
      };
    case "API_HOME_DETAIL_ERROR":
      return {
        ...state,
        onLoad: false,
        navigation: null,
      };

    case "API_FAV_TERMINAL_LOAD":
      return { ...state, isLoad: false, onLoad: true };

    case "API_FAV_TERMINAL_SUCCESS":
      console.log("favettt", action.result);
      return {
        ...state,
        onLoad: false,
        isLoad: false,
        favTerminals: action.result.result.data.list_terminals,
        dataStatus: 1,
      };
    case "API_FAV_TERMINAL_FAIL":
      return { ...state, onLoad: false, isLoad: false };
    case "API_FAV_TERMINAL_ERROR":
      return { ...state, onLoad: false, isLoad: false };
    case "API_REGION_LIST_LOAD":
      return { ...state, onLoad: true };
    case "API_REGION_LIST_SUCCESS":
      let RegionSelectedList = [];
      let list = DataManager.getFavList();
      let selectedData = JSON.parse(
        JSON.stringify(action.result.list_terminals)
      );
      list.then((res) => {
        selectedData.map((x, i) => {
          if (x.is_selected) {
            if (!RegionSelectedList.includes(x._id)) {
              RegionSelectedList.push(x._id);
            }
          }
        });
      });

      return {
        ...state,
        onLoad: false,
        regionList: selectedData,
        regionSelectedList: RegionSelectedList,
      };
    case "API_REGION_SELECT_LOAD":
      let listRegion = [...state.regionList];
      let selectedRegion = [...state.regionSelectedList];

      if (listRegion?.length == 0) {
        selectedRegion.push(action.id);
        let indexRegion = listRegion.findIndex((x) => x._id == action.id);
        listRegion[indexRegion].is_selected = true;
      } else {
        let findIndex = listRegion.findIndex((x) => x._id == action.id);
        if (findIndex > -1) {
          console.log(":::::click");
          if (listRegion[findIndex].is_selected) {
            console.log("inside if", selectedRegion);
            let findIndex1 = selectedRegion.findIndex((x) => x == action.id);
            selectedRegion.splice(findIndex1, 1);
            listRegion[findIndex].is_selected = false;
            console.log("inside if 2", selectedRegion);
          } else {
            if (selectedRegion?.length > 2) {
              alert(I18n.t("regionSelectAlert"));
            } else {
              selectedRegion.push(action.id);
              listRegion[findIndex].is_selected = true;
            }
          }
        }
      }
      return {
        ...state,
        onLoad: false,
        regionList: listRegion,
        regionSelectedList: selectedRegion,
      };
    case "API_REGION_LIST_FAIL":
      return { ...state, onLoad: false };
    case "API_REGION_LIST_ERROR":
      return { ...state, onLoad: false };

    case "API_SET_FAV_REGION_LOAD":
      return { ...state, onLoad: true };
    case "API_SET_FAV_REGION_SUCCESS":
      // let selectedRegions=[...state.regionSelectedList]
      DataManager.setFavLocations([]);
      return { ...state, onLoad: false };

    case "API_SET_FAV_REGION_FAIL":
      return { ...state, onLoad: false };
    case "API_SET_FAV_REGION_ERROR":
      return { ...state, onLoad: false };

    case "SEARCH_DATA_CLEAR_LOAD":
      return { ...state, onload: false, terminalSearch: "" };

    case ApiConstants.constants.API_HOME_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })],
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

    case ApiConstants.constants.API_HOME_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.SELECTED_TERMINAL_ITEM:
      let resultSelected = TerminalModal.TerminalModal.getTerminalObject(
        action.item
      );
      return {
        ...state,
        selectedItem: resultSelected,
        navigation: action.navigation.navigate("TerminalDetails"),
      };
    case ApiConstants.constants.API_ON_REACH_END_TERMINAL:
      return { ...state, onLoadEnd: true };
    case ApiConstants.constants.API_ON_REACH_END_TERMINAL_SUCCESS:
      const data = action;
      return {
        ...state,
        result: [...state.result, ...data.payload.data.list_near_terminals],

        paginationData: {
          currentPage: data.payload.data.current_page,
          nextPageurl: data.payload.data.next_page_url,
          lastPage: data.payload.data.last_page,
          total: data.payload.data.total,
        },
        searchData: true,
        onLoadEnd: false,
      };
    case ApiConstants.constants.API_ON_REACH_END_TERMINAL_ERROR:
      const error = action.payload;
      return { ...state, error: error, onLoadEnd: false };
    case ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_INITIATE:
      return { ...state, arrayData: action.payload };
    case ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_SUCCESS:
      return { ...state, arrivedNotificationResult: action.payload };
    case ApiConstants.constants.API_NEAR_TERMINAL_NOTIFICATION_ERROR:
      return { ...state, arrivedNotificationError: action.payload };
    case ApiConstants.constants.SEARCH_TERMINAL_INITIATE:
      return {
        ...state,
        onLoad: true,
        searchData: true,
      };
    case "BADGE_INCREASE":
      return {
        ...state,
        onLoad: false,
        unread_notification: state.unread_notification + 1,
      };

    case ApiConstants.constants.API_NOTIFICATION_READ_SUCCESS:
      state.unread_notification =
        state.unread_notification > 0 ? state.unread_notification - 1 : 0;

      return {
        ...state,
        onLoad: false,
      };
    case "API_SET_FIRST_TIME_FAV_REGION_LOAD":
      return {
        ...state,
        onLoad: false,
      };
    case "LANGUAGE_CHANGE_SUCCESS":
      return {
        ...state,
        onLoad: false,
        fromLanguage: true,
      };
    case "DELETE_FAV_TERMINAL_SUCCESS":
      let favTerminalList = [...state.favTerminals];
      let index = favTerminalList.findIndex(
        (item) => item._id === action.payload
      );
      if (index >= 0) {
        favTerminalList.splice(index, 1);
      }
      return {
        ...state,
        favTerminals: [...favTerminalList],
      };
    case "DELETE_FAV_TERMINAL_FAIL":
      return { ...state, onLoad: false };
    default:
      return state;
  }
}
export default home;
