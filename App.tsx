/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Layout from "./components/layout.tsx"
import "./global.css"



const styles = StyleSheet.create({
  font: {
    fontFamily: "System",
  },
});


function App() {
  
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent/>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom, paddingLeft: safeAreaInsets.left, paddingRight: safeAreaInsets.right}}>
      <Layout />
    </View>
  );
}

export default App;
