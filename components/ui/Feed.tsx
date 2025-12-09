import { View, Text, FlatList } from "react-native";
import ViewerComponent from "components/ViewerComp";
import { Itemizer } from "components/BaseTypes";
import { useEffect, useMemo, useState } from "react";
import useDeque from "components/hooks/useDeque";


//Format: cid => doc_id stands for content identifier
//text => text content of document page
let a: Itemizer = { doc_id : 1 , content: "{}", page_count: 5 };
const DATA : Itemizer[] = [a]


const api_alias = "localhost:5000"



//these endpoints should eventually incorporate the user profile
export default function Feed() {
    const { deque } = useDeque<Itemizer>();


    useEffect(()=>{
        function grabFirst() {
        fetch(api_alias + '/').then(response => {
            if (response && response.ok) {
                return response.json();
            }
            throw new Error("Response not ok")
        }).then(json => {
            if(json && "doc_id" in json && "content" in json && "page_count" in json && "current_page" in json) {
                    if((typeof json.doc_id === "number") && typeof json.content === "string" && typeof json.page_count === "number" && typeof json.current_page === "number") {
                    let item : Itemizer = {doc_id : json.doc_id, content: json.content, page_count: json.page_count, current_page: json.current_page}
                    deque.pushBack(item)
                    }
                }
        })
    }
    grabFirst()
        async function grabMore() {
            for(let i = 0; i < 4; ++i) {
            fetch(api_alias + '/').then(response => {
            if (response && response.ok) {
                return response.json();
            }
            throw new Error("Response not ok")
        }).then(json => {
            if(json && "doc_id" in json && "content" in json && "pages" in json && "current_page" in json) {
                    if((typeof json.doc_id === "number") && typeof json.content === "string" && typeof json.pages === "number" && typeof json.current_page === "number") {
                    let item : Itemizer = {doc_id : json.doc_id, content: json.content, page_count: json.page_count, current_page: json.current_page}
                    deque.pushBack(item)
                    }
                }
            })
            }
        for(let i = 0; i < 5; ++i) {
            fetch(api_alias + '/').then(response => {
            if (response && response.ok) {
                return response.json();
            }
            throw new Error("Response not ok")
        }).then(json => {
            if(json && "doc_id" in json && "content" in json && "page_count" in json && "current_page" in json) {
                    if((typeof json.doc_id === "number") && typeof json.content === "string" && typeof json.page_count === "number" && typeof json.current_page === "number") {
                    let item : Itemizer = {doc_id : json.doc_id, content: json.content, page_count: json.page_count, current_page: json.current_page}
                    deque.pushFront(item)
                    }
                }
            })
            }
        }
    grabMore()
    }, [])
    {/*snapToInterval={width}*/}
    //left and right flatlist feed
    return (
    <FlatList 
    data={deque.items}
    renderItem={({item})=> ViewerComponent(item)}
    keyExtractor={(item, index) => index.toString()}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    pagingEnabled={true}
    snapToAlignment="center"
    decelerationRate="fast"
    />
    )
}