import React from "react"
import { Text, View } from "react-native"; 
import Feed from "../components/ui/Feed";
import { useAuth } from "../components/hooks/useAuth";
import { verifyInstallation } from "nativewind";

//TODO(hide opening text and replace with feed, add txt animation)
export default function HomeScreen() {
  const {} = useAuth()
  verifyInstallation()
  return (
        <View className="flex-1 items-center justify-center bg-white">
        <Feed/>
      </View>
      )
}