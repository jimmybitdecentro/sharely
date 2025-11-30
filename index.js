/**
 * @format
 */

// Disable console logs in simulator (for now)
console.log = () => {};
console.warn = () => {};
console.error = () => {};
console.info = () => {};
console.debug = () => {};

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
