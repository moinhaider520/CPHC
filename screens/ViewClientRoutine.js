import {ScrollView, StyleSheet,View,Text,TouchableOpacity, BackHandler, FlatList} from "react-native";
import { Image } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';
import { BASIC_URL } from "../utils/constants";

export default function ViewClientRoutine({route}){
    const [userData,setUserData] = useState("");
    const navigation = useNavigation();
    const [routines,setRoutines] = useState("");
    console.log(route.params);
    useEffect(()=>{
        AsyncStorage.getItem('userData')
              .then((data) => {
                if(data){
                    const userData = JSON.parse(data); // Parse the JSON string to an object
                    setUserData(userData);
                    FetchRoutine();
                }
              })
              .catch((error) => {
              console.error('Error saving data to AsyncStorage:', error);
              });
      },[])



      const renderItemRoutine = ({ item }) => (
        <View>
            <Text style={styles.tasktext}>{item.routine} AT {item.time} | {item.routinetype}</Text>
        </View>
      );

      function FetchRoutine(){
        fetch(BASIC_URL + 'fetch_client_routine.php?id='+route.params)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setRoutines(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
          }


    return(
        <ScrollView style={styles.container}>

{routines.length > 0 &&(
            <View style={styles.taskcontainer}>
                <View style={styles.row}>
                    <View style={styles.width75}>
                        <Text style={styles.headingtask}>Service User Routines</Text>
                    </View>
                </View>
                <View style={styles.task2}>
                <FlatList
                data={routines}
                renderItem={renderItemRoutine}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator
                style={{maxHeight:120}}
                />
                </View>
            </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:"5%"
    },
    noviewcontainer:{
        justifyContent:"center",
        alignItems:"center",
    },
    image:{
        width:150,
        height:150,
        marginTop:"40%"
    },
    textnoview:{
        fontFamily:fonts.mullishsemibold,
        fontSize:20,
        marginTop:15
    },
    taskcontainer:{
        marginTop:20
    },
    headingtask:{
        fontSize:20,
        fontFamily:fonts.mullishbold
    },
    bodytask:{
        fontFamily:fonts.mullishmedium
    },
    task:{
        borderWidth:0.3,
        paddingVertical:5,
        paddingHorizontal:10,
        marginTop:10,
        borderColor:Colors.Primary,
    },
    task2:{
        borderWidth:0.3,
        paddingVertical:5,
        paddingHorizontal:10,
        marginTop:10,
        borderColor:Colors.Primary,    },
    tasktext:{
        fontFamily:fonts.mullishbold,
        fontSize:17,
        color:Colors.Primary
    },
    underline:{
        borderWidth:0.3,
        borderColor:Colors.GrayBoder2,
        marginBottom:5
    }
})