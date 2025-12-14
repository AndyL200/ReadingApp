import { View, Text, FlatList, Dimensions, ActivityIndicator } from "react-native";
import ViewerComponent from "../../components/ViewerComp";
import { Itemizer } from "../../components/BaseTypes";
import { useEffect, useState } from "react";
import useDeque from "../../components/hooks/useDeque";
import {api} from "../../scripts/api"

const { width } = Dimensions.get('window');

//these endpoints should eventually incorporate the user profile
export default function Feed() {
    const { deque } = useDeque<Itemizer>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(()=>{
        async function grabFirst() {
            try {
                const response = await api.get('/', {responseType: "json"});
                if (response && response.status === 200) {
                    const json = response.data;
                    if(json && "doc_id" in json && "content" in json && "page_count" in json && "current_page" in json) {
                        if((typeof json.doc_id === "number") && typeof json.content === "string" && typeof json.page_count === "number" && typeof json.current_page === "number") {
                            let item : Itemizer = {doc_id : json.doc_id, content: json.content, page_count: json.page_count, current_page: json.current_page}
                            deque.pushBack(item)
                        }
                    }
                } else {
                    throw new Error("Response not OK 200")
                }
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load content");
                setLoading(false);
            }
        }
        grabFirst()
        async function grabMore() {
            try {
                // Load more content to the right
                for(let i = 0; i < 4; ++i) {
                    const response = await api.get('/', {responseType: "json"});
                    if (response && response.status === 200) {
                        const json = response.data;
                        if(json && "doc_id" in json && "content" in json && "page_count" in json && "current_page" in json) {
                            if((typeof json.doc_id === "number") && typeof json.content === "string" && typeof json.page_count === "number" && typeof json.current_page === "number") {
                                let item : Itemizer = {doc_id : json.doc_id, content: json.content, page_count: json.page_count, current_page: json.current_page}
                                deque.pushBack(item)
                            }
                        }
                    }
                }
                // Load more content to the left
                for(let i = 0; i < 5; ++i) {
                    const response = await api.get('/', {responseType: "json"});
                    if (response && response.status === 200) {
                        const json = response.data;
                        if(json && "doc_id" in json && "content" in json && "page_count" in json && "current_page" in json) {
                            if((typeof json.doc_id === "number") && typeof json.content === "string" && typeof json.page_count === "number" && typeof json.current_page === "number") {
                                let item : Itemizer = {doc_id : json.doc_id, content: json.content, page_count: json.page_count, current_page: json.current_page}
                                deque.pushFront(item)
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load more content:", err);
            }
        }
        grabMore()
    }, [])

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

    if (deque.items.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-4">
                <Text className="text-xl font-bold text-gray-400 mb-2">No Content Available</Text>
                <Text className="text-center text-gray-500">Check back later for new content!</Text>
            </View>
        )
    }

    return (
        <FlatList 
            data={deque.items}
            renderItem={({item})=> <ViewerComponent {...item} width={width} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            snapToAlignment="center"
            snapToInterval={width}
            decelerationRate="fast"
            getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
            })}
        />
    )
}