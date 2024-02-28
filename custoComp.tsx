import {
StyleSheet,
Dimensions,
TouchableOpacity,
Text} from 'react-native';
import { stylesGlob } from "./style";

export const CButton = ({ text,onPress,style }) => {
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <Text style={stylesGlob.buttonTextStyle}>{text}</Text>
      </TouchableOpacity>
    );
  };