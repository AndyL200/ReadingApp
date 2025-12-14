import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useAuth } from "../components/hooks/useAuth";
import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native"


export default function SignUpScreen() {
    const navigate = useNavigation<NavigationProp<any>>();
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const {token, validEmail, validUsername} = useAuth()


    const isExisting = !!token


    function passwordRedirect() {
        //pass email
        if(validEmail(email)) {
                navigate.navigate("PasswordScreen", {email: email})
            }
            else if (isExisting && validUsername(email).valid) {
                navigate.navigate("PasswordScreen", {username: email})
            }
            else {
            setError("Please enter a valid email or username")
        }
    }
    return (
    <View className="flex-1 items-center justify-center bg-white px-4">
            <Text className="text-2xl font-bold mb-8">ReadingApp</Text>
            
            <View className="w-full max-w-md">
                <Text className="text-lg mb-4 text-center">Sign Up</Text>
                <Text className="text-sm mb-2 text-center">Enter your email/username</Text>
                <TextInput 
                    className="border border-gray-300 rounded px-4 py-2 mb-4" 
                    placeholder="Email" 
                    onChangeText={setEmail} 
                    value={email}
                    autoCapitalize="none"
                />
                <TouchableOpacity 
                    className="bg-blue-500 rounded px-4 py-3 mb-4"
                    onPress={passwordRedirect}
                >
                    <Text className="text-white text-center font-semibold">Continue</Text>
                </TouchableOpacity>
                
                <Text className="text-center text-gray-500 my-4">OR</Text>
                
                <TouchableOpacity 
                    className="border border-gray-300 rounded px-4 py-3 mb-2"
                    onPress={()=>{}}
                >
                    <Text className="text-center">Continue with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="border border-gray-300 rounded px-4 py-3"
                    onPress={()=>{}}
                >
                    <Text className="text-center">Continue with Apple</Text>
                </TouchableOpacity>
                
                {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}
            </View>
    </View>
    )
}
