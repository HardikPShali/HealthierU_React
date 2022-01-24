import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const WebSocketService = (endpoint) => {
    //const socket = SockJS(`${SERVER_URL}/${endpoint}`);
   // const client = Stomp.over(socket);
    function subscribe(destination, callback) {
        // client.connect(headers(), function(frame) {
        //     client.subscribe(destination, function(message){
        //       callback(JSON.parse(message.body))
        //       }, headers());
        //    });
        // return client;
    }
    function unsubscribe(client){
        // for (const sub in client.subscriptions) {
        //     if (client.subscriptions.hasOwnProperty(sub)) {
        //         client.unsubscribe(sub);
        //     }
        // }
    }
    return {
        subscribe,
        unsubscribe
    }
};
export default WebSocketService;