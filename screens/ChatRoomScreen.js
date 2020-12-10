import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground } from "react-native";

import { useRoute } from "@react-navigation/native";

import chatRoomData from "../data/Chats";
import ChatMessage from "../components/ChatMessage";
import BG from "../assets/images/BG.png";
import InputBox from "../components/InputBox";

import { messagesByChatRoom } from "../src/graphql/queries";
import { API, Auth, graphqlOperation } from "aws-amplify";
const ChatRoomScreen = () => {
  const route = useRoute();

  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(messagesByChatRoom, {
        chatRoomID: route.params.id,
        sortDirection: "DESC",
      })
    );
    // console.log(messagesData);
    setMessages(messagesData.data.messagesByChatRoom.items);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getMyId = async () => {
    const userInfo = await Auth.currentAuthenticatedUser();
    setMyId(userInfo.attributes.sub);
  };

  useEffect(() => {
    getMyId();
  }, []);

  return (
    <ImageBackground style={{ width: "100%", height: "100%" }} source={BG}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
        inverted
      />

      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
