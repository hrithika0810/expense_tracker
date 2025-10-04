import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { router } from "expo-router";

type AuthenticationButtonProp = {
    activeScreen: string;
    setActiveScreen: (screen: string) => void;
}

export default function AuthenticationButton({ activeScreen, setActiveScreen }: AuthenticationButtonProp) {
    const [fontsLoaded] = useFonts({
        "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
    })
    if (!fontsLoaded) {
        return null;
    }
    return(
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}><Text style={styles.text} onPress={() => setActiveScreen('sign-in')}>sign-in</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button}><Text style={styles.text} onPress={() => setActiveScreen('login')}>login</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginTop: 137,
    },
    button: {
        width: 157,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 40,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'RobotoMono-Regular',
        fontSize: 12,
    }
})