import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = width < height ? 393 : 852;
const aspectRatio = width / height;
const aspectCompare = aspectRatio / 2.1635514;
let scale1: (size: number) => number;
if (aspectCompare > 1) {
  const widthNew = height * (width < height ? 0.4613733905 : 2.1674418);
  const aspect = widthNew / (width < height ? 393 : 852);
  scale1 = (size: number): number => aspect * size;
} else {
  scale1 = (size: number): number => (width / guidelineBaseWidth) * size;
}
const scale = scale1;
export { scale as s };
