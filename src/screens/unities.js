import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

const unities = {
  fullWidth: width,
  fullHeight: height,
  fullHeight2: height * 0.8667,
  cameraHeight: height * 0.7,
};
export default unities;
