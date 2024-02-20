import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const HomeScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);
  if (!hasPermission) {
    return <ActivityIndicator />
  }
  if (!device) {
    return <Text>Camera device not found</Text>
  }
  return (
    <View style={styles.container}>
      <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:500,
  },
});

export default HomeScreen;
