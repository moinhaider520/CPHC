import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Alert,
} from "react-native";
import { Image } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import { BASIC_URL } from "../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [userData, setUserData] = useState("");
  const navigation = useNavigation();
  const [task, setTask] = useState("");
  const [greaterThan2Hours, setGreaterThan2Hours] = useState([]);
  const [lessOrEqualTo2Hours, setLessOrEqualTo2Hours] = useState([]);
  const [clientID, setClientID] = useState("");
  const [clientName, setClientName] = useState("");
  const [roasterId, setRoasterId] = useState("");
  const [access,setAccess] = useState([
    {
      notes: "Y",
      routines: "Y",
    }
  ]);
  useEffect(() => {
    const backAction = () => {
      // Custom back button behavior for the "Home" screen
      if (navigation.isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false; // Allow the app to exit for other screens
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data); // Parse the JSON string to an object
          setUserData(userData);
          FetchDuty(userData.id);
          FetchAccess(userData.id);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("userData")
        .then((data) => {
          if (data) {
            const userData = JSON.parse(data); // Parse the JSON string to an object
            setUserData(userData);
            FetchDuty(userData.id);
          }
        })
        .catch((error) => {
          console.error("Error saving data to AsyncStorage:", error);
        });
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setClientID(item.userid);
        setRoasterId(item.id);
      }}
    >
      <Text style={styles.tasktext}>
        {item.shift_type_name}{" "}
        {item.status == "D" && <Text style={{ color: "red" }}>(DRAFT)</Text>}
      </Text>
      {/* <Text style={styles.tasktext2}>{item.datestart} To {item.dateend} </Text> */}
      <Text style={styles.tasktext2}>
        {item.timestart} To {item.timeend}{" "}
      </Text>
      <Text style={styles.tasktext3}>Client Name: {item.username}</Text>
      {item.description && <Text style={styles.tasktext2}>Description:</Text>}
      <View style={styles.underline} />
    </TouchableOpacity>
  );

  const renderItemVisit = ({ item }) => (
    <TouchableOpacity
      onPress={() => SetClient(item.userid, item.username, item.id)}
    >
      <Text style={styles.tasktext2}>
        {item.timestart} - {item.timeend}{" "}
        {item.status == "D" && <Text style={{ color: "red" }}>(DRAFT)</Text>}
      </Text>
      <Text style={styles.tasktext2}>Client Name: {item.username}</Text>
      <Text style={styles.tasktext2}>Duty Location</Text>
      <Text style={styles.tasktext}>{item.userlocation}</Text>
      <View style={styles.underline} />
    </TouchableOpacity>
  );

  function FetchRoutineofClient() {
    if (clientID !== "") {
      navigation.navigate("ViewClientRoutine", clientID);
    } else {
      alert("Please Select a Shift From Your List");
    }
  }

  function CreateNoteofClient() {
    if (clientID !== "") {
      navigation.navigate("AddNotesForClient", {
        clientID: clientID,
        clientName: clientName,
        roasterId: roasterId,
      });
    } else {
      alert("Please Select a Shift From Your List");
    }
  }

  function SetClient(userid, userName, roasterid) {
    setClientID(userid);
    setClientName(userName);
    setRoasterId(roasterid);
    Alert.alert(
      "Shift Selected.You can Now View Routine & Add Notes For this Shift."
    );
  }

  function FetchAccess(userid){

    fetch(BASIC_URL + "fetch_access.php?id=" + userid)
      .then((response) => response.json())
      .then((data) => {
        setAccess(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function FetchDuty(staffid) {
    fetch(BASIC_URL + "fetch_daily_events_by_id.php?id=" + staffid)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTask(data);
        const lessOrEqualTo2HoursData = data.filter(
          (item) => item.shift_type === "11"
        );
        const greaterThan2HoursData = data.filter(
          (item) => item.shift_type !== "11"
        );
        setGreaterThan2Hours(greaterThan2HoursData);
        setLessOrEqualTo2Hours(lessOrEqualTo2HoursData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function calculateTimeDifference(startTime, endTime, datestart, dateend) {
    // Convert time strings to 24-hour format
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);

    // Create Date objects with the specified dates and 24-hour time
    const start = new Date(`${datestart}T${startTime24}:00`);
    const end = new Date(`${dateend}T${endTime24}:00`);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = end - start;

    // Convert the difference to hours
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    return diffInHours;
  }

  function convertTo24HourFormat(time) {
    const [timePart, ampm] = time.split(" ");
    const [hours, minutes] = timePart.split(":");
    let hours24 = parseInt(hours, 10);

    if (ampm === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (ampm === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    return `${hours24.toString().padStart(2, "0")}:${minutes}`;
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={styles.headercontainer}>
            <View style={styles.row}>
              <View style={[styles.width75, { justifyContent: "center" }]}>
                <Text style={styles.name}>
                  {userData.first_name} {userData.sur_name}
                </Text>
                <Text style={styles.welcometext}>
                  Care Partners Health Care
                </Text>
              </View>
              <View style={styles.width25}>
                <TouchableOpacity
                  style={styles.notificationbutton}
                  onPress={() => navigation.navigate("ViewNotice")}
                >
                  <Ionicons
                    name="notifications-outline"
                    style={styles.notificationicon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          {(userData.access_level == 1 || userData.access_level == 2) && (
            <View>
              {greaterThan2Hours.length > 0 && (
                <View style={styles.taskcontainer}>
                  <View style={styles.row}>
                    <View style={styles.width75}>
                      <Text style={styles.headingtask}>
                        Todays Shift Schedule
                      </Text>
                    </View>
                  </View>
                  <View style={styles.task}>
                    <FlatList
                      data={greaterThan2Hours}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      style={{ maxHeight: 500 }}
                    />
                  </View>
                </View>
              )}
              {lessOrEqualTo2Hours.length > 0 && (
                <>
                  <View style={styles.taskcontainer}>
                    <View style={styles.row}>
                      <View style={styles.width75}>
                        <Text style={styles.headingtask}>Today's Visits</Text>
                      </View>
                    </View>
                    <View style={styles.task2}>
                      <FlatList
                        data={lessOrEqualTo2Hours}
                        renderItem={renderItemVisit}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator
                        style={{ maxHeight: 500 }}
                      />
                    </View>
                  </View>
                  {/* <View style={styles.cardcontainers}>
                    <View style={styles.row}>
                      <View style={styles.width50}>
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() => CreateNoteofClient()}
                        >
                          <Image
                            source={require("../assets/notes.png")}
                            style={styles.cardimage}
                          />
                          <Text style={styles.cardtext}>Notes</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.width50}>
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() => FetchRoutineofClient()}
                        >
                          <Image
                            source={require("../assets/addnotes.png")}
                            style={styles.cardimage}
                          />
                          <Text style={styles.cardtext}>Routine</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View> */}
                </>
              )}

              {greaterThan2Hours.length <= 0 &&
                lessOrEqualTo2Hours.length <= 0 && (
                  <View style={styles.noshiftcontainer}>
                    <Image
                      source={require("../assets/shift.png")}
                      style={styles.cardimagenoview}
                    />
                    <Text style={styles.textnoshift}>
                      No SHIFT FOUND FOR TODAY
                    </Text>
                  </View>
                )}
            </View>
          )}

          <View style={styles.cardcontainers}>
            <View style={styles.row}>
              {(access[0].notes == "Y") && (
                <View style={styles.width50}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("Notes")}
                  >
                    <Image
                      source={require("../assets/notes.png")}
                      style={styles.cardimage}
                    />
                    <Text style={styles.cardtext}>Notes</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(access[0].routines == "Y") && (
                <View style={styles.width50}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("Routine")}
                  >
                    <Image
                      source={require("../assets/addnotes.png")}
                      style={styles.cardimage}
                    />
                    <Text style={styles.cardtext}>Routine</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
  },
  headercontainer: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
  },
  width25: {
    width: "25%",
  },
  width50: {
    width: "50%",
  },
  userimage: {
    width: "80%",
    height: 60,
    alignSelf: "center",
    borderRadius: 10,
  },
  name: {
    fontFamily: fonts.mullishbold,
    fontSize: 22,
    color: Colors.Purple,
  },
  welcometext: {
    fontFamily: fonts.mullishregular,
    fontSize: 18,
  },
  notificationbutton: {
    alignSelf: "flex-end",
    justifyContent: "center",
    height: 50,
    elevation: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  notificationicon: {
    color: Colors.Primary,
    fontSize: 28,
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
  cardimagenoview: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 70,
  },
  cardtext: {
    fontFamily: fonts.mullishmedium,
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  cardcontainers: {
    marginTop: 10,
    marginBottom: 50,
  },
  width75: {
    width: "75%",
  },
  taskcontainer: {
    marginTop: 20,
  },
  headingtask: {
    fontSize: 20,
    fontFamily: fonts.mullishbold,
    color: Colors.Primary,
  },
  bodytask: {
    fontFamily: fonts.mullishmedium,
  },
  task: {
    borderWidth: 0.3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    borderColor: Colors.Primary,
    height:200
  },
  task2: {
    borderWidth: 0.3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    borderColor: Colors.Primary,
  },
  tasktext: {
    fontFamily: fonts.mullishbold,
    fontSize: 19,
    color: Colors.Primary,
  },
  tasktext2: {
    fontFamily: fonts.mullishbold,
    fontSize: 17,
    color: Colors.Black,
  },
  tasktext3: {
    fontFamily: fonts.mullishregular,
    fontSize: 16,
    color: Colors.Black,
  },
  underline: {
    borderWidth: 0.3,
    borderColor: Colors.GrayBoder2,
    marginBottom: 5,
  },
  noshiftcontainer: {
    justifyContent: "center",
  },
  textnoshift: {
    fontFamily: fonts.mullishbold,
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
});
