import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import unities from './unities';
import TextRecognition from 'react-native-text-recognition';

const CameraScreen = ({ navigation }) => {
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
  codeTypes: ['qr', 'ean-13','code-128'],
  onCodeScanned: (codes) => {
    //console.log(`Scanned ${codes.length} codes!`);
    setRecognizedId(codes[0].value)
  }
  })
  //////////////////////////////////////////////////////////////////
  const extractNoteFromText = (text) => {
  // This regex looks for the string "note:" followed by any number of spaces and then two digits
  const regex = /Note:\s*(\d{2})/i; 
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
  const Save = () => {
    const newData = {
      id: data.length + 1, 
      student_id: recognizedText,
      grade: 15
    };

    setData(prevData => [...prevData, newData]);

    setRecognizedId('');

  };

////////////////////////////////////////////////
  useEffect(() => {
  if (data.length > 0) {
    sendDataToGradesScreen();
  }
  }, [data]);
  
///////////////////////////////////////////////////////////
  const sendDataToGradesScreen = () => {

    navigation.navigate('Grades', { data: data });
  };
///////////////////////////////////////////////////////////
  const saveAndSend = () => {
    Save();
    sendDataToGradesScreen();
  }
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
        <List.Section>
          <List.Accordion
            style={{ backgroundColor: "white", borderColor: theme.colors.primary, borderWidth: 1,width:100,height:60}}
            rippleColor={theme.colors.primary}
            left={props => <List.Icon {...props} icon="camera" />}
            expanded={expanded}
            onPress={handlePress}>
            <List.Item
              style={{backgroundColor:"white"}}
              left={() => <List.Icon icon="video" />}
            />
          </List.Accordion>
        </List.Section>
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
  
    <Pressable
      onPress={onTakePicturePress}
      style={{
        backgroundColor: 'white',
        width: 65,
        height: 65,
        borderRadius: 75,
        borderWidth: 2,
        
        
      }}
        />
        <View style={{paddingLeft:20}}>
          <Button title="Save" onPress={saveAndSend}  />
        </View>
        

  
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
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center',
    height: unities.bottomSection,
    paddingBottom:50
  },
 
  
});

export default CameraScreen;
