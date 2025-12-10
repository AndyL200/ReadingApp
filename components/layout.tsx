import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {AuthProvider} from "../components/contexts/AuthContext.tsx"
import HomeScreen from "../screens/home.tsx"
import Profile from '../screens/profile.tsx';
import Camera from 'screens/camera.tsx';
import { PasswordScreen } from 'screens/password.tsx';
import SignUpScreen from 'screens/sign_up.tsx';
import LoginScreen from 'screens/login.tsx';

const Tabs = createBottomTabNavigator()

function TabLayout() {
  return(
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} options={{title: "Home"}}/>
      <Tabs.Screen name="Camera" component={Camera} options={{title: "Camera"}}/>
      <Tabs.Screen name="Profile" component={Profile} options={{title: "Profile"}}/>
    </Tabs.Navigator>
  )
}


const Stack = createNativeStackNavigator();
function RootStack() {
  return (
    <AuthProvider>
    //Navigation to screens outside of bottom tabs should be possible as well
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tabs" component={TabLayout}/>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="PasswordScreen" component={PasswordScreen}/>
      <Stack.Screen name="Profile" component={Profile}/>
    </Stack.Navigator>
    </AuthProvider>
  );
}


const Layout = () => {
  return (
    <NavigationContainer>
        <RootStack/>
    </NavigationContainer>
  );
}


export default Layout