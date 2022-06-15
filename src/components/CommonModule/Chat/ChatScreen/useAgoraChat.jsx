import AgoraRTM from "agora-rtm-sdk";
import { useEffect, useState } from "react";

const useAgoraChat = (appId, onMessage, onConnectionChange) => {
  const client = AgoraRTM.createInstance(appId);
  const [channels, setChannels] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    client.on("ConnectionStateChanged", (...args) => {
      onConnectionChange(args);
    });

    client.on("MessageFromPeer", (...args) => {
      onMessage(args);
    });
  }, []);

  useEffect(() => {
    listenForMessages();
  }, [channels]);

  const login = async (accountName, token) => {
    return client.login({
      uid: accountName,
      token,
    });
  };

  const logout = async () => {
    return client.logout();
  };

  const listenForMessages = () => {
    for(let key in channels) {
        channels[key].channel.on("ChannelMessage", (...args) => {
          console.log(args);
          const msgObj =  getMessageObj(false,args[0].text);
          setMessages((prevMessages) => ([... prevMessages, msgObj]) );
          onMessage(msgObj);
        })
    }
  }

  const joinChannel = async (channelName) => {
    const channel = client.createChannel(channelName);
    setChannels({
      ...channels,
      [channelName]: {
        channel,
        joined: true,
      },
    });
    listenForMessages(channelName);
    return channel.join();
  };

  const leaveChannel = async (channelName) => {
    console.log("leaveChannel", channelName);
    if (
      !channels[channelName] ||
      (channels[channelName] && !channels[channelName].joined)
    )
      return;
    return channels[channelName].channel.leave();
  };

  const sendChannelMessage = async (text, channelName) => {
    if (!channels[channelName] || !channels[channelName].joined) return;
    return channels[channelName].channel.sendMessage({ text });
  };

  const sendPeerMessage = async (text, peerId) => {
    console.log("sendPeerMessage", text, peerId);
    return client.sendMessageToPeer({ text }, peerId.toString());
  };

  const queryPeersOnlineStatus = async (memberId) => {
    console.log("queryPeersOnlineStatus", memberId);
    return client.queryPeersOnlineStatus([memberId]);
  };

  //send image
  const uploadImage = async (blob, peerId) => {
    const mediaMessage = await client.createMediaMessageByUploading(blob, {
      messageType: "IMAGE",
      fileName: "agora.jpg",
      description: "send image",
      thumbnail: blob,
      // width: 100,
      // height: 200,
      // thumbnailWidth: 50,
      // thumbnailHeight: 200,
    });
    return client.sendMessageToPeer(mediaMessage, peerId);
  };

  const sendChannelMediaMessage = async (blob, channelName) => {
    console.log("sendChannelMessage", blob, channelName);
    if (!channels[channelName] || !channels[channelName].joined) return;
    const mediaMessage = await client.createMediaMessageByUploading(blob, {
      messageType: "IMAGE",
      fileName: "agora.jpg",
      description: "send image",
      thumbnail: blob,
      // width: 100,
      // height: 200,
      // thumbnailWidth: 50,
      // thumbnailHeight: 200,
    });
    return channels[channelName].channel.sendMessage(mediaMessage);
  };

  const cancelImage = async (message) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 1000);
    await client.downloadMedia(message.mediaId, {
      cancelSignal: controller.signal,
      onOperationProgress: ({ currentSize, totalSize }) => {
        console.log(currentSize, totalSize);
      },
    });
  };

  const getMessageObj = (isMyMessage, msg) => {
    return {
      id: new Date().getMilliseconds(),
      message: msg,
      myMessage: isMyMessage,
      createdAt: new Date().toISOString()
    };
  }

  return {
    login,
    logout,
    joinChannel,
    leaveChannel,
    sendChannelMessage,
    sendPeerMessage,
    queryPeersOnlineStatus,
    uploadImage,
    sendChannelMediaMessage,
    cancelImage,
    messages,
    setMessages,
    getMessageObj
  };
};

export default useAgoraChat;
