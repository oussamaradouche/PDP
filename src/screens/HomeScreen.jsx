import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  

  return (
    <View style={styles.container}>
      <Text>Welcome to Home Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    flex: 1,
    width: '100%',
  },
});

export default HomeScreen;
