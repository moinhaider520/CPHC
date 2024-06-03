import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Image } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASIC_URL } from "../utils/constants";
export default function MyMenu() {
  const [userData, setUserData] = useState("");
  const [access,setAccess] = useState("");
  const navigation = useNavigation();

  const data = [
    { key: 'Notes', accessKey: 'notes', image: require('../assets/addnotes.png'), route: 'Notes' },
    { key: 'Appointments', accessKey: 'appointments', image: require('../assets/askquestion.png'), route: 'Appointments' },
    { key: 'Policies', accessKey: 'policies', image: require('../assets/policies.png'), route: 'Policies' },
    { key: 'Notices', accessKey: 'noticeboard', image: require('../assets/usericon.png'), route: 'Notices' },
    { key: 'Assessments', accessKey: 'risk_assessments', image: require('../assets/appointments.png'), route: 'Assessments' },
    { key: 'Care Plans', accessKey: 'careplans', image: require('../assets/careplans.png'), route: 'CarePlans' },
    { key: 'Risk Assessments', accessKey: 'risk_assessments', image: require('../assets/careplans.png'), route: 'Assessments' },
    { key: 'Service Users', accessKey: 'service_users', image: require('../assets/usericon.png'), route: 'ServiceUser' },
    { key: 'Staff', accessKey: 'staff', image: require('../assets/usericon.png'), route: 'Staff' },
    { key: 'Significant Others', accessKey: 'significant_others', image: require('../assets/usericon.png'), route: 'SignificantOther' },
    { key: 'Logins', accessKey: 'manage_logins', image: require('../assets/appointments.png'), route: 'LoginLogs' },
    { key: 'Incidents', accessKey: 'incidents', image: require('../assets/incidents.png'), route: 'Incidents' },
    { key: 'Routines', accessKey: 'routines', image: require('../assets/appointments.png'), route: 'Routines' },
    { key: 'Noticeboard', accessKey: 'noticeboard', image: require('../assets/appointments.png'), route: 'NoticeBoard' },
    { key: 'Policies', accessKey: 'noticeboard', image: require('../assets/appointments.png'), route: 'Policies' },
  ];
  

  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          setUserData(userData);
          FetchAccess(userData.id);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userData")
      .then((data) => {
        if (data) {
          const userData = JSON.parse(data);
          setUserData(userData);
          FetchAccess(userData.id);
        }
      })
      .catch((error) => {
        console.error("Error saving data to AsyncStorage:", error);
      });
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );
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

  const renderItem = ({ item }) => (
    <View style={styles.width50}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(item.route)}
      >
        <Image source={item.image} style={styles.cardimage} />
        <Text style={styles.cardtext}>{item.key}</Text>
      </TouchableOpacity>
    </View>
  );
  const accessObject = Array.isArray(access) && access.length > 0 ? access[0] : {};

  // Filter data based on access
  const filteredData = data.filter(item => accessObject[item.accessKey] === 'Y');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercontainer}>
        <Text style={styles.mainmenu}>Main Menu</Text>
      </View>
      <View style={styles.divider} />
      <FlatList
      data={filteredData}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.cardcontainers}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
  },
  headercontainer: {
    paddingVertical: 0,
  },
  mainmenu: {
    fontSize: 22,
    fontFamily: fonts.mullishbold,
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
    fontFamily: fonts.mullishregular,
  },
  welcometext: {
    fontFamily: fonts.mullishregular,
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
  cardtext: {
    fontFamily: fonts.mullishmedium,
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 5,
    marginTop: 10,
  },
  cardcontainers: {
    marginTop: 5,
    marginBottom: 50,
  },
});
