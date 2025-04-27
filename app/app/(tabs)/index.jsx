import {View, Text, TouchableOpacity} from 'react-native'
import { authStore } from '../../store/authStore'

export default function Home(){
    const {logout} = authStore();
    return(
        <View>
            <Text>Home screen</Text>
            <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
        </View>
    )
}