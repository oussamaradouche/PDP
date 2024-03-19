import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import Tesseract from 'tesseract.js';
import unities from './unities';


const CameraScreen = () => {
  const theme = useTheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);
  const camera = useRef(null); 
  const [recognizedText, setRecognizedText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [data, setData] = useState('scan');

  const codeScanner = useCodeScanner({
  codeTypes: ['qr', 'ean-13','code-128'],
  onCodeScanned: (codes) => {
    //console.log(`Scanned ${codes.length} codes!`);
    setRecognizedText(codes[0].value)
  }
})

  const onTakePicturePress = async () => {
    const capturedPhoto = await camera.current.takePhoto();
    setPhoto(capturedPhoto);
    console.log('picture taken');
    //handleOCR();
    console.log(photo.path);
    console.log('ocr called');
  };

  /*const handleOCR = async () => {
    console.log('in handleOCR');
    // there will always be an image to extract digits from
    const imageUri = photo.path;
    console.log('imageuri:', imageUri);
    const extractDigits = await Tesseract.recognize(imageUri); 
    console.log('uri:',photo)
    setRecognizedText(extractDigits);
    
  };*/




  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);
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
          <Text style={styles.infoText}>Numéro :{recognizedText}</Text>
          <Text style={styles.infoText}>Note :</Text>
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
          style={{ position: 'absolute', backgroundColor: 'white', width: 65, height: 65, marginTop: 20, borderRadius: 75 }}
        />
        <Text>text : { recognizedText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: "#FAFBFF",
  },
  topSection: {
    height: unities.topSection,
    backgroundColor: 'yellow',
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
    borderWidth: 100,
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    height: unities.bottomSection,
    backgroundColor: 'purple',
    alignItems: 'center'
  },
});

export default CameraScreen;
