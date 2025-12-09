import React from "react";
import { View, Text, Image, Button, TouchableOpacity, ScrollView } from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import { Itemizer} from "./BaseTypes";



//serves as the main layout for a short form content viewer
//loaded for every member of flatlist
export default function ViewerComponent(item : Itemizer) {
    return (
    <View>
        <View className="flex flex-row justify-evenly">
            {/*image source is uploader* <Image className="basis-1/4" source=""/>*/}
            
            <Text className="basis-1/4">Views: {}</Text>
            <TouchableOpacity
            className="basis-1/4"
            onPress={() => {}}
            accessibilityLabel="">Comments</TouchableOpacity>
            {/*eventual is_favorited flag (heart-sharp and heart-outline)*/}
            <Ionicons className="basis-1/4" name="heart-sharp" size={24} color="red"/>
        </View>
        {/* add wraparound and structure the text*/}
        <ScrollView>
        <Text className="">{item.content}</Text>
        </ScrollView>
        {item.current_page &&  (
            <Text className=" ">{item.current_page}/{item.page_count}</Text>
        )}
    </View>
    )
}