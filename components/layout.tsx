import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {AuthProvider} from "../components/contexts/AuthContext"
import HomeScreen from "../screens/home"
import Profile from '../screens/profile';
import Camera from '../screens/camera.tsx';
import { PasswordScreen } from '../screens/password.tsx';
import SignUpScreen from '../screens/sign_up.tsx';
import LoginScreen from '../screens/login.tsx';
import AppInit from '../screens/app_initialize.tsx';
import PreScreen from '../screens/pre_screen.tsx';


const Tabs = createBottomTabNavigator()

function TabLayout() {
  return(
    <Tabs.Navigator screenOptions={{
          tabBarActiveTintColor: "blue",
          headerShown: false,
        }}>
      <Tabs.Screen name="Home" component={HomeScreen} options={{title: "Home"}}/>
      <Tabs.Screen name="Camera" component={Camera} options={{title: "Camera"}}/>
      <Tabs.Screen name="Profile" component={Profile} options={{title: "Profile"}}/>
    </Tabs.Navigator>
  )
}


const Stack = createNativeStackNavigator();
function RootStack() {
  //Navigation to screens outside of bottom tabs should be possible as well
  return (
    
    <Stack.Navigator initialRouteName="AppInit" screenOptions={{headerShown: false}}>
      <Stack.Screen name="AppInit" component={AppInit}/>
      <Stack.Screen name="Tabs" component={TabLayout}/>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="PreScreen" component={PreScreen}/>
      <Stack.Screen name="PasswordScreen" component={PasswordScreen}/>
      <Stack.Screen name="Profile" component={Profile}/>
      
    </Stack.Navigator>
  );
}



const Layout = () => {
  return (
    <AuthProvider>
    <NavigationContainer>
        <RootStack/>
    </NavigationContainer>
    </AuthProvider>
  );
}

export default Layout;