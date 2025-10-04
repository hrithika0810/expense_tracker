import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogIn() {
    const [fontsLoaded] = useFonts({
        "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
    })
    if (!fontsLoaded) {
        return null;
    }
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const API_URI = 'http://192.168.1.7:8000';
    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');
        try {
            const response = await fetch(`${API_URI}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.detail && typeof data.detail === 'object') {
                    if (data.detail.field === 'email') setEmailError(data.detail.message);
                    if (data.detail.field === 'password') setPasswordError(data.detail.message);
                }
            } else {
                await AsyncStorage.setItem('token', data.access_token);
                console.log("Registration successful!", data);
                setEmailValue('');  
                setPasswordValue('');
                router.push('/main');
            }
        } catch (error) {
            console.log('Network error:', error);
        }
    }
    return(
        <View>
            <View style={styles.statement}>
                <Text style={styles.statementLine}>have an account already?</Text>
                <Text style={styles.statementLine}>login to proceed</Text>
            </View>
            <View style={styles.container}>
                <View style={{ height: 96 }}>
                    <Text style={styles.credential}>email id</Text>
                    <View style={styles.entry}>
                        <TextInput style={styles.placeholder} placeholder="Enter your email address" value={emailValue} onChangeText={text => setEmailValue(text)}/>
                    </View>
                    {emailError ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.error}>{emailError}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={{ height: 96 }}>
                    <Text style={styles.credential}>password</Text>
                    <View style={styles.entry}>
                        <TextInput style={styles.placeholder} placeholder="Enter your password carefully" value={passwordValue} onChangeText={text => setPasswordValue(text)} secureTextEntry={false}/>
                    </View>
                    {passwordError ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.error}>{passwordError}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
            <View style={styles.tagLine}>
                <Text style={styles.tag} >Take control of your money.</Text><Text style={styles.tag} >—your personal finance co-pilot</Text>
            </View>
            <View style={styles.forward}>
                <Text style={styles.continue} >Tap to continue.</Text>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Image source={require('../assets/images/arrow.png')} style={{width: 40, height: 40, transform: [{ rotate: '180deg' }]}}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingTop: 20,
        gap: 15,
        marginBottom: 140,
    },
    entry: {
        width: 315,
        height: 45,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: 'black',
        marginTop: 3,
        paddingLeft: 10,
        justifyContent: 'center',
    },
    statement: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
    statementLine: {
        fontFamily: 'RobotoMono-Regular',
        fontSize: 12,
    },
    credential: {
        fontFamily: 'RobotoMono-Regular',
        fontSize: 14,
    },
    placeholder: {
        color: '#515151',
        fontFamily: 'RobotoMono-Regular',
        fontSize: 12,
    },
    error: {
        color: '#E94150',
        fontFamily: 'RobotoMono-Regular',
        fontSize: 10,
    },
    errorBox: {
        padding: 5,
        marginRight: 22,
    },
    forward: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'flex-end',
        paddingRight: 30,
    },
    button: {
        backgroundColor: '#F87DD8',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continue: {
        color: '#515151',
        fontFamily: 'RobotoMono-Medium',
        fontSize: 14,
    },
    tag: {
        fontFamily: 'RobotoMono-Regular',
        fontSize: 12,
    },
    tagLine: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 0, // change
    }
})