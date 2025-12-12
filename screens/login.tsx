import { Button } from "@react-navigation/elements";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/components/hooks/useAuth";


export default function LoginScreen() {
    const [email, setEmail] = useState("")
    const navigate = useNavigation<NavigationProp<any>>();
    const [error, setError] = useState<string | null>(null)
    const {validEmail, validUsername} = useAuth()
    function signUpRedirect() {
        navigate.navigate("SignUp")
    }
    function passwordRedirect() {
        //pass email
            if(validEmail(email)) {
                navigate.navigate("Password", {email: email})
            }
            else if (validUsername(email).valid) {
                navigate.navigate("Password", {username: email})
            }
            else {
            setError("Please enter a valid email or username")
            }
    }
    return (
        <View>
            <Text>ReadingApp</Text>
            <Text>Login Screen</Text>

            <View className="flex flex-col items-center justify-center">
                <Text className="text-lg mb-4">Log In</Text>
                <Text className="text-sm mb-2">Enter your email/username</Text>
                <TextInput className="" placeholder="Email" onChangeText={setEmail} value={email}></TextInput>
                <TouchableOpacity onPress={passwordRedirect}>Continue</TouchableOpacity>
                <Text>----------------OR----------------</Text>

                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={signUpRedirect}>Sign Up</TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>Continue with Google</TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>Continue with Apple</TouchableOpacity>
            </View>

            {error && <Text className="text-red-500">{error}</Text>}

        </View>
    )
}