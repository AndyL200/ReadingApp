import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import { Itemizer} from "./BaseTypes";

interface ViewerProps extends Itemizer {
    width: number;
}

//serves as the main layout for a short form content viewer
//loaded for every member of flatlist
export default function ViewerComponent(props: ViewerProps) {
    return (
        <View style={[styles.container, { width: props.width }]}>
            {/* Header with interactions */}
            <View className="flex flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex flex-row items-center space-x-2">
                    <Ionicons name="eye-outline" size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-600">0</Text>
                </View>
                
                <TouchableOpacity
                    className="flex flex-row items-center space-x-2"
                    onPress={() => {}}
                    accessibilityLabel="Comments"
                >
                    <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-600">Comments</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="heart-outline" size={24} color="#EF4444"/>
                </TouchableOpacity>
            </View>

            {/* Content area */}
            <ScrollView 
                className="flex-1 bg-white px-4 py-6"
                showsVerticalScrollIndicator={true}
            >
                <Text className="text-base leading-7 text-gray-800">
                    {props.content}
                </Text>
            </ScrollView>

            {/* Footer with page indicator */}
            {props.current_page && (
                <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <Text className="text-center text-sm text-gray-500">
                        Page {props.current_page} of {props.page_count}
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});