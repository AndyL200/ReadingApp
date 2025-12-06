import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "../screens/home.tsx"
import Profile from '../screens/profile.tsx';

const Tabs = createBottomTabNavigator()

function TabLayout() {
  return(
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} options={{title: "Home"}}/>
      <Tabs.Screen name="Profile" component={Profile} options={{title: "Profile"}}/>
    </Tabs.Navigator>
  )
}


const Stack = createNativeStackNavigator();
function RootStack() {
  return (
    //Navigation to screens outside of bottom tabs should be possible as well
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tabs" component={TabLayout}/>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Profile" component={Profile}/>
    </Stack.Navigator>
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