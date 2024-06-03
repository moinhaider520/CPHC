import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Notes() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          setUserData(userData);
          console.log(userData.access_level);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardcontainers}>
        <View style={styles.row}>
          {userData.access_level != "0" && (
            <View style={styles.width50}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("AddNotes")}
              >
                <Image
                  source={require("../assets/notes.png")}
                  style={styles.cardimage}
                />
                <Text style={styles.cardtext}>Add Notes</Text>
              </TouchableOpacity>
            </View>
          )}
          {userData.access_level == "0" ? (
            <View style={styles.width50}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ViewSignificantNotes")}
              >
                <Image
                  source={require("../assets/policies.png")}
                  style={styles.cardimage}
                />
                <Text style={styles.cardtext}>View Notes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.width50}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ViewAllNotes")}
              >
                <Image
                  source={require("../assets/policies.png")}
                  style={styles.cardimage}
                />
                <Text style={styles.cardtext}>View Notes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.row}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  divider: {
    borderWidth: 0.3,
    marginHorizontal: 5,
    borderColor: Colors.GrayBoder,
  },
  card: {
    width: "95%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    elevation: 5,
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    borderRadius: 10,
    marginTop: 15,
  },
  cardimage: {
    width: 70,
    height: 70,
  },
  cardtext: {
    fontFamily: fonts.mullishmedium,
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  cardcontainers: {
    marginTop: 50,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  width50: {
    width: "50%",
    paddingHorizontal: 10,
  },
});
