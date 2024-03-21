import React, { useState } from 'react';
import { StyleSheet, Button, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GradesScreen = ({ route }) => {
    const data = route?.params?.data || []; 
    const genExcel = (data) => {
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Feuille de notes", true);
    const base64 = XLSX.write(workbook, { type: "base64" });
    const filename = FileSystem.documentDirectory + "Notes.xlsx";

    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };


  const [editedStudentId, setEditedStudentId] = useState('');
  const [editedGrade, setEditedGrade] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const Edit = (id, student_id, grade) => {
    setEditedStudentId(student_id.toString());
    setEditedGrade(grade.toString());
    setSelectedId(id);
  };

  const Save = () => {
    setData(prevData => {
      return prevData.map(item => {
        if (item.id === selectedId) {
          return { ...item, student_id: editedStudentId, grade: editedGrade };
        }
        return item;
      });
    });
    setEditedStudentId('');
    setEditedGrade('');
    setSelectedId(null);
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20 }}>
      <View style={styles.rowItem}>
        {selectedId === item.id ? (
          <>
            <TextInput
              value={editedStudentId}
              onChangeText={setEditedStudentId}
              style={{ borderBottomWidth: 1, borderColor: '#ccc', width: 80, textAlign: 'center' }}
            />
            <TextInput
              value={editedGrade}
              onChangeText={setEditedGrade}
              style={{ borderBottomWidth: 1, borderColor: '#ccc', width: 80, textAlign: 'center' }}
            />
          </>
        ) : (
          <>
            <Text>{item.student_id}</Text>
            <Text>{item.grade}</Text>
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {selectedId === item.id ? (
          <TouchableOpacity onPress={Save}>
            <Icon name="check" size={20} color="#48BAB8" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => Edit(item.id, item.student_id, item.grade)}>
            <Icon name="pencil" size={20} color="#48BAB8" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => Delete(item.id)}>
          <Icon name="delete" size={20} color="#48BAB8" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const Delete = (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-around' }}>
        <Text style={{ fontWeight: "bold", color: "#48BAB8" }}>Numéro</Text>
        <Text style={{ fontWeight: "bold", color: "#48BAB8" }}>Note</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => (item.id || 'default_id').toString()}
      />

      <Button title="Générer Excel" onPress={() => genExcel(data)} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '50%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'blue',
    marginVertical: 20,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: 240,
    paddingLeft: 68
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 60
  },
});

export default GradesScreen;
