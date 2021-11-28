import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Appbar, TextInput, Button } from "react-native-paper";
import Todo from "./components/todo";

function App() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const ref = firestore().collection("todos");
  console.log(ref);

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo("");
  }

  useEffect(() => {
    return ref.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title={"TODOs List"} />
      </Appbar>
      <FlatList
        style={{ flex: 1 }}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Todo {...item} />}
      />
      <TextInput
        label={"New Todo"}
        value={todo}
        onChangeText={(text) => setTodo(text)}
      />
      <Button onPress={addTodo}>Add TODO</Button>
    </View>
  );
}

export default App;
