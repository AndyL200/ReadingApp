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
import PreScreen from './screens/pre_screen.tsx';
import "./global.css"
import { useContext, useEffect, useState } from 'react';
import HomeScreen from './screens/home.tsx';
import { useAuth } from  './components/hooks/useAuth.jsx';
import Animated, { CSSAnimationKeyframes } from 'react-native-reanimated';


const styles = StyleSheet.create({
  font: {
    fontFamily: "System",
  },
});

const Loading : CSSAnimationKeyframes = {
  "0%" : {
    
    borderRadius: 999,
    backgroundColor: "blue",
    transform: [{scale: 0.8}, {translateX: -150}, {rotateZ: "-180deg"}]
  },
  "25%" : {
   
    borderRadius: 9,
    backgroundColor: "red",
    transform: [{scaleX: 1.5}, {scaleY: 0.5}, {translateX: -150}, {rotateZ: "-180deg"}]
  },
  "50%": {
    
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'green',
    borderRadius: 0,
    transform: [{translateX: -150}, {rotateZ: "-180deg"}]
  },
  "75%": {
    
    backgroundColor: "yellow",
    transform: [{translateX: -150}, {rotateZ: "-180deg"}]
  },
  "100%": {
    
    borderRadius: 9,
    backgroundColor: "cyan",
    transform: [{scaleX: 0.5}, {scaleY: 1.5}, {translateX: -150}, {rotateZ: "-180deg"}]
  }
}

function App() {
  
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent style={styles.font}/>
      <Layout/>
    </SafeAreaProvider>
  );
}

function AppContent({style} : {style: any}) {
  const safeAreaInsets = useSafeAreaInsets();
  const {token} = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    //wait for token to load
    if (token !== undefined) {
      setIsLoading(false);
    }
    
  }, [token])

  useEffect(() => {
    while(isLoading) {
      //loading animation
    }
  }, [isLoading])
  if (!isLoading) {
  if (token) {
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
  else {
    //Loading
    //TODO() add loading animation
    return (
    <View className="flex flex-row items-center justify-center bg-[#B1A7E7]">
            <Animated.View className="flex-1 w-md h-md" style={{
              animationName: Loading,
              animationDuration: '4s',
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate"
            }}></Animated.View>

    </View>)
  }
}



export default App;
