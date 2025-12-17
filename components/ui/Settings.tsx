import React, { useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import ModalDropdown from "./ModalDropdown";

const CheckBox = (props : {isChecked: boolean, onPress: () => void, title: string}) => {
    const iconName = props.isChecked ?
        "checkbox" : "checkbox-outline";

    return (
        <View className="">
            <Pressable onPress={props.onPress}>
                <Ionicons
                    name={iconName} size={24} color="#000" />
            </Pressable>
            <Text className="">{props.title}</Text>
        </View>
    );
};



export default function Settings() {
    const [highContrast, setHighContrast] = useState(false)
    const [highQuality, setHighQuality] = useState(false)
    return (
        <View>
            <Text>Settings</Text>
            <CheckBox
            title="Click Here"
            isChecked={highContrast}
            onPress={()=> setHighContrast(!highContrast)}
            />
            <CheckBox
            title="Click Here"
            isChecked={highQuality}
            onPress={()=> setHighQuality(!highQuality)}
            />
            <ModalDropdown data={[]} onSelect={()=> {}}></ModalDropdown>
        </View>
    )
}