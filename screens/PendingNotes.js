import { Image, ScrollView, Text, View,FlatList, StyleSheet } from "react-native";
import { Colors, fonts } from "../utils/styles";

export default function PendingNotes(){
    const tasks = [
        { id: '1', text: 'Put Clothes For Tom',image:"" },
        { id: '2', text: 'Remind Tom to Wash Hair',image:"" },
        { id: '3', text: 'Rememebr to give tablets',image:"" },
        { id: '4', text: 'Door entry is the back',image:"" },
        { id: '5', text: 'Please tidy the kitchen',image:"" },
        { id: '6', text: 'He has shower today',image:"" },
        { id: '7', text: 'Please Find His Cream as shown in the picture',image:"../assets/help.png" },
      ];

      const renderItem = ({ item }) => (
        <View>
        <Text style={styles.tasktext}>{item.id}) {item.text}</Text>
        {item.image&&(
            <Image source={require('../assets/help.png')} style={{width:50,height:50,marginLeft:20,marginTop:10}}/>
        )}
        </View>
      );
    return(
        <ScrollView style={styles.container}>
            <View style={styles.task}>
                <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
                </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
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
        paddingVertical:5,
        paddingHorizontal:10,
        marginTop:10,
        borderColor:Colors.Primary,
    },
    tasktext:{
        fontFamily:fonts.mullishbold,
        fontSize:17,
        color:Colors.Primary
    }
})