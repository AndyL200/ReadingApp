import { Double } from "react-native/Libraries/Types/CodegenTypes"

//class for sub viewer components like ads and suggestions that should be tailored to the user
export abstract class Personalizer {
    constructor(public user: string) {}

    abstract comp(): React.ReactNode;
}
export abstract class MediaTypes {

}

let uid_counter = 0
export function generateUID(): string {
    const time = new Date().getTime().toString(36);
    const rand = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        .toString(16)
        .padStart(13, '0');

    const r = 'xxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        const r = Math.random() * 16 | 0;
        return r.toString(16);
    });

    return time + rand + r + (uid_counter++).toString(36);
}
export type Itemizer = {
    //content id
    doc_id : number,
    content : any,
    page_count: number //Integer
    current_page?: number //Integer
    uid: string;
}

export class Deque<T> {
    private buffer: (T | undefined)[];
    private head: number = 0;
    private tail: number = -1;
    private size: number = 0;
    private maxSize: number;

    constructor(maxSize: number = 10) {
        this.maxSize = maxSize;
        this.buffer = new Array(maxSize);
    }

    pushBack(item: T) {
        this.tail = (this.tail + 1) % this.maxSize;
        this.size = Math.min(this.size + 1, this.maxSize);
        if (this.size === this.maxSize) {
            this.head = (this.head + 1) % this.maxSize;
        }
        this.buffer[this.tail] = item;
    }

    pushFront(item: T) {
        this.head = (this.head - 1 + this.maxSize) % this.maxSize;
        this.size = Math.min(this.size + 1, this.maxSize);
        if (this.size === this.maxSize) {
            this.tail = (this.tail - 1 + this.maxSize) % this.maxSize;
        }
        this.buffer[this.head] = item;
    }

    popFront() {
        if (this.size === 0) return;
        this.head = (this.head + 1) % this.maxSize;
        this.size--;
    }

    popBack() {
        if (this.size === 0) return;
        this.tail = (this.tail - 1 + this.maxSize) % this.maxSize;
        this.size--;
    }

    getItems(): T[] {
        const result: T[] = [];
        for (let i = 0; i < this.size; i++) {
            result.push(this.buffer[(this.head + i) % this.maxSize]!);
        }
        return result;
    }

    getSize(): number {
        return this.size;
    }

    getFront() : number {
        return this.head;
    }
    getBack() : number {
        return this.tail;
    }
}
