import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASIC_URL } from "../utils/constants";
import { Colors, fonts } from "../utils/styles";
import { openURL } from "expo-linking";
import { useNavigation } from "@react-navigation/native";
export default function ViewAllNotes() {
  const [userData, setUserData] = useState("");
  const [routines, setRoutines] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          setUserData(userData);
          FetchRoutine();
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }, []);

  function FetchRoutine() {
    fetch(BASIC_URL + "fetch_all_notes.php")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setRoutines(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const openMapInBrowser = (itemid) => {
    // const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    // openURL(url);
    navigation.navigate("NoteDetail", { id: itemid });
  };

  const renderClientCard = (clientName, clientRoutines) => (
    <View key={clientName} style={styles.clientCard}>
      <Text style={styles.clientName}>Service User: {clientName}</Text>
      <FlatList
        data={clientRoutines}
        renderItem={({ item }) => (
          <>
            <Text style={{ fontFamily: fonts.mullishmedium }}>
              {item.note !== ""
                ? item.note
                : "No Description added while creating notes."}
            </Text>
            <Text style={styles.tasktext}>Created By: {item.author_name}</Text>
            <Text style={styles.tasktext}>Date: {item.date}</Text>
            <Text style={styles.tasktext}>Time: {item.time}</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => openMapInBrowser(item.id)}
            >
              <Text style={styles.btntext}>View Details</Text>
            </TouchableOpacity>
          </>
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

    const clientsArray = Object.keys(clients).map((clientName) => ({
      clientName,
      clientData: clients[clientName],
    }));

    return (
      <View style={styles.container}>
        <FlatList
          data={clientsArray}
          keyExtractor={(item) => item.clientName}
          renderItem={({ item }) =>
            renderClientCard(item.clientName, item.clientData)
          }
        />
      </View>
    );
  };

  return routines.length > 0 ? (
    renderAllClientRoutines()
  ) : (
    <View style={styles.noviewcontainer}>
      <Text style={styles.textnoview}>No Notes to display.</Text>
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
    paddingVertical: 30,
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  clientName: {
    fontSize: 20,
    fontFamily: fonts.mullishbold,
  },
  routineCard: {
    flex: 1,
  },
  tasktext: {
    fontFamily: fonts.mullishbold,
    fontSize: 14,
    color: Colors.Primary,
  },
  btn: {
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  btntext: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.mullishsemibold,
  },
});
