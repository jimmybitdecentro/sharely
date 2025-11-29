import { images } from "../../../theme/images";
import { s } from "../../../theme/size";
import { Image, Platform } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

const IVLogo = ({mt = 0}: {mt?: number}) => {
  const { theme } = useTheme();
  return (
    <Image
     source={images.logo} 
     style={{ width: 130, paddingStart: theme.spacing.lg,
       resizeMode: 'contain', marginTop: Platform.OS === 'android' ? s(40) : 0 }} />
  );
};

export default IVLogo;