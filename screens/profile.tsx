import React from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useAuth } from "../components/hooks/useAuth"

export default function Profile() {
    const { Logout } = useAuth()
    
    return (
        <ScrollView className="flex-1 bg-white">
            <View className="items-center pt-8 pb-4 border-b border-gray-200">
                {/* Profile Picture Placeholder */}
                <View className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
                <Text className="text-2xl font-bold mb-1">Username</Text>
                <Text className="text-gray-500">user@example.com</Text>
            </View>
            
            <View className="px-4 py-6">
                {/* Stats Section */}
                <View className="flex-row justify-around mb-6 py-4 bg-gray-50 rounded-lg">
                    <View className="items-center">
                        <Text className="text-2xl font-bold">0</Text>
                        <Text className="text-gray-500 text-sm">Books Read</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold">0</Text>
                        <Text className="text-gray-500 text-sm">Pages</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold">0</Text>
                        <Text className="text-gray-500 text-sm">Hours</Text>
                    </View>
                </View>
                
                {/* Menu Options */}
                <View className="space-y-2">
                    <TouchableOpacity className="py-4 px-4 bg-gray-50 rounded-lg mb-2">
                        <Text className="text-base">Edit Profile</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="py-4 px-4 bg-gray-50 rounded-lg mb-2">
                        <Text className="text-base">Reading History</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="py-4 px-4 bg-gray-50 rounded-lg mb-2">
                        <Text className="text-base">Favorites</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="py-4 px-4 bg-gray-50 rounded-lg mb-2">
                        <Text className="text-base">Settings</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="py-4 px-4 bg-gray-50 rounded-lg mb-2">
                        <Text className="text-base">Help & Support</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="py-4 px-4 bg-red-50 rounded-lg mt-4"
                        onPress={Logout}
                    >
                        <Text className="text-base text-red-600 font-semibold">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}