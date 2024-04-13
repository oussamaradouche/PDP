
# INSTALL

- npm install
- go to node_modules/react-native-text-recognition/android/build.gradle and set lines 24-25 to :

```compileSdkVersion safeExtGet('TextRecognition_compileSdkVersion', 34)```

```buildToolsVersion safeExtGet('TextRecognition_buildToolsVersion', '34.0.0')```

- npx prebuild
- npx expo run:android

# Get release apk

- eas login
- eas build:configure
- eas build --platform android --local
