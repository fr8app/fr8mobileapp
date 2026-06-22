import React, { Component } from "react";
import { AppState, Linking, Platform } from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { FetchApi } from "../Components";
import { Notifications } from "react-native-notifications";
import Branch from "react-native-branch";
import I18n from "react-native-i18n";

var classProps = null;

class PushNotificationManager {
  constructor() {
    this._unsubscribeFromBranch = null;
    this._unsubscribeFromBranchData();

    Notifications.events().registerNotificationReceivedForeground(
      async (
        notification: Notification,
        completion: (response: NotificationCompletion) => void
      ) => {
        let data;
        console.log("notification", notification);
        if (notification.payload.sendDetail) {
          data = await JSON.parse(notification.payload.sendDetail);
        }
        this._receiveNotification(data);
        if (notification.payload.aps == undefined) {
          completion({ alert: true, sound: true, badge: false });
        }
        if (notification.payload.sendDetail) {
          if (data.Notifykey == "add") {
            classProps?.notifyBadgeIncrerase();
          }
        }
      }
    );
    Notifications.events().registerNotificationOpened(
      async (notification: Notification, completion) => {
        console.log("notification", notification);
        let data = await JSON.parse(notification.payload.sendDetail);
        this._receiveNotification(data);
        completion();
      }
    );

    Notifications.events().registerNotificationReceivedBackground(
      async (
        notification: Notification,
        completion: (response: NotificationCompletion) => void
      ) => {
        let data = await JSON.parse(notification.payload.sendDetail);
        this._receiveNotification(data);
      }
    );

    if (Platform.OS === "ios") {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
      PushNotificationIOS?.requestPermissions();
      PushNotificationIOS.addEventListener(
        "register",
        this.registerToken.bind(this)
      );
      PushNotificationIOS.addEventListener("registrationError", (thiss) => {});
      setTimeout(() => {
        this.setupInitialNotification();
      }, 1000);

      PushNotificationIOS.addEventListener("notification");
    }
  }

  _unsubscribeFromBranchData = () => {
    this._unsubscribeFromBranch = Branch.subscribe(({ error, params, uri }) => {
      if (error) {
        return;
      }
      if (params["+clicked_branch_link"] == true) {
        if (params.mydata?.key) {
          Linking.openURL(params.mydata?.key);
        } else {
          let url = params["$canonical_url"];
          console.log("params", params, url);
          let splitedUrl = url.split("sharing/");
          let splitID = splitedUrl[1].split("?type");
          let timelineId = splitID[0];
          let splitData = url.split("type=");
          if (params.user_id == undefined || params.user_id == null) {
            params.user_id = timelineId;
          }
          if (splitData[1].includes("route_post")) {
            setTimeout(() => {
              if (classProps) {
                if (classProps.stat) {
                  if (classProps.stat.RoutePostData) {
                    if (classProps.stat.RoutePostData.linkingData) {
                      if (
                        classProps.stat.RoutePostData.linkingData._id.toString() !==
                        params.user_id
                      ) {
                        classProps.navigation.popToTop();
                        classProps.navigation.push("TimeLineDetail", {
                          item: { _id: params.user_id, fromBranch: true },
                        });
                      } else {
                      }
                    } else {
                      if (classProps.stat.LogOutState) {
                        if (classProps.stat.LogOutState.isLogOut == true) {
                        } else {
                          classProps.navigation.popToTop();
                          classProps.navigation.push("TimeLineDetail", {
                            item: { _id: params.user_id, fromBranch: true },
                          });
                        }
                      } else {
                        classProps.navigation.popToTop();
                        classProps.navigation.push("TimeLineDetail", {
                          item: { _id: params.user_id, fromBranch: true },
                        });
                      }
                    }
                  } else {
                    classProps.navigation.push("TimeLineDetail", {
                      item: { _id: params.user_id, fromBranch: true },
                    });
                  }
                } else {
                  classProps.navigation.push("TimeLineDetail", {
                    item: { _id: params.user_id, fromBranch: true },
                  });
                }
              }
            }, 500);
          } else {
            setTimeout(() => {
              if (classProps) {
                if (classProps.stat) {
                  if (classProps.stat.timeLine.detail) {
                    if (classProps.stat.LogOutState) {
                      if (classProps.stat.LogOutState.isLogOut == true) {
                      } else {
                        classProps.navigation.popToTop();
                        classProps.navigation.push("comments", {
                          item: { _id: params.user_id, fromBranch: true },
                        });
                      }
                    } else {
                      classProps.navigation.popToTop();
                      classProps.navigation.push("comments", {
                        item: { _id: params.user_id, fromBranch: true },
                      });
                    }
                  } else {
                    classProps.navigation.push("comments", {
                      item: { _id: params.user_id, fromBranch: true },
                    });
                  }
                } else {
                  classProps.navigation.push("comments", {
                    item: { _id: params.user_id, fromBranch: true },
                  });
                }
              }
            }, 1000);
          }
        }
      }
    });
  };

  init(props) {
    classProps = props;
  }
  updateProps(props) {
    classProps = props;
  }

  // react-native-notification used
  setupInitialNotification() {
    Notifications.getInitialNotification().then((datas) => {
      setTimeout(() => {
        if (datas !== null && datas !== undefined) {
          let data = JSON.parse(datas.payload.sendDetail);

          if (data.notifykey == "chat") {
            classProps.navigation.navigate("Chat", {
              item: {
                other_user_detail: {
                  name: data.other_user_detail.userName,
                  id: data.other_user_detail._id,
                  image: data.other_user_detail.profile,
                },
              },
            });
          } else if (data.Notifykey == "add") {
            classProps.navigation.navigate("Notification");
          } else if (data.Notifykey == "locationSetting") {
            classProps.navigation.navigate("LocationSetting");
          } else {
            classProps.navigation.navigate("Notification");
          }
        }
      }, 3000);
    });
  }
  registerToken(deviceToken) {
    FetchApi.setDeviceToken(deviceToken);
  }

  _receiveNotification(data) {
    console.log(AppState.currentState, "AppState.currentState");
    if (classProps) {
      if (classProps.showNotification) {
        if (AppState.currentState == "active") {
          if (data !== null && data !== undefined) {
            if (data.notifykey == "chat") {
              if (classProps.chatHistoryAction) {
                classProps.chatHistoryAction(
                  classProps.navigation,
                  classProps?.stat?.ChatHistoryState?.search
                );
              }

              if (this.checkCurrentChat(data) == 0) {
                classProps.showNotification({
                  title: "FR8",
                  message:
                    data.other_user_detail.userName +
                    " " +
                    I18n.t("sentAMessage") +
                    " " +
                    data.message,
                  onPress: () => {
                    classProps.navigation.navigate("Chat", {
                      item: {
                        other_user_detail: {
                          name: data.other_user_detail.userName,
                          id: data.other_user_detail._id,
                          image: data.other_user_detail.profile,
                        },
                      },
                    });
                  },
                });
              } else if (this.checkCurrentChat(data) == 1) {
                classProps.addNotificationMessage(data);
              } else {
                classProps.showNotification({
                  title: "FR8",
                  message: data.message,
                  onPress: () => {
                    classProps.navigation.popToTop();
                    classProps.navigation.navigate("Chat", {
                      item: {
                        other_user_detail: {
                          name: data.other_user_detail.userName,
                          id: data.other_user_detail._id,
                          image: data.other_user_detail.profile,
                        },
                      },
                    });
                  },
                });
              }
            } else if (data.Notifykey == "add") {
              classProps.showNotification({
                title: "FR8",
                message: data.message,
                onPress: () => {
                  classProps.navigation.navigate("Notification");
                },
              });
            } else if (data.Notifykey == "location") {
              Notifications.postLocalNotification({
                body: data.message,
                title: "FR8",
                sound: "update_type1.wav",
                silent: false,
                userInfo: {},
              });
            } else if (data.Notifykey == "locationSetting") {
              classProps.showNotification({
                title: "FR8",
                message: data.message,
                onPress: () => {
                  classProps.navigation.navigate("LocationSetting");
                },
              });
            } else if (data.Notifykey == "createUser") {
              classProps.showNotification({
                title: "FR8",
                message: data.message,
                onPress: () => {
                  classProps.navigation.navigate("EditProfile", {
                    addProfile: "Add Profile",
                  }); // to AddUser Screen
                },
              });
            } else {
              if (data.userInfo) {
                return true;
              } else {
                classProps.showNotification({
                  title: "FR8",
                  message: data.message,
                  onPress: () => {
                    classProps.navigation.navigate("Notification");
                  },
                });
              }
            }
          } else {
            if (data !== null && data !== undefined) {
              if (data.notifykey == "chat") {
                this.checkCurrentChat(data) == 0
                  ? classProps.showNotification({
                      title: "FR8",
                      message: data.message,
                      onPress: () => {
                        classProps.navigation.navigate("Chat", {
                          item: {
                            other_user_detail: {
                              name: data.other_user_detail.userName,
                              id: data.other_user_detail._id,
                              image: data.other_user_detail.profile,
                            },
                          },
                        });
                      },
                    })
                  : this.checkCurrentChat(data) == 1
                  ? classProps.addNotificationMessage(data)
                  : classProps.showNotification({
                      title: "FR8",
                      message: data.message,
                      onPress: () => {
                        classProps.navigation.popToTop();

                        classProps.navigation.navigate("Chat", {
                          item: {
                            other_user_detail: {
                              name: data.other_user_detail.userName,
                              id: data.other_user_detail._id,
                              image: data.other_user_detail.profile,
                            },
                          },
                        });
                      },
                    });
              } else if (data.Notifykey == "add") {
                classProps.showNotification({
                  title: "FR8",
                  message: data.message,
                  onPress: () => {
                    classProps.navigation.navigate("Notification");
                  },
                });
              } else if (data.notifykey == "locationSetting") {
                classProps.navigation.navigate("LocationSetting");
              } else if (data.Notifykey == "createUser") {
                classProps.showNotification({
                  title: "FR8",
                  message: data.message,
                  onPress: () => {
                    classProps.navigation.navigate("EditProfile", {
                      addProfile: "Add Profile",
                    });
                  },
                });
              } else {
                classProps.showNotification({
                  title: "FR8",
                  message: data.message,
                  onPress: () => {
                    classProps.navigation.navigate("Notification");
                  },
                });
              }
            }
          }
        } else if (AppState.currentState == "background") {
          if (data !== null && data !== undefined) {
            if (data.notifykey == "chat") {
              if (this.checkCurrentChat(data) == 0) {
                classProps.navigation.popToTop();
                classProps.navigation.navigate("Chat", {
                  item: {
                    other_user_detail: {
                      name: data.other_user_detail.userName,
                      id: data.other_user_detail._id,
                      image: data.other_user_detail.profile,
                    },
                  },
                });
              } else if (this.checkCurrentChat(data) == 1) {
                classProps.navigation.popToTop();
                classProps.navigation.navigate("Chat", {
                  item: {
                    other_user_detail: {
                      name: data.other_user_detail.userName,
                      id: data.other_user_detail._id,
                      image: data.other_user_detail.profile,
                    },
                  },
                });
              } else {
                classProps.navigation.popToTop();
                classProps.navigation.navigate("Chat", {
                  item: {
                    other_user_detail: {
                      name: data.other_user_detail.userName,
                      id: data.other_user_detail._id,
                      image: data.other_user_detail.profile,
                    },
                  },
                });
              }
            } else if (data.Notifykey == "add") {
              classProps.navigation.navigate("Notification");
            } else if (data.Notifykey == "location") {
            } else if (data.Notifykey == "locationSetting") {
              classProps.navigation.navigate("LocationSetting");
            } else if (data.Notifykey == "createUser") {
              classProps.navigation.navigate("EditProfile", {
                addProfile: "Add Profile",
              });
            } else {
              classProps.navigation.navigate("Notification");
            }
          }
        }
      }
    }
  }

  checkCurrentChat(data) {
    if (classProps) {
      if (classProps.chatUserHistoryState.friendUserId == null) {
        return 0;
      } else if (
        classProps.chatUserHistoryState.friendUserId ==
        data.other_user_detail._id
      ) {
        return 1;
      } else {
        return 2;
      }
    }
  }
}

const PushNotification = new PushNotificationManager();

export default PushNotification;
