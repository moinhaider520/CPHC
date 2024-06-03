import {ScrollView, StyleSheet,View,Text,TouchableOpacity} from "react-native";
import { Image } from "react-native";
import { Colors, fonts } from "../utils/styles";
import { useNavigation } from "@react-navigation/native";
export default function Incidents(){
    const navigation = useNavigation();

    return(
        <ScrollView style={styles.container}>
            <View style={styles.divider}/>
            <View style={styles.cardcontainers}>
                <View style={styles.row}>
                    <View style={styles.width50}>
                        <TouchableOpacity style={styles.card}
                        onPress={()=>navigation.navigate('AddIncidentReport')}
                        >
                        <Image source={require('../assets/addnotes.png')} style={styles.cardimage}/>
                            <Text style={styles.cardtext}>Add Incident Report</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.width50}>
                        <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('ViewIncidentReports')}>
                        <Image source={require('../assets/askquestion.png')} style={styles.cardimage}/>
                            <Text style={styles.cardtext}>Incident Reports</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.width50}>
                        <TouchableOpacity style={styles.card}
                        onPress={()=>navigation.navigate('ViewIncidentInvestigations')}
                        >
                        <Image source={require('../assets/askquestion.png')} style={styles.cardimage}/>
                            <Text style={styles.cardtext}>Investigations</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.width50}>
                        <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('ViewIncidentActionPlans')}>
                        <Image source={require('../assets/askquestion.png')} style={styles.cardimage}/>
                            <Text style={styles.cardtext}>Action Plans</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:"5%",
    },
    headercontainer:{
        paddingVertical:0
    },
    mainmenu:{
        fontSize:22,
        fontFamily:fonts.mullishbold
    },
    row:{
        flexDirection:"row"
    },
    width25:{
        width:"25%"
    },
    width50:{
        width:"50%"
    },
    userimage:{
        width:"80%",
        height:60,
        alignSelf:"center",
        borderRadius:10,
    },
    name:{
        fontFamily:fonts.mullishregular
    },
    welcometext:{
        fontFamily:fonts.mullishregular
    },
    notificationbutton:{
        alignSelf:"flex-end",
        justifyContent:"center",
        height:50,
        elevation:5,
        backgroundColor:"#fff",
        paddingHorizontal:10,
        marginTop:5,
        borderRadius:10
    },
    notificationicon:{
        color:Colors.Primary,
        fontSize:28
    },
    divider:{
        borderWidth:0.3,
        marginHorizontal:5,
        borderColor:Colors.GrayBoder
    },
    card:{
        width:"95%",
        alignSelf:"center",
        justifyContent:"center",
        backgroundColor:"#fff",
        elevation:5,
        alignContent:"center",
        alignItems:"center",
        paddingVertical:30,
        borderRadius:10,
        marginTop:15
    },
    cardimage:{
        width:70,
        height:70
    },
    cardtext:{
        fontFamily:fonts.mullishmedium,
        fontSize:14,
        textAlign:"center",
        marginHorizontal:5,
        marginTop:10
    },
    cardcontainers:{
        marginTop:5,
        marginBottom:50
    }
})