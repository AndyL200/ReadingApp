import { View, Text, FlatList } from "react-native";
import ViewerComponent from "components/ViewerComp";
import { Itemizer } from "components/BaseTypes";
import { useEffect } from "react";

let a: Itemizer = { cid : "rea6786f5d", mediatype: "video", size: 5 };
const DATA : Itemizer[] = [a, {cid: "fhalkwe67", size: 4}, {cid: "79423fwia7dcn", size: 3}]
const api_alias = "localhost:5000"
export default function Feed() {
    useEffect(()=>{
        fetch(api_alias + '/').then(response => {
            let item : Itemizer = {cid : response.cid, text: response.text, width: response.width, height: response.height}
            DATA.push(item)
    })
    }, [])
    return (
    <FlatList 
    data={DATA}
    renderItem={({item})=> ViewerComponent(item)}
    />
    )
}