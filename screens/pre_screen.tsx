import { useEffect, useState } from "react"
import { View, Text } from "react-native"


//animate logo for 5 seconds before transition to login
export default function PreScreen() {
    useEffect(()=>{
        
    }, [])
    return(
    <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    )
}