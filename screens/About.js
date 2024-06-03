import { Image, ScrollView, StyleSheet, View, Text, BackHandler } from "react-native";
import { fonts } from "../utils/styles";
import { useEffect } from "react";

export default function About(){

    return(
        <ScrollView style={styles.container}>
            {/* <View style={styles.noviewcontainer}>
                <Image source={require('../assets/icon.png')} style={styles.image}/>
                <Text style={styles.textnoview}>No Data Available in About Care Partners HC</Text>
            </View> */}
            <Text style={styles.simpletext}>
                In an era where healthcare systems are increasingly complex and demanding, Care Partners Health Care emerges as a beacon of innovation, efficiency, and compassion. This comprehensive healthcare management company is dedicated to optimizing every aspect of healthcare delivery, from managing medical staff rosters to crafting personalized care plans and conducting rigorous risk assessments.
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:10,
        paddingVertical:10
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
        marginTop:15,
        textAlign:"center"
    },
    simpletext:{
        fontFamily:fonts.mullishregular,
        fontSize:16,
        fontStyle:"normal",
        lineHeight:24,
        letterSpacing:1    
    }
})