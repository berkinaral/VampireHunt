/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigation/AppNavigator';

function App(): JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a1a2e"
      />
      <AppNavigator />
    </>
  );
}

export default App;
