import React from "react"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { Animated, View, Text, Easing } from "react-native"


//circle, rect-wide, triangle, square, rect-tall

//animate logo for 5 seconds before transition to login
export default function PreScreen() {
    const navigate = useNavigation<NavigationProp<any>>()
    const animValue = new Animated.Value(0);
    useEffect(()=>{

      Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
        const timer = setTimeout(() => {
          //navigate to login screen
          navigate.navigate("Login")
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

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

    return(
      <View className="flex-1 items-center justify-center bg-[#B1A7E7]">
        <Animated.View className="w-24 h-24 mb-4" style={{
          transform: [{ scale: scale }],
          borderRadius: borderRadius,
          backgroundColor: backgroundColor
        }}>

        </Animated.View>
        <Text className="text-xl font-bold text-blue-500">
          Welcome!
        </Text>
      </View>
    )
}