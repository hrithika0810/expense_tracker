import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useState } from "react";

import AuthenticationButton from "@/components/authentication-button"; 
import SignIn from "@/components/sign-in";
import LogIn from "@/components/login";

export default function Authentication() {
    const [activeScreen, setActiveScreen] = useState('sign-in');
    const [fontsLoaded] = useFonts({
        "RobotoMono-Medium": require("../assets/fonts/RobotoMono-Medium.ttf"),
        "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
    })
    if (!fontsLoaded) {
        return null;
    }
    return(
        <ImageBackground source={require('../assets/images/bg.png')} style={styles.container} resizeMode="cover">
            <AuthenticationButton activeScreen={activeScreen} setActiveScreen={setActiveScreen}/>
            {activeScreen == "sign-in" ? <SignIn /> : <LogIn />}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
})