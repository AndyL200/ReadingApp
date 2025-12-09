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


const styles = StyleSheet.create({
  font: {
    fontFamily: "System",
  },
});


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  {/*
  const authContext = useContext()
  useEffect(()=>{
    if(authContext ...) {
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
  }, [authContext])
  
  */}

  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent style={styles.font} isAuthenticated={isAuthenticated}/>
      <Layout/>
    </SafeAreaProvider>
  );
}

function AppContent({style, isAuthenticated} : {style: any, isAuthenticated : boolean}) {
  const safeAreaInsets = useSafeAreaInsets();
  if(isAuthenticated)
  {
  return (
    <View style={style} className="flex-1">
      <HomeScreen/>
    </View>
  );
  }
  else {
    return (
    <View style={style} className="flex-1">
      <PreScreen/>
    </View>
    )
  }
}



export default App;
