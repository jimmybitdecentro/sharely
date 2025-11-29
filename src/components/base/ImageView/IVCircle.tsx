import { images } from "../../../theme/images";
import { s } from "../../../theme/size";
import { Image, ImageSourcePropType, ImageURISource, Platform, ImageStyle, ViewStyle, View, TouchableOpacity } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
interface IVCircleProps {
  size?: number;
  mb?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  src?: ImageSourcePropType | ImageURISource;
  padding?: number;
  source?: ImageSourcePropType | ImageURISource;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  style?: ImageStyle | ViewStyle;
  onPress?: () => void;
}
const IVCircle = ({ size = 40, mb = 0, mt = 0, ml = 0, mr = 0, padding = 0,
   src = images.logo, onPress }: IVCircleProps
) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[ {
      width: size, height: size,
      marginBottom: mb ? s(mb) : 0,
      marginTop: mt ? s(mt) : 0,
      marginLeft: ml ? s(ml) : 0,
      marginRight: mr ? s(mr) : 0,
      padding: padding ? s(padding) : 0,
    }]}> <Image
        source={src}
        style={[ {
          width: size, height: size,
          resizeMode: 'contain', 
        }]} />
    </TouchableOpacity>
  );
};

export default IVCircle;