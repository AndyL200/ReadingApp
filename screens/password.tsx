import {View, Text, TextInput, TouchableOpacity} from "react-native";
import {useAuth} from "@/components/hooks/useAuth"
import { useEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";


export function PasswordScreen({route} : any) {
    //check if user is in database
    const [email, setEmail] = useState(route.params?.email || "")
    const username = route.params?.username || null
    const [password, setPassword] = useState("")
    const [success_state, setSuccessState] = useState<boolean>()
    const [error, setError] = useState<string | null>(null)
    const {Register, Login, token} = useAuth()
    const navigate = useNavigation<NavigationProp<any>>();

    //check for the existence of a token
    const isExisting = !!token

    useEffect(() => {
        if(success_state) {
            navigate.navigate("Home")
        }
    }, [success_state])


    async function HandleLogin() {
        if(isExisting) {
            const success = await Login(password, username, email)
            setSuccessState(success.LOGIN_SUCCESS)
            setError(success.ERROR)
        }
        else {
            const success = await Register(email, password, username)
            setSuccessState(success.SIGNUP_SUCCESS)
            setError(success.ERROR)
        }
    }
    return (
        <View>
            <Text>ReadingApp</Text>
            <View className="flex flex-col items-center justify-center">
                {!email  && (
                    <TextInput className="" placeholder="Email" onChangeText={setEmail} value={email}></TextInput>
                )}
                <TextInput className="" placeholder="Password" onChangeText={setPassword} value={password}></TextInput>
                <TouchableOpacity onPress={HandleLogin}>Continue</TouchableOpacity>

                {error && (
                    <Text className="text-red-500">{error}</Text>
                )}
                
            </View>
        </View>
    )
}