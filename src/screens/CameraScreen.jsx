import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Icon, useTheme } from 'react-native-paper';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import unities from './unities';
import TextRecognition from '@thoguet/react-native-text-recognition';
import { storage } from '../components/utils'

const CameraScreen = ({ route, navigation }) => {
	const theme = useTheme();
	const { hasPermission, requestPermission } = useCameraPermission();
	const device = useCameraDevice('back');
	const [expanded, setExpanded] = useState(false);
	const handlePress = () => setExpanded(!expanded);
	const camera = useRef(null);
	const [recognizedText, setRecognizedText] = useState('');
	const [recognizedId, setRecognizedId] = useState('');
	const [photo, setPhoto] = useState(null);
	// const [studentId, setStudentId] = useState('');
	// const [grade, setGrade] = useState('');
	const [data, setData] = useState([]);

	

	//////////////////////////////////////////////////////////////////
	const codeScanner = useCodeScanner({
		codeTypes: ['qr', 'ean-13', 'code-128'],
		onCodeScanned: (codes) => {
			//console.log(`Scanned ${codes.length} codes!`);
			setRecognizedId(codes[0].value)
		}
	})
	//////////////////////////////////////////////////////////////////
	const extractNoteFromText = (text) => {
		// This regex looks for the string "note:" followed by any number of spaces and then two digits
		const regex = /Note:\s*(\d{1,2}(,\d{1,2})?)/i;
		const matches = text.match(regex);

		if (matches && matches.length > 1) {
			// matches[1] contains the first capturing group, which are the digits we're interested in
			return matches[1];
		} else {
			// If no match is found, return a default value or null
			return null;
		}
	};
	///////////////////////////////////////////////////////////////////
	const onTakePicturePress = async () => {
		if (camera.current) {
			const options = { quality: 0.5, base64: true };
			const capturedPhoto = await camera.current.takePhoto(options);
			setPhoto({ path: capturedPhoto.path });
			console.log('Picture taken at:', capturedPhoto.path);
		}
	};
	///////////////////////////////////////////////////////////////////
	useEffect(() => {
		if (photo?.path) {
			console.log('Photo state updated, calling handleOCR...');
			handleOCR();
		}
	}, [photo]);
	///////////////////////////////////////////////////////////////////
	const handleOCR = async () => {
		if (photo?.path) {
			try {
				const result = await TextRecognition.recognize(photo.path);
				console.log('OCR Result:', result);

				// Assuming result is an array of recognized strings
				const recognizedText = result.join(' ');
				const note = extractNoteFromText(recognizedText);

				if (note !== null) {
					console.log('Note found:', note);
					setRecognizedText(`${note}`);
				} else {
					console.log('No note found in the recognized text.');
					setRecognizedText('No note found');
				}
			} catch (error) {
				console.error('OCR Error:', error);
				setRecognizedText('OCR failed');
			}
		} else {
			console.log('No photo to process for OCR');
			setRecognizedText('No photo available');
		}
	};


	/////////////////////////////////////////////////
	const Save = async () => {
		const newData = {
			id: Math.random().toString(),
			student_id: recognizedId,
			grade: recognizedText
		};
		if (recognizedText !== 'No note found') {
			let parsedData = storage.getString('data') ? JSON.parse(storage.getString('data')) : [];

			parsedData.push(newData);

			// Assuming storage.set is async or returns a Promise
			await storage.set('data', JSON.stringify(parsedData)); // Make sure this operation is awaited

			// Reset local state after saving
			setRecognizedId('');
			setRecognizedText('');

			// Navigate and ensure GradesScreen reloads data
			navigation.navigate('Grades', {
				initialData: JSON.stringify(parsedData),
				reloadData: true // This is a hypothetical prop to signal data reload
			});
			console.log('parsedDat', parsedData)
		}


	};


	///////////////////////////////////////////////////////
	useEffect(() => {
		if (!hasPermission) {
			requestPermission();
		}
	}, [hasPermission]);
	/////////////////////////////////////////////////////
	if (!hasPermission) {
		return <ActivityIndicator />;
	}
	if (!device) {
		return <Text>Camera device not found</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.topSection}>
				<View style={styles.infoBox}>
					<Text style={styles.infoText}>Numéro :{recognizedId}</Text>
					<Text style={styles.infoText}>Note :{recognizedText}</Text>
				</View>
				
			</View>
			<Camera
				ref={camera}
				style={styles.camera}
				device={device}
				isActive={true}
				photo={true}
				codeScanner={codeScanner}
			/>
			<View style={styles.bottomSection}>
  <View style={{flex: 1}}></View> 
  <Pressable
    onPress={onTakePicturePress}
    style={styles.captureButton}>
   
  </Pressable>
  <View style={{flex: 1}}></View> 
  <TouchableOpacity onPress={Save} style={styles.saveButton}>
    <Icon name="save" size={20} color="#FFF" />
    <Text style={{color: '#FFF', marginLeft: 8}}>Save</Text>
  </TouchableOpacity>
  <View style={{flex: 0.1}}></View> 
  </View>

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: "#FAFBFF",
	},
	topSection: {
		height: unities.topSection,
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 10,
		paddingHorizontal: 10,
	},
	infoBox: {
		height: 80,
		width: 170,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#48BAB8",
		paddingLeft: 20,
		justifyContent: 'space-around',
		paddingVertical: 10,
	},
	infoText: {
		color: '#48BAB8',
	},
	camera: {
		height: unities.cameraHeight,
		width: unities.fullWidth,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bottomSection: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  height: unities.bottomSection,
  paddingBottom: 50,
  position: 'relative',
},

captureButton: {
  backgroundColor: 'white',
  width: 65,
  height: 65,
  borderRadius: 75,
  borderWidth: 2,
  position: 'absolute', 
  left: '50%',
  top: '50%', 
  transform: [{ translateX: -32.5 }, { translateY: -32.5 }], 
},
saveButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#48BAB8', 
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 20,
  marginLeft:-500
  
},


});

export default CameraScreen;
