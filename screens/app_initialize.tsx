import React from "react"
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../components/hooks/useAuth';
import { NavigationProp, useNavigation } from '@react-navigation/native';


export default function AppInit() {
  const safeAreaInsets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const animValue = useRef(new Animated.Value(0)).current;
  const { token } = useAuth();
  const navigate = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    //wait for token to load
    if (token !== undefined) {
      setIsLoading(false);
    }
    
  }, [token])

  useEffect(() => {
    let animation = null;
    if (isLoading) {
        //loading animation
        animation = Animated.loop(
            Animated.timing(animValue, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
            })
        );
        animation.start()
        }

    return () => {
      if (animation) {
        animation.stop();
      }
    }
  }, [isLoading, animValue])

  useEffect(() => {
    if (!isLoading) {
        if (token) {
        navigate.navigate("Home")
        }
        else {
        navigate.navigate("PreScreen")
        }
    }
  }, [isLoading])

  const scale = animValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0.8, 1, 1, 1, 0.5]
    });

    const borderRadius = animValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [999, 9, 0, 9, 9]
    });

    const backgroundColor = animValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: ['blue', 'red', 'green', 'yellow', 'cyan']
    });

    return (
    <View style={contentStyles.container}>
            <Animated.View style={[contentStyles.shape, {
              transform: [{ scale }],
              borderRadius: borderRadius,
              backgroundColor: backgroundColor
            }
          ]}></Animated.View>

    </View>)
  }

  const contentStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B1A7E7'
  },
  shape: {
    width: 100,
    height: 100,
  }
});