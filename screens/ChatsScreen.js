import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";

import NewMessageButton from "../components/NewMessageButton";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser } from "./queries";

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        })
      );

      setChatRooms(userData.data.getUser.chatRoomUser.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        data={chatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
      />
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
