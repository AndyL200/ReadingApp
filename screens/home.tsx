import { Text, View } from "react-native"; 
import Feed from "components/ui/Feed";

//TODO(hide opening text and replace with feed, add txt animation)
export default function HomeScreen()
{ 
 return (
      <View className="flex-1 items-center justify-center bg-white">
      <Feed/>
    </View>
    )
}