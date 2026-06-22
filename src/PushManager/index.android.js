import React, { Component } from "react";
import { AppState, Linking } from "react-native";
import { FetchApi, DataManager } from "../Components";
import { Notifications } from "react-native-notifications";
import Branch from "react-native-branch";
import I18n from "react-native-i18n";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
var classProps = null;

class PushNotificationManager {
  constructor() {
    Notifications.setNotificationChannel({
      channelId: "fr8_local",
      name: "fr8_local",
      enableLights: true,
      enableVibration: true,
      showBadge: true,
      soundFile: "update_type1.mp3", // place this in <project_root>/android/app/src/main/res/raw/custom_sound.mp3
      vibrationPattern: [200, 1000, 500, 1000, 500],
    });

    this._unsubscribeFromBranch = null;
    this._unsubscribeFromBranchData();
    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      this.registerToken(event.deviceToken);
    });

    Notifications.events().registerNotificationReceivedForeground(
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void
      ) => {
        let data;
        if (notification.payload.data) {
          data = JSON.parse(notification.payload.data);
          console.log("Notification data -- foreground ", data);
        }
        this._receiveNotification(data);
        if (notification.payload.aps == undefined) {
          completion({ alert: true, sound: true, badge: false });
        }
      }
    );
    Notifications.events().registerNotificationOpened(
      (notification: Notification, completion) => {
        console.log(
          "notificationnotificationnotification",
          notification,
          AppState.currentState
        );
        let data;
        if (notification.payload.data) {
          data = JSON.parse(notification.payload.data);
          console.log("Notification data -- omnpenede ", data);
        }
        this._receiveNotification(data);
        completion();
      }
    );

    Notifications.events().registerNotificationReceivedBackground(
      (
        notification: Notification,
        completion: (response: NotificationCompletion) => void
      ) => {
        let data;
        if (notification.payload.data) {
          data = JSON.parse(notification.payload.data);
          console.log("Notification data -- openininfg background ", data);
        }
        this._receiveNotification(data);
      }
    );
    setTimeout(() => {
      this.setupInitialNotification();
    }, 1000);
  }

  _unsubscribeFromBranchData = () => {
    Branch.skipCachedEvents();
    Branch._checkCachedEvents = false;
    this._unsubscribeFromBranch = Branch.subscribe(({ error, params, uri }) => {
      if (error) {
        return;
      }
      if (params["+clicked_branch_link"] == true) {
        console.log("paramsparams", params);
        if (params.mydata?.key) {
          BackgroundGeolocation.showAppSettings();
          // Linking.openURL(params.mydata?.key)
        } else {
          let url = params["$canonical_url"];
          let splitedUrl = url.split("sharing/");
          let splitID = splitedUrl[1].split("?type");
          let timelineId = splitID[0];

          if (params.user_id == undefined || params.user_id == null) {
            params.user_id = timelineId;
          }

          DataManager.getAccessToken().then(async (token) => {
            let accessToken = JSON.parse(token);
            await DataManager.setAccessToken(accessToken);
            await FetchApi.setAccessToken(accessToken);
          });
          setTimeout(() => {
            let splitData = url.split("type=");
            if (splitData[1].includes("route_post")) {
              if (classProps) {
                if (classProps.stat) {
                  if (classProps.stat.RoutePostData) {
                    if (classProps.stat.RoutePostData.linkingData) {
                      if (
                        classProps.stat.RoutePostData.linkingData._id !==
                        params.user_id
                      ) {
                        classProps?.navigation.popToTop();
                        classProps?.navigation.push("TimeLineDetail", {
                          item: { _id: params.user_id, fromBranch: true },
                        });
                      } else {
                        classProps?.navigation.navigate("TimeLineDetail", {
                          item: { _id: params.user_id, fromBranch: true },
                        });
                      }
                    } else {
                      if (classProps.stat.LogOutState) {
                        if (classProps.stat.LogOutState.isLogOut == true) {
                        } else {
                          classProps?.navigation.popToTop();
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
            } else {
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
            }
          }, 1000);
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
          let data = JSON.parse(datas.payload.data);

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
    console.log(data.notifykey);
    console.log("classPropsclassProps", classProps);
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
              classProps?.notifyBadgeIncrerase();
            } else if (data.Notifykey == "location") {
              Notifications.postLocalNotification(
                {
                  body: data.message,
                  title: "FR8",
                  sound: "update_type1",
                  channelId: "fr8_local",
                  silent: false,
                  userInfo: {},
                },
                Math.random()
              );

              classProps.showNotification({
                title: "FR8",
                message: data?.message,
                onPress: () => {
                  console.log("kjlj");
                  // classProps.navigation.navigate("LocationSetting");
                },
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
                  });
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
                classProps?.notifyBadgeIncrerase();
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
              } else if (data.Notifykey == "createUser") {
                console.log("::::::::::::::::::user1")
                classProps.showNotification({
                  title: "FR8",
                  message: data.message,
                  onPress: () => {
                    classProps.navigation.navigate("EditProfile", {
                      addProfile: "Add Profile",
                    });
                  },
                });
              } else if (data.Notifykey == "locationSetting") {
                classProps.navigation.navigate("LocationSetting");
              } else if (data.Notifykey == "createUser") {
                console.log("::::::::::::::::::user2")
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
            } else if (data.Notifykey == "add" || data.Notifykey == "admin") {
              console.log("data.Notifykeydata.Notifykey", data.Notifykey);
              setTimeout(() => {
                classProps.navigation.navigate("Notification");
              }, 100);
            } else if (data.Notifykey == "location") {
            } else if (data.Notifykey == "locationSetting") {
              setTimeout(() => {
                classProps.navigation.navigate("LocationSetting");
              }, 100);
            } else if (data.Notifykey == "createUser") {
              console.log("::::::::::::::::::user3")
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
