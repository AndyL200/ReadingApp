import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./home.tsx"
import Profile from './profile';

const Stack = createNativeStackNavigator();
function RootStack() {
  return (
    <Stack.Navigator>
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