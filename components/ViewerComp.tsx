import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import { Itemizer} from "./BaseTypes";
import {api} from "../scripts/api"

//serves as the main layout for a short form content viewer
//loaded for every member of flatlist
export default function ViewerComponent(props: Itemizer) {
    const [pages, setPages] = useState(props.content); // array of pages
    //fit to width

    const page_count = props.page_count;
    const [currentPage, setCurrentPage] = useState(props.current_page || 1);

    const handleScroll = async (event: any) => {
        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        
        // Calculate which page is in view
        let pageNum = 1;
        let accumulatedHeight = 0;
        
        for (let i = 0; i < pages.length; i++) {
            accumulatedHeight += pages[i].height;
            if (contentOffsetY + scrollViewHeight / 2 < accumulatedHeight) {
                pageNum = i + currentPage;
                break;
            }
        }
        setCurrentPage(pageNum);

        if (contentOffsetY + scrollViewHeight >= 0.9 * accumulatedHeight) {
            const response = await api.get('/', {responseType: "json"});
                if (response && response.status === 200) {
                    const json = response.data
                    setPages(json.content)
                    setCurrentPage(json.current_page || 1)
                }
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View className="flex flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex flex-row items-center space-x-2">
                    <Ionicons name="eye-outline" size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-600">0</Text>
                </View>
                <TouchableOpacity className="flex flex-row items-center space-x-2" onPress={() => {}}>
                    <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-600">Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="heart-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Content area with pages */}
            <ScrollView 
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={100}
            >
                {pages.map((page : any, idx : number) => (
                    <Image
                        key={idx}
                        source={{ uri: page.canvas_data }}
                        style={{
                            width: page.width,
                            height: page.height,
                            marginBottom: 8,
                        }}
                    />
                ))}
            </ScrollView>

            {/* Footer with page indicator */}
            <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <Text className="text-center text-sm text-gray-500">
                    Page {currentPage} of {page_count}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
});