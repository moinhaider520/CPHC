import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Colors, fonts } from '../utils/styles';
import { BASIC_URL } from '../utils/constants';
import HTML from 'react-native-render-html';
export default function ViewNotice() {
  const [allData, setAllData] = useState([]); // Store all the data
  const [data, setData] = useState([]); // Store the filtered data
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(BASIC_URL + 'fetchnoticeboard.php')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllData(data); // Store all the data
        setData(data); // Initially, set data to all the data
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

  const renderItem = ({ item }) => {
    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 }}>
        <Text style={{ fontFamily:fonts.mullishbold, color: "#ff6b81",fontSize:16 }}>Date:{item.date}, Time:{item.time}</Text>
        <HTML source={{ html: item.notice }} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={{color:Colors.Primary,fontSize:22,fontFamily:fonts.mullishbold}}>Notifications:</Text>
      <TextInput
        placeholder="Search By Date"
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