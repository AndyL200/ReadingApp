import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import { Itemizer} from "./BaseTypes";
import {api} from "../scripts/api"

interface ViewerComponentProps extends Itemizer {
    width: number;
}
//serves as the main layout for a short form content viewer
//loaded for every member of flatlist
export default function ViewerComponent(props: ViewerComponentProps) {
    const isFetching = useRef(false);
    const [pages, setPages] = useState(props.content); // array of pages
    //fit to width
    //safety region to prevent false start
    const [bottomSafety, setBottomSafety] = useState(false);
    const [topSafety, setTopSafety] = useState(true);
    const [initialState, setInitialState] = useState(true);
    const [preMount, setPreMount] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const page_count = props.page_count;
    const [current_page, setCurrentPage] = useState(props.current_page || pages[0].pageNumber || 1);
    const pagesRef = useRef(pages);

    // Keep ref in sync
    useEffect(() => {
        pagesRef.current = pages;
    }, [pages]);

    useEffect(() => {
        setPreMount(false);
        return () => {
            if(isFetching.current) {
                isFetching.current = false
            }
        }
    }, [])
    const handleLike = async () => {

    }
    const makeComment = () => {
        //Comment functionality
    }
    const handleScroll = useCallback(async (event: any) => {
        if (preMount) return;
        // Debounce API calls
        if (isFetching.current) {
            return;
        }

        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        
        // Calculate which page is in view
        let pageNum = 1;
        let accumulatedHeight = 0;
        const curr_pages = pagesRef.current;
        
        for (let i = 0; i < curr_pages.length; i++) {
            const aspectHeight = props.width/curr_pages[i].width * curr_pages[i].height;

            accumulatedHeight += aspectHeight + 8; // 8 for marginBottom
            if (contentOffsetY + scrollViewHeight / 2 < accumulatedHeight) {
                pageNum = i + curr_pages[0].pageNumber;
                break;
            }
        }
        setCurrentPage(pageNum);
        accumulatedHeight = 0;
        for (let i = 0; i < curr_pages.length; i++) {
            const aspectHeight = props.width/curr_pages[i].width * curr_pages[i].height;
            accumulatedHeight += aspectHeight + 8; // 8 for marginBottom
        }
        
        if (initialState && contentOffsetY + scrollViewHeight > 0.3 * accumulatedHeight) {
            setInitialState(false);
            console.log("INITIAL STATE ENDED")
            return;
        }

        if (!bottomSafety && contentOffsetY + scrollViewHeight >= 0.9 * accumulatedHeight) {
            console.log("BOTTOM REACHED, FETCHING MORE")
            isFetching.current = true;
            let rangeStart = pageNum
            if(pageNum > 2) {
                rangeStart = pageNum - 2
            }
            try {
            const response = await api.get('/api/up_doc', {responseType: "json" , params: { doc_id: props.doc_id, current_page: rangeStart }});
            if (response && response.status === 200) {
                const json = response.data
                setPages(json.content)
                //setCurrentPage(json.current_page || json.content[0].pageNumber || 1)
                
            }
        }
        catch (err) {
            console.error("Failed to fetch document:", err);
        }
           //setTopSafety(true);
            setBottomSafety(true);
            isFetching.current = false;
        }
        else if (bottomSafety && contentOffsetY + scrollViewHeight < 0.9 * accumulatedHeight) {
            console.log("BOTTOM SAFETY OFF")
            setBottomSafety(false);
        }

        // if(!topSafety && (contentOffsetY + scrollViewHeight <= 0.1 * accumulatedHeight || pageNum <= curr_pages.length * 0.1)) {
        //     console.log("TOP REACHED, FETCHING MORE")
        //     isFetching.current = true;
        //     const response = await api.get('/api/less_doc', {responseType: "json" , params: { doc_id: props.doc_id, current_page: pageNum }});
        //     if (response && response.status === 200) {
        //             const json = response.data
        //             setPages(json.content)
        //             setCurrentPage(json.current_page || json.content[0].pageNumber || 1)
        //         }
        //     setTopSafety(true);
        //     isFetching.current = false;
        // }
        // else if (topSafety && contentOffsetY + scrollViewHeight > 0.1 * accumulatedHeight) {
        //     console.log("TOP SAFETY OFF")
        //     setTopSafety(false);
        // }
    }, [bottomSafety, initialState, preMount, isFetching]);
  
    return (
        <View style={styles.container}>
            {/* Header */}
            <View className="flex flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex flex-row items-center space-x-2">
                    <Ionicons name="eye-outline" size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-600">0</Text>
                </View>
                <TouchableOpacity className="flex flex-row items-center space-x-2" onPress={makeComment}>
                    <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-600">Comments</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike}>
                    <Ionicons name="heart-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Content area with pages */}
            <ScrollView 
                ref={scrollViewRef}
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={250}
            >
                {pages.map((page : any, idx : number) => {
                    const aspectHeight = props.width/page.width * page.height;
                    
                    return (
                    <Image
                        key={idx}
                        source={{ uri: page.canvas_data }}
                        style={{
                            //resize properly
                            width: props.width,
                            height: aspectHeight,
                            marginBottom: 8,
                        }}
                    />
                )})}
            </ScrollView>

            {/* Footer with page indicator */}
            <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <Text className="text-center text-sm text-gray-500">
                    Page {current_page} of {page_count}
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
        // paddingHorizontal: 16,
        // paddingVertical: 24,
    },
});