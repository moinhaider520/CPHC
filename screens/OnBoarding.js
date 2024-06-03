import { ScrollView, StyleSheet, View, Text,TouchableOpacity, Image } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnBoarding() {
    const navigation = useNavigation();
    function Login(){
        navigation.navigate('Login')
    }

    useEffect(()=>{
      AsyncStorage.getItem('userData')
            .then((data) => {
              if(data){
              navigation.navigate('Dashboard');
              console.log(data)
              }
            })
            .catch((error) => {
            console.error('Error saving data to AsyncStorage:', error);
            });
    },[])

  return (
    <ScrollView style={styles.container}>
      {/* HEIGHT 80% */}
      <View style={{ flex: 4 }}>
        <Image source={require('../assets/img-1.png')} style={styles.image}/>
        <View style={styles.textcontainer}>
        <Text style={styles.text}>Welcome to</Text>
        <Text style={styles.text}>Care Parterns Health Care</Text>
        </View>
      </View>

      {/* HEIGHT 20% */}
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.btn} onPress={()=>Login()}>
            <Text style={styles.btntext}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  btn:{
    width:"90%",
    alignSelf:"center",
    alignItems:"center",
    justifyContent:"center",
    marginTop:50,
    paddingVertical:15,
    borderRadius:10,
    backgroundColor:Colors.TiffanyBlueOpacity,
  },
  btntext:{
    fontSize:18,
    color:Colors.White,
    fontFamily:fonts.mullishsemibold
  },
  image:{
    borderBottomLeftRadius:50,
    width:"100%"
  },
  textcontainer:{
    position:"absolute",
    bottom:25,
    left:25
  },
  text:{
    fontFamily:fonts.mullishbold,
    fontSize:18
  }
});
