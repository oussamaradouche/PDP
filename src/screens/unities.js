import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

const unities = {
  fullWidth: width,
  fullHeight: height,
  cameraHeight: height * 0.6,
  topSection: height * 0.2,
  bottomSection: height * 0.2,
};
export default unities;
