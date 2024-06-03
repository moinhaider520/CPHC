import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
export default function ViewIncidentInvestigations() {
  const navigation = useNavigation();
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(BASIC_URL + 'fetch-incident-investigations.php')
      .then((response) => response.json())
      .then((data) => {
        setAllData(data.incident_investigations); // Store all the data
        setData(data.incident_investigations); // Initially, set data to all the data
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearch = (text) => {
    // Update the search query and filter the data based on it
    const lowerText = text.toLowerCase(); // Convert the search query to lowercase
    setSearchQuery(text);
    const filteredData = allData.filter((item) => {
      const lowerName = item.date.toLowerCase(); // Convert data to lowercase for comparison
      return (
        lowerName.includes(lowerText)
      );
    });
    setData(filteredData); // Update the displayed data
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}
    onPress={()=>navigation.navigate('AddIncidentActionPlan',{incidentID: item.id})}
    >
      <Text style={{fontWeight:"bold"}}>Date & Time: <Text style={{fontWeight:"normal"}}>{item.date_of_investigation} - {item.time}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Investigator: <Text style={{fontWeight:"normal"}}>{item.investigator_name}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Investigation Location: <Text style={{fontWeight:"normal"}}>{item.location}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Result: <Text style={{fontWeight:"normal"}}>{item.result_of_investigation}</Text></Text>
      <Text style={{fontWeight:"bold"}}>Recommendations: <Text style={{fontWeight:"normal"}}>{item.investigation_recommendations}</Text></Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search By Date"
        style={styles.input}
        onChangeText={(text) => handleSearch(text)}
        value={searchQuery}
      />
      {data.length > 0 ? (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      ):(
        <Text style={{textAlign:"center",fontSize:20,fontFamily:fonts.mullishmedium}}>No Incident Investigation Found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
  },
  input: {
    borderWidth: 0.3,
    paddingVertical: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    fontFamily: fonts.mullishregular,
    borderRadius: 2,
    borderColor: Colors.GrayBoder1,
    fontSize: 16,
  },
  btn:{
      backgroundColor:Colors.Primary,
      borderRadius:10,
      paddingVertical:15,
      justifyContent:"center",
      marginBottom:15,
      marginTop:10
  },
  btntext:{
      textAlign:"center",
      color:"#fff",
      fontSize:18,
      fontFamily:fonts.mullishsemibold
  }
});