import { View, Text, FlatList } from "react-native";
import ViewerComponent from "components/ViewerComp";
import { Itemizer } from "components/BaseTypes";

let a: Itemizer = { cid : "rea6786f5d", mediatype: "video", size: 5 };
const DATA : Itemizer[] = [a, {cid: "fhalkwe67", size: 4}, {cid: "79423fwia7dcn", size: 3}]

export default function Feed() {
    <FlatList 
    data={DATA}
    renderItem={({item})=> ViewerComponent(item)}
    />
}