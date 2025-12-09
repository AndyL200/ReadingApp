import { useCallback, useEffect, useMemo, useState } from "react";



//using a double ended queue for feed
export default function useDeque<T>(maxSize = 10, initialItems: T[] = []) {
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