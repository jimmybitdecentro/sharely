import { images } from '../../../theme/images';
import { s } from '../../../theme/size';
import { Image, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

const IVLogo = ({
  mt = 0,
  size = 130,
  src = images.logo,
}: {
  mt?: number;
  size?: number;
  src?: any;
}) => {
  const { theme } = useTheme();
  return (
    <Image
      source={images.logo}
      style={{
        width: 130,
        height: 40,
        paddingStart: theme.spacing.lg,
        resizeMode: 'contain',
        marginTop:mt
      }}
    />
  );
};

export default IVLogo;
