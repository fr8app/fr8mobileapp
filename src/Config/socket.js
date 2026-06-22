import React from "react";
import { Platform } from "react-native";
import appsFlyer from "react-native-appsflyer";
import { io } from "socket.io-client";
import { socketBaseUrl } from ".";
import { DataManager } from '../Components';

export const socket = io(socketBaseUrl);
export const intervalRef = React.createRef();
//connect the socket
export const connectSocket = () => {
    socket.connect();
}


//disconnect the socket
export const disconnectSocket = () => {
    socket.disconnect(true);
}
