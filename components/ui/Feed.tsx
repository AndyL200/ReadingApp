import React from "react"
import { View, Text, FlatList, ActivityIndicator, Dimensions } from "react-native";
import ViewerComponent from "../../components/ViewerComp";
import { Itemizer, Deque, generateUID } from "../../components/BaseTypes";
import { useEffect, useRef, useState } from "react";
import {api} from "../../scripts/api"

const { width } = Dimensions.get('window');

//these endpoints should eventually incorporate the user profile
export default function Feed() {
    const dequeRef = useRef(new Deque<Itemizer>());
    const deque = dequeRef.current;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isFetchingMoreRef = useRef(false);
    const [, forceUpdate] = useState(0); // State to force re-render
    const flatListRef = useRef<FlatList>(null);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50, // Item is "visible" when 50% is in view
    };
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const currentIndex = viewableItems[0].index;
            
            if (currentIndex >= deque.getSize() - 2) {
                loadMoreRight();
                
            }
            
            if (currentIndex <= 1) {
                loadMoreLeft();
            }
        }
    }).current;

     // Fetch a single document
    async function fetchDocument(): Promise<Itemizer | null> {
        try {
            const response = await api.get('/', { responseType: "json"});
            if (response && response.status === 200) {
                const json = response.data;
                if (json && "doc_id" in json && "content" in json && "page_count" in json) {
                    if (typeof json.doc_id === "number" && typeof json.page_count === "number") {
                        return {
                            doc_id: json.doc_id,
                            content: json.content,
                            page_count: json.page_count,
                            current_page: json.current_page,
                            uid: generateUID()
                        };
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch document:", err);
        }
        return null;
    }

    // Load more items to the right (pushBack)
    async function loadMoreRight(batchSize: number = 3) {
        if (isFetchingMoreRef.current) return;
        isFetchingMoreRef.current = true;
        
        for (let i = 0; i < batchSize; i++) {
            const item = await fetchDocument();
            if (item) {
                deque.pushBack(item);
                deque.popFront(); // Maintain size limit
            }
        }
        forceUpdate(n => (n + 1) % 1000); // Force re-render
        isFetchingMoreRef.current = false;
    }

    // Load more items to the left (pushFront)
    async function loadMoreLeft(batchSize: number = 3) {
        if (isFetchingMoreRef.current) return;
        isFetchingMoreRef.current = true;
        
        for(let i = 0; i < batchSize; i++) {
            const item = await fetchDocument();
            if (item) {
                deque.pushFront(item);
                deque.popBack(); // Maintain size limit
            }
        }
           
            
            // Maintain scroll position after adding to front
            // flatListRef.current?.scrollToIndex({
            //     index: 1,
            //     animated: false,
            // });
        
        forceUpdate(n => (n + 1) % 1000); // Force re-render
        isFetchingMoreRef.current = false;
    }





    useEffect(()=>{
       async function initialLoad() {
            try {
                setLoading(true)
                // Load initial content
                const first = await fetchDocument();
                if (first) {
                    deque.pushBack(first);
                }

                // Preload more
                let rightItems = []
                let leftItems = []
                
                for(let i = 0; i < 4; i++) {
                    rightItems.push(await fetchDocument());
                    leftItems.push(await fetchDocument());
                }

                rightItems.forEach(item => item && deque.pushBack(item));
                leftItems.forEach(item => item && deque.pushFront(item));

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load content");
                setLoading(false);
            }
        }
        initialLoad();
    }, []);

    useEffect(() => {
        //reset on width change
    }, [width])
    
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-500">Loading content...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-4">
                <Text className="text-xl font-bold text-red-500 mb-2">Oops!</Text>
                <Text className="text-center text-gray-600">{error}</Text>
            </View>
        )
    }

    if (deque.getSize() === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-4">
                <Text className="text-xl font-bold text-gray-400 mb-2">No Content Available</Text>
                <Text className="text-center text-gray-500">Check back later for new content!</Text>
            </View>
        )
    }

    


    return (
        <FlatList 
            data={deque.getItems()}
            renderItem={({item})=> (
                <View style={{width: width, alignItems: 'center', justifyContent: 'center'}}>
            <ViewerComponent {...item} width={width} />
                </View>
            )}
            keyExtractor={(item) => `${item.doc_id}-${item.uid}`}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            snapToAlignment="center"
            snapToInterval={width}
            decelerationRate="fast"
            scrollEventThrottle={400}
            getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
            })}
            initialScrollIndex={4}
            ref={flatListRef}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
            }}
        />
    )
}