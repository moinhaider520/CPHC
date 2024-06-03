import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useEffect,useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASIC_URL } from "../utils/constants";
export default function Profile(){
    const [userData,setUserData] = useState("");
    const [data,setData] = useState("");

    useEffect(()=>{
        FetchAuthor();
    },[])

    function FetchAuthor(){
        AsyncStorage.getItem('userData')
              .then((data) => {
                if(data){
                    const userData = JSON.parse(data); // Parse the JSON string to an object
                    setUserData(userData);
                    console.log(userData);
                    if(userData.access_level !== 0){
                        FetchStaffProfile(userData.access_level_id);
                    }else{
                        FetchUserProfile(userData.access_level_id);
                    }
                }
              })
              .catch((error) => {
              console.error('Error saving data to AsyncStorage:', error);
              });
    }

    function FetchStaffProfile(staffid){
        fetch(BASIC_URL + 'fetch-staff-profile.php?id=' + staffid)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data);
            setData(data.data[0]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    function FetchUserProfile(userid){
        fetch(BASIC_URL + 'fetch-user-profile.php?id=' + userid)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data);
            setData(data.data[0]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{data.firstname}{data.surname}</Text>
                <Text style={styles.email}>{data.email}</Text>
                <Text style={styles.position}>{data.telephone}</Text>
            </View>
            <View style={styles.divider}/>
            <View style={styles.datacontainer}>
                <View style={styles.row}>
                    <View style={styles.widht45}>
                        <Text style={styles.textleft}>First Name</Text>
                    </View>
                    <View style={styles.width5}>
                    <Text style={styles.textcenter}>-</Text>
                    </View>
                    <View style={styles.widht45}>
                        <Text style={styles.textright}>{data.firstname}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.widht45}>
                        <Text style={styles.textleft}>Sur Name</Text>
                    </View>
                    <View style={styles.width5}>
                    <Text style={styles.textcenter}>-</Text>
                    </View>
                    <View style={styles.widht45}>
                        <Text style={styles.textright}>{data.surname}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.widht45}>
                        <Text style={styles.textleft}>Date of Birth</Text>
                    </View>
                    <View style={styles.width5}>
                    <Text style={styles.textcenter}>-</Text>
                    </View>
                    <View style={styles.widht45}>
                        <Text style={styles.textright}>{data.dateofbirth}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.widht45}>
                        <Text style={styles.textleft}>Address</Text>
                    </View>
                    <View style={styles.width5}>
                    <Text style={styles.textcenter}>-</Text>
                    </View>
                    <View style={styles.widht45}>
                        <Text style={styles.textright}>{data.address}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:"5%"
    },
    header:{
        marginTop:"5%"
    },
    name:{
        textAlign:"center",
        fontFamily:fonts.mullishmedium,
        fontSize:22
    },
    email:{
        fontFamily:fonts.mullishmedium,
        fontSize:18,
        textAlign:"center"
    },
    position:{
        fontFamily:fonts.mullishmedium,
        fontSize:18,
        textAlign:"center",
        color:Colors.Primary
    },
    divider:{
        width:"70%",
        borderWidth:0.3,
        borderColor:Colors.GrayBoder1,
        alignSelf:"center",
        marginVertical:10
    },
    widht45:{
        width:"45%"
    },
    width5:{
        width:"5%",
    },
    row:{
        flexDirection:"row",
        marginBottom:10
    },
    textleft:{
        fontFamily:fonts.mullishmedium,
        fontSize:18,
        textAlign:"center"
    },
    textcenter:{
        fontFamily:fonts.mullishmedium,
        fontSize:18,
        textAlign:"center"
    },
    textright:{
        fontFamily:fonts.mullishmedium,
        fontSize:18,
        textAlign:"center"
    }
})