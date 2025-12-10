import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { View, Text } from "react-native"
import Animated, {CSSAnimationKeyframes} from "react-native-reanimated"

//circle, rect-wide, triangle, square, rect-tall
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
//animate logo for 5 seconds before transition to login
export default function PreScreen() {
    const navigate = useNavigation<NavigationProp<any>>()
    useEffect(()=>{
        const timer = setTimeout(() => {
          //navigate to login screen
          navigate.navigate("Login")
        }, 5000)

        return () => clearTimeout(timer)
    }, [])
    return(
      <View className="flex flex-row items-center justify-center bg-[#B1A7E7]">
        <Animated.View className="flex-1 w-md h-md" style={{
          animationName: Loading,
          animationDuration: '4s',
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection: "alternate"
        }}>

        </Animated.View>
    <Text className="flex-1 text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      </View>
    )
}