import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { BASIC_URL } from "../utils/constants";
import { Alert } from "react-native";
export default function Settings() {
  const [userData, setUserData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [useLocation, setUseLocation] = useState("");
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      setLocationAvailable(true);
    } else {
      // Permission denied, show an alert and request again after a delay
      Alert.alert(
        "Location permission not granted. Please grant location permission."
      );
      setTimeout(requestLocationPermission, 1000); // Request again after 1 second
    }
  };

  const fetchUserLocation = async () => {
    requestLocationPermission();

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      console.error("Error fetching user location:", error);
    }
  };

  function Logout() {
    const handleLogoutConfirmation = () => {
        if(useLocation == "Y"){
            fetchUserLocation();
            if (latitude === "" || longitude === "") {
              Alert.alert(
                "Please Enable Your Location & Wait For 2 Seconds Before Logout."
              );
              return;
            }
        }


      const apiUrl = BASIC_URL + "logout.php"; // Replace with the actual URL

      // Prepare the request data
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${userData.username}&password=${userData.password}&latitude=${latitude}&longitude=${longitude}`,
      };

      fetch(apiUrl, requestData)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            AsyncStorage.removeItem("userData")
              .then(() => {
                navigation.navigate("OnBoarding");
              })
              .catch((error) => {
                console.error("Error saving data to AsyncStorage:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    // Show the confirmation dialog
    Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: handleLogoutConfirmation,
      },
    ]);
  }

  useEffect(() => {
    FetchUserData();
    FetchLoginFunction();
  }, []);

  function FetchUserData() {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data); // Parse the JSON string to an object
          setUserData(userData);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }

  function FetchLoginFunction() {
    AsyncStorage.getItem("is_location")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data); // Parse the JSON string to an object
          console.log(userData);
          setUseLocation(userData);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headercontainer}>
        <View style={styles.row}>
          <View style={[styles.width75, { justifyContent: "center" }]}>
            <Text style={styles.name}>
              {userData.first_name} {userData.sur_name}!
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.border} />
      <View style={styles.subcontainer}>
        <TouchableOpacity
          style={styles.cardcontainer}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.row}>
            <View style={styles.width25}>
              <Image
                source={require("../assets/usericon.png")}
                style={styles.iconimage}
              />
            </View>
            <View style={[styles.width60, { justifyContent: "center" }]}>
              <View style={styles.textcontainer}>
                <Text style={styles.textcard}>My Profile</Text>
              </View>
            </View>
            <View style={[styles.width15, { justifyContent: "center" }]}>
              <View style={styles.iconcontainer}>
                <AntDesign name="right" style={styles.iconcard} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardcontainer}
          onPress={() => navigation.navigate("About")}
        >
          <View style={styles.row}>
            <View style={styles.width25}>
              <Image
                source={require("../assets/about.png")}
                style={styles.iconimage}
              />
            </View>
            <View style={[styles.width60, { justifyContent: "center" }]}>
              <View style={styles.textcontainer}>
                <Text style={styles.textcard}>About Care Partners HC</Text>
              </View>
            </View>
            <View style={[styles.width15, { justifyContent: "center" }]}>
              <View style={styles.iconcontainer}>
                <AntDesign name="right" style={styles.iconcard} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.cardcontainer}
                onPress={()=>navigation.navigate('Help')}
                >
                    <View style={styles.row}>
                        <View style={styles.width25}>
                        <Image source={require('../assets/help.png')}
                        style={styles.iconimage}
                        />
                        </View>
                        <View style={[styles.width60,{justifyContent:"center"}]}>
                            <View style={styles.textcontainer}>
                                <Text style={styles.textcard}>Help & Support</Text>
                            </View>
                        </View>
                        <View style={[styles.width15,{justifyContent:"center"}]}>
                            <View style={styles.iconcontainer}>
                                <AntDesign name="right" style={styles.iconcard}/>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> */}
        <TouchableOpacity style={styles.cardcontainer} onPress={() => Logout()}>
          <View style={styles.row}>
            <View style={styles.width25}>
              <Image
                source={require("../assets/logout.png")}
                style={styles.iconimage}
              />
            </View>
            <View style={[styles.width60, { justifyContent: "center" }]}>
              <View style={styles.textcontainer}>
                <Text style={styles.textcard}>Logout</Text>
              </View>
            </View>
            <View style={[styles.width15, { justifyContent: "center" }]}>
              <View style={styles.iconcontainer}>
                <AntDesign name="right" style={styles.iconcard} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  width60: {
    width: "60%",
  },
  width15: {
    width: "15%",
  },
  editbtn: {
    backgroundColor: Colors.Primary,
    paddingVertical: 10,
    alignContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: 5,
  },
  btnedit: {
    color: Colors.White,
    fontSize: 18,
    alignSelf: "center",
  },
  border: {
    borderWidth: 0.3,
    borderColor: Colors.GrayBoder2,
  },
  subcontainer: {
    backgroundColor: Colors.White,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
    elevation: 5,
  },
  textcontainer: {
    justifyContent: "center",
    verticalAlign: "middle",
  },
  textcard: {
    fontSize: 18,
    fontFamily: fonts.mullishmedium,
  },
  iconcard: {
    fontSize: 22,
    alignSelf: "flex-end",
    marginRight: 10,
    color: Colors.GrayBoder1,
  },
  cardcontainer: {
    justifyContent: "center",
    marginVertical: 10,
    paddingBottom: 10,
  },
  iconimage: {
    width: 40,
    height: 40,
    alignSelf: "center",
    borderRadius: 10,
  },
  width75: {
    width: "100%",
  },
});
