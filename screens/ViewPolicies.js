import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL, IMAGE_URL } from '../utils/constants';
import { openURL } from 'expo-linking';

export default function ViewPolicies() {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    FetchLoginLogs();
  }, []);

  function FetchLoginLogs(){
    fetch(BASIC_URL + 'fetch_policies.php')
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  }
  

  const handleSearch = (text) => {
    const lowerText = text.toLowerCase(); 
    setSearchQuery(text);
    const filteredData = allData.filter((item) => {
      const lowerName = item.name_used.toLowerCase(); // Convert data to lowercase for comparison
      const lowerDate = item.date.toLowerCase();
      return (
        lowerName.includes(lowerText) || // Filter by firstname
        lowerDate.includes(lowerText) // Filter by position
      );
    });
    setData(filteredData); // Update the displayed data
  };

  const downloadFile = (filepath) => {
    const itempath = filepath.substring(6);
    const finalpath = IMAGE_URL + itempath;
    Linking.openURL(finalpath)
      .then(() => console.log('File opened successfully'))
      .catch((error) => console.error('Error opening file:', error));
  };

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 10 }}>
      <Text style={{fontFamily:fonts.mullishbold}}>Uploaded By: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.created_by}</Text></Text>
      <Text style={{fontFamily:fonts.mullishbold}}>File Name: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.file_path.substring(37)}</Text></Text>
      <Text style={{fontFamily:fonts.mullishbold}}>Time: <Text style={{fontWeight:"normal",fontFamily:fonts.mullishregular}}>{item.created_at}</Text></Text>
      <TouchableOpacity style={styles.btn} onPress={() => downloadFile(item.file_path)}>
        <Text style={styles.btntext}>Download File</Text>
      </TouchableOpacity>
    </View>
  );  

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Search By Name"
        style={styles.input}
        onChangeText={(text) => handleSearch(text)}
        value={searchQuery}
      />
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </ScrollView>
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