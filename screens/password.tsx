import {View, Text, TextInput, TouchableOpacity} from "react-native";
import {useAuth} from "../components/hooks/useAuth"
import { useEffect, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";


export function PasswordScreen({route} : any) {
    //check if user is in database
    const [email, setEmail] = useState(route.params?.email || "")
    const username = route.params?.username || null
    const [password, setPassword] = useState("")
    const [success_state, setSuccessState] = useState<boolean>()
    const [error, setError] = useState<string | null>(null)
    const {validPass, Register, Login, token} = useAuth()
    const navigate = useNavigation<NavigationProp<any>>();
    console.log("PASSWORD SCREEN ENTERED: EMAIL ", email)

    //check for the existence of a token
    const hasToken = !!token

    useEffect(() => {
        if(success_state) {
            navigate.navigate("Home")
        }
    }, [success_state])


    async function HandleLogin() {
        const val = validPass(password)
        if (val.valid) {
            if(hasToken) {
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
        else {
            setError(val.error)
        }

    }
    return (
        <View className="flex-1 items-center justify-center bg-white px-4">
            <Text className="text-2xl font-bold mb-8">ReadingApp</Text>
            
            <View className="w-full max-w-md">
                <Text className="text-lg mb-4 text-center">{isExisting ? 'Log In' : 'Create Account'}</Text>
                <Text className="text-sm mb-2 text-center">Enter your password</Text>
                
                {!email && (
                    <TextInput 
                        className="border border-gray-300 rounded px-4 py-2 mb-4" 
                        placeholder="Email" 
                        onChangeText={setEmail} 
                        value={email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                )}
                
                <TextInput 
                    className="border border-gray-300 rounded px-4 py-2 mb-4" 
                    placeholder="Password" 
                    onChangeText={setPassword} 
                    value={password}
                    secureTextEntry
                />
                
                <TouchableOpacity 
                    className="bg-blue-500 rounded px-4 py-3"
                    onPress={HandleLogin}
                >
                    <Text className="text-white text-center font-semibold">Continue</Text>
                </TouchableOpacity>

                {error && (
                    <Text className="text-red-500 text-center mt-4">{error}</Text>
                )}
            </View>
        </View>
    )
}