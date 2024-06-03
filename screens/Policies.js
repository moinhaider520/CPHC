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
  
  export default function Appointments() {
    const navigation = useNavigation();
    return (
      <ScrollView style={styles.container}>
        <View style={styles.cardcontainers}>
          <View style={styles.row}>
            <View style={styles.width50}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("AddPolicy")}
              >
                <Image
                  source={require("../assets/notes.png")}
                  style={styles.cardimage}
                />
                <Text style={styles.cardtext}>Add Policy</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.width50}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ViewPolicies")}
              >
                <Image
                  source={require("../assets/policies.png")}
                  style={styles.cardimage}
                />
                <Text style={styles.cardtext}>View Policies</Text>
              </TouchableOpacity>
            </View>
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
      marginTop:5
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
  