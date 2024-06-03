import { Image } from "expo-image";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Logo from "../assets/loading.png";
import { Colors, fonts } from "../utils/styles";
import { useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { BASIC_URL } from "../utils/constants";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Login({ navigation }) {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationAvailable, setLocationAvailable] = useState(false);
  const [useLocation, setUseLocation] = useState("");
  // EXPO NOTIFICATIONS
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    FetchLoginFunction();
    // fetchUserLocation();
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function Authenticate() {
    if(useLocation == "Y"){
      fetchUserLocation();
      if (latitude === "" || longitude === "") {
        Alert.alert(
          "Please Enable Your Location & Wait For 2 Seconds Before Login."
        );
        return;
      }
    }


    const apiUrl = BASIC_URL + "authenticate.php"; // Replace with the actual URL
    // // Prepare the request data
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `username=${username}&password=${password}&latitude=${latitude}&longitude=${longitude}&expo_token=${expoPushToken}`,
    };
    fetch(apiUrl, requestData)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          schedulePushNotification();
          AsyncStorage.setItem("userData", JSON.stringify(data))
            .then(() => {
              navigation.navigate("Dashboard");
            })
            .catch((error) => {
              console.error("Error saving data to AsyncStorage:", error);
            });
        } else {
          // Handle login failure
          Alert.alert("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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

  const FetchLoginFunction = async () => {
    fetch(BASIC_URL + "fetchlogin_function.php")
      .then((response) => response.json())
      .then((data) => {
        AsyncStorage.setItem(
          "is_location",
          JSON.stringify(data.location_function[0].is_enabled)
        )
          .then(() => {
            setUseLocation(data.location_function[0].is_enabled);
          })
          .catch((error) => {
            console.error("Error saving data to AsyncStorage:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.logocontainer}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <Text style={styles.welcometext}>Welcome Back</Text>
        <View style={styles.subcontainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Enter Your Username"
            onChangeText={(text) => setUsername(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.subcontainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="********"
            secureTextEntry={showPassword}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
          />
          <Feather
            name={showPassword == true ? "eye-off" : "eye"}
            style={styles.btnpassword}
            onPress={() => setShowPassword(!showPassword)}
          />
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => Authenticate()}
          // onPress={async () => {
          //   await schedulePushNotification();
          // }}
        >
          <Text style={styles.btntext}>Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Login Success!",
      body: "Welcome to Care Partners HC!",
      data: { data: ".." },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    backgroundColor: Colors.Background,
  },
  logocontainer: {
    height: 150,
    width: "100%",
    justifyContent: "center",
    marginTop: "15%",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  welcometext: {
    textAlign: "center",
    fontFamily: fonts.mullishsemibold,
    fontSize: 22,
    marginBottom: 40,
  },
  subcontainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.mullishsemibold,
    fontSize: 16,
  },
  input: {
    borderWidth: 0.3,
    borderColor: Colors.Platinum,
    borderRadius: 2,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 5,
    fontFamily: fonts.mullishregular,
  },
  btn: {
    backgroundColor: Colors.Primary,
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
  },
  btntext: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.mullishbold,
  },
  btnpassword: {
    position: "absolute",
    right: 10,
    top: 40,
    fontSize: 22,
    zIndex: 999,
  },
});
