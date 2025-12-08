import { View, Text, FlatList } from "react-native";
import ViewerComponent from "components/ViewerComp";
import { Itemizer } from "components/BaseTypes";
import { use, useCallback, useEffect, useMemo, useState } from "react";


//Format: cid => doc_id stands for content identifier
//text => text content of document page
let a: Itemizer = { cid : "rea6786f5d", content: "{}", pages: 5 };
const DATA : Itemizer[] = [a]


const api_alias = "localhost:5000"

//using a double ended queue for feed
function useDeque<T>(maxSize = 10, initialItems: T[] = []) {
    const [queue, setQueue] = useState(()=> ({
        buffer: new Array(maxSize),
        head: 0,
        tail: initialItems.length-1,
        size:initialItems.length
    }));

    useEffect(() => {
        if(initialItems.length > 0) {
            const buffer = new Array(maxSize) as T[];
            initialItems.forEach((item, i) => {
                buffer[i] = item;
            })
            setQueue({buffer, head: 0, tail: initialItems.length - 1, size: initialItems.length} );
        }
    }, [])

    const pushBack = useCallback((item : T) => {
        setQueue(prev => {
            const newBuffer = prev.buffer;
            const newTail = (prev.tail + 1) % maxSize;
            const newSize = Math.min(prev.size + 1, maxSize);
            const newHead = newSize === maxSize ? (prev.head + 1) % maxSize : prev.head;
            
            newBuffer[newTail] = item;
            return { buffer: newBuffer, head: newHead, tail: newTail, size: newSize };
        });
    }, [maxSize])

    const pushFront = useCallback((item: T) => {
        setQueue(prev => {
            const newBuffer = prev.buffer;
            const newHead = (prev.head - 1 + maxSize) % maxSize;
            const newSize = Math.min(prev.size + 1, maxSize);
            const newTail = newSize === maxSize ? (prev.tail - 1 + maxSize) % maxSize : prev.tail;
            
            newBuffer[newHead] = item;
            return { buffer: newBuffer, head: newHead, tail: newTail, size: newSize };
        });
    }, [maxSize]);

        //bottom methods may be subject to change
    const popFront = useCallback(() => {
        setQueue(prev => {
            if (prev.size === 0) return prev;
            return { 
                ...prev, 
                head: (prev.head + 1) % maxSize, 
                size: prev.size - 1 
            };
        });
    }, [maxSize]);

    const popBack = useCallback(() => {
        setQueue(prev => {
            if (prev.size === 0) return prev;
            return { 
                ...prev, 
                tail: (prev.tail - 1 + maxSize) % maxSize, 
                size: prev.size - 1 
            };
        });
    }, [maxSize]);

    const items = useMemo(() => {
        const result: T[] = [];
        for (let i = 0; i < queue.size; i++) {
            result.push(queue.buffer[(queue.head + i) % maxSize]);
        }
        return result;
    }, [queue, maxSize]);

    const deque = {
        items, pushBack, pushFront, popBack, popFront, size: queue.size
    }
    return { deque };
}

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
            if(json && "cid" in json && "content" in json && "pages" in json && "currentPage" in json) {
                    if((typeof json.cid === "string" || typeof json.cid === "number") && typeof json.content === "string" && typeof json.pages === "number" && typeof json.currentPage === "number") {
                    let item : Itemizer = {cid : json.doc_id, content: json.content, pages: json.pages, currentPage: json.currentPage}
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
            if(json && "cid" in json && "content" in json && "pages" in json && "currentPage" in json) {
                    if((typeof json.cid === "string" || typeof json.cid === "number") && typeof json.content === "string" && typeof json.pages === "number" && typeof json.currentPage === "number") {
                    let item : Itemizer = {cid : json.doc_id, content: json.content, pages: json.pages, currentPage: json.currentPage}
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
            if(json && "cid" in json && "content" in json && "pages" in json && "currentPage" in json) {
                    if((typeof json.cid === "string" || typeof json.cid === "number") && typeof json.content === "string" && typeof json.pages === "number" && typeof json.currentPage === "number") {
                    let item : Itemizer = {cid : json.doc_id, content: json.content, pages: json.pages, currentPage: json.currentPage}
                    deque.pushFront(item)
                    }
                }
            })
            }
        }
    grabMore()
    }, [])

    //left and right flatlist feed
    return (
    <FlatList 
    data={deque.items}
    renderItem={({item})=> ViewerComponent(item)}
    keyExtractor={(item) => item.}
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    pagingEnabled={true}
    snapToAlignment="center"
    snapToInterval={width}
    decelerationRate="fast"
    />
    )
}