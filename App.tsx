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
import PreScreen from 'screens/pre_screen.tsx';
import "./global.css"
import { useContext, useEffect, useState } from 'react';
import HomeScreen from 'screens/home.tsx';





function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authContext = useContext()
  useEffect(()=>{
    if(authContext ...) {
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
  }, [authContext])
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent isAuthenticated={isAuthenticated}/>
      <Layout/>
    </SafeAreaProvider>
  );
}

function AppContent({isAuthenticated} : {isAuthenticated : boolean}) {
  const safeAreaInsets = useSafeAreaInsets();
  if(isAuthenticated)
  {
  return (
    <View style={styles.container}>
      <HomeScreen/>
    </View>
  );
  }
  else {
    <View style={styles.container}>
      <PreScreen/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
