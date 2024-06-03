import { Image, ScrollView, StyleSheet, View, Text } from "react-native";
import { fonts } from "../utils/styles";

export default function Messages(){
    return(
        <ScrollView style={styles.container}>
            <View style={styles.noviewcontainer}>
                <Image source={require('../assets/mesage.png')} style={styles.image}/>
                <Text style={styles.textnoview}>No Messages Found</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
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
    }
})