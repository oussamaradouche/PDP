import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { storage } from '../components/utils'

const genCsv = (data) => {
	let csv = "Nom,Note\n";
	for (let i = 0; i < data.length; i++) {
		csv += `${data[i].student_id},${data[i].grade}\n`;
	}
	const filename = FileSystem.documentDirectory + "Notes.csv";

	FileSystem.writeAsStringAsync(filename, csv).then(() => {
		// save file in fileSystem
		Sharing.shareAsync(filename);
	}
	);
};

const GradesScreen = ({ route, navigation }) => {
	console.log("routee", route);
	const navigationData = route.params?.initialData;
	const [data, setData] = useState(JSON.parse(storage.getString('data')));

	useEffect(() => {
		// This effect listens for navigation param changes and reloads data accordingly

		console.log("Reloading data due to navigation param...");


	}, [route.name]);

	useEffect(() => {
		console.log("storage: ", storage.getString('data'));
		setData(JSON.parse(storage.getString('data')));
	}, []);
	useEffect(() => {
		setData(JSON.parse(storage.getString('data')));
	}, [storage]);

	const [editedStudentId, setEditedStudentId] = useState('');
	const [editedGrade, setEditedGrade] = useState('');
	const [selectedId, setSelectedId] = useState(null);

	const Edit = (id, student_id, grade) => {

		setEditedStudentId(student_id.toString());
		setEditedGrade(grade.toString());
		setSelectedId(id);
	};

	const Save = () => {
		let updatedItem = { id: selectedId, student_id: editedStudentId, grade: editedGrade }
		const parsedData = storage.getString('data') ? JSON.parse(storage.getString('data')) : [];
		const index = parsedData.findIndex((item) => item.id === selectedId);
		if (index !== -1) {
			parsedData[index] = updatedItem;
			storage.set('data', JSON.stringify(parsedData));
		}
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

	const renderItem = ({ item }) => {
		console.log("Student ID:", item.student_id);
		console.log("Grade:", item.grade);

		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20 }}>
				<View style={styles.rowItem}>
					{selectedId === item.id ? (
						<>
							<TextInput
								value={editedStudentId || item.student_id.toString()}
								onChangeText={setEditedStudentId}
								style={{ borderBottomWidth: 1, borderColor: '#ccc', width: 80, textAlign: 'center' }}
							/>
							<TextInput
								value={editedGrade || item.grade.toString()}
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
	};



	const Delete = (id) => {
		const parsedData = storage.getString('data') ? JSON.parse(storage.getString('data')) : [];
		const index = parsedData.findIndex((item) => item.id === id);
		if (index !== -1) {
			parsedData.splice(index, 1);
			storage.set('data', JSON.stringify(parsedData));
		}
		setData(prevData => prevData.filter(item => item.id !== id));
	};

	return (
		<View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
			<View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-around' }}>
				<Text style={{ fontWeight: "bold", color: "#48BAB8" }}>Numéro</Text>
				<Text style={{ fontWeight: "bold", color: "#48BAB8" }}>Note</Text>
			</View>

			<FlatList
				data={JSON.parse(storage.getString('data'))}
				renderItem={renderItem}
				keyExtractor={item => (item.id || 'default_id').toString()}
				ListEmptyComponent={() => <Text>No data found</Text>}
			/>

			<Button title="Générer Csv" onPress={() => genCsv(JSON.parse(storage.getString('data')))} style={styles.button} />
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
