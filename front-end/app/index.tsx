import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { router } from "expo-router";

export default function Index(){
    const [fontsLoaded] = useFonts({
        "RobotoMono-Bold": require("../assets/fonts/RobotoMono-Bold.ttf"),
        "RobotoMono-Medium": require("../assets/fonts/RobotoMono-Medium.ttf"),
    });
    if (!fontsLoaded) {
        return null; 
    }
    return(
        <ImageBackground source={require('../assets/images/background.png')} style={styles.cover} resizeMode="cover">
            <View>
                <View style={styles.container}>
                    <Text style={styles.maintext} >cash-pilot</Text>
                    <Text style={styles.text} >expense tracker app</Text>
                </View>
                <View style={styles.forward}>
                    <Text style={styles.continue} >Tap to continue.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/authentication')}> 
                        <Image source={require('../assets/images/arrow.png')} style={{width: 40, height: 40, transform: [{ rotate: '180deg' }]}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    cover: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    container: {
        marginTop: 300,
        paddingLeft: 40,
    },
    maintext: {
        color: 'white',
        fontFamily: "RobotoMono-Bold",
        fontSize: 36,
    },
    text: {
        color: 'white',
        fontFamily: 'RobotoMono-Medium',
        fontSize: 20,
    },
    forward: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 350,
        justifyContent: 'flex-end',
        paddingRight: 30,
    },
    button: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continue: {
        color: 'white',
        fontFamily: 'RobotoMono-Medium',
        fontSize: 14,
    },
})