import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASIC_URL } from "../utils/constants";
import { Colors, fonts } from "../utils/styles";
import HTML from 'react-native-render-html';
export default function ViewAllRoutines() {
  const [userData, setUserData] = useState("");
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    FetchUserData();
  }, []);

  function FetchUserData(){
    AsyncStorage.getItem('userData')
    .then((data) => {
      if (data) {
        const userData = JSON.parse(data);
        setUserData(userData);
        FetchRoutine();
      }
    })
    .catch((error) => {
      console.error('Error saving data to AsyncStorage:', error);
    });
  }

  function FetchRoutine() {
    fetch(BASIC_URL + 'fetch_all_routines.php')
      .then((response) => response.json())
      .then((data) => {
        setRoutines(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const renderClientCard = (clientName, clientRoutines) => (
    <View key={clientName} style={styles.clientCard}>
      <Text style={styles.clientName}>Client Name: {clientName}</Text>
      <FlatList
        data={clientRoutines}
        renderItem={({ item }) => (
          <View style={styles.routineCard}>
            <HTML source={{ html: item.routine }} />
            <Text style={{fontFamily:fonts.mullishregular}}>
              {item.time} - <Text  style={styles.tasktext}>{item.routinetype}</Text>
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.routineList}
      />
    </View>
  );

  const renderAllClientRoutines = () => {
    const clients = {};

    routines.forEach((routine) => {
      const clientName = routine.client_name;
      if (!clients[clientName]) {
        clients[clientName] = [];
      }
      clients[clientName].push(routine);
    });

    return (
      <ScrollView style={styles.container}>
        {Object.keys(clients).map((clientName) =>
          renderClientCard(clientName, clients[clientName])
        )}
      </ScrollView>
    );
  };

  return routines.length > 0 ? renderAllClientRoutines() : (
    <View style={styles.noviewcontainer}>

      <Text style={styles.textnoview}>No routines to display.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
  },
  noviewcontainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginTop: "40%",
  },
  textnoview: {
    fontFamily: fonts.mullishsemibold,
    fontSize: 20,
    marginTop: 15,
  },
  clientCard: {
    marginTop: 20,
    borderColor: Colors.Primary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  clientName: {
    fontSize: 20,
    fontFamily: fonts.mullishbold,
  },
  routineCard: {
    marginTop: 10,
  },
  tasktext: {
    fontFamily: fonts.mullishbold,
    fontSize: 17,
    color: Colors.Primary,
  },
  routineList: {
    maxHeight: 320,
  },
});
