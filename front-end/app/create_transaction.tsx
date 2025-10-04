import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import ProfileLetter from "@/components/profile-letter";

const category = [
    { icon: require('../assets/images/pet care.png'), text: 'Pet Care' },
    { icon: require('../assets/images/dining out.png'), text: 'Dining Out' },
    { icon: require('../assets/images/therapy & conselling.png'), text: 'Therapy & Counselling' },
    { icon: require('../assets/images/public transport.png'), text: 'Public Transaport' },
    { icon: require('../assets/images/groceries.png'), text: 'Groceries' },
    { icon: require('../assets/images/home appliances.png'), text: 'Home Appliances' },
    { icon: require('../assets/images/hospital visit.png'), text: 'Hospital Visit' },
    { icon: require('../assets/images/gadgets.png'), text: 'Gadgets' },
    { icon: require('../assets/images/subscription.png'), text: 'Subscription' },
    { icon: require('../assets/images/furniture.png'), text: 'Furniture' },
    { icon: require('../assets/images/online shopping.png'), text: 'Online shopping' },
    { icon: require('../assets/images/rent.png'), text: 'Rent' },
    { icon: require('../assets/images/utility bill.png'), text: 'Utility' },
    { icon: require('../assets/images/vacation & travel.png'), text: 'Vacation & Travel' },
    { icon: require('../assets/images/take out.png'), text: 'Take Out' },
    { icon: require('../assets/images/education.png'), text: 'Education' },
    { icon: require('../assets/images/gift.png'), text: 'Gift' },
    { icon: require('../assets/images/entertainment.png'), text: 'Entertainment' },
    { icon: require('../assets/images/fuel & gas.png'), text: 'Fuel & Gas' },
    { icon: require('../assets/images/internet bill.png'), text: 'Internet' },
    { icon: require('../assets/images/car-services.png'), text: 'Car Service' },
    { icon: require('../assets/images/clothing & footwear.png'), text: 'Clothing & Footwear' },
    { icon: require('../assets/images/personal care.png'), text: 'Personal Care' },
    { icon: require('../assets/images/medicine bill.png'), text: 'Medicine' },
    { icon: require('../assets/images/emergency spending.png'), text: 'Emergency' },
    { icon: require('../assets/images/salon & spa.png'), text: 'Salon & Spa' },
    { icon: require('../assets/images/toll gate & parking.png'), text: 'Toll gate & Parking' },
    { icon: require('../assets/images/phone bill.png'), text: 'Phone recharge' },
    { icon: require('../assets/images/stationary & supplies.png'), text: 'Stationary & Supplies' },
    { icon: require('../assets/images/fitness & gym.png'), text: 'Fitness & Gym' },
]

export default function CreateTransaction() { 
    const [fontsLoaded] = useFonts({
        "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
    });
    if (!fontsLoaded) {
        return null; 
    }
    const [categoryIcon, setCategoryIcon] = useState(null);
    const [categoryText, setCategoryText] = useState('');
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })},${today.getFullYear()}`;
    const [amount, setAmount] = useState('');
    const formatIndianNumber = (num: string) => {
        const number = num.replace(/\D/g, ''); // remove non-digit character
        if (!number) return '';
        let lastThree = number.substring(number.length - 3);
        let otherNumbers = number.substring(0, number.length - 3);
        if (otherNumbers !== '') lastThree = ',' + lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    };
    const handleAmountChange = (text: string) => {
        setAmount(formatIndianNumber(text));
    };
    const [showLogOut, setShowLogout] = useState(false);
    const API_URI = '';
    const handleCreateTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to create a limit.');
                return;
            }
            const numericAmount = amount.replace(/,/g, '');
            const response = await fetch(`${API_URI}/createtransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: categoryText,
                    amount: numericAmount,
                }),
            });
            if (response.ok) {
                router.push('/view_transaction');
            } else {
                const err = await response.json();
                alert('Error:' + err.detail);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect to server");
        }
    }
    const shift = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
            Animated.timing(shift, {
                toValue: -e.endCoordinates.height + 35, // move log up
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
        const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(shift, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
        return () => {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        };
    }, []);
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                {showLogOut && (<TouchableOpacity style={{ width: 80, height: 25, backgroundColor: 'white', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => {router.push('/'); setShowLogout(false);}}>
                    <Text style={{ color: '#black', fontFamily: 'RobotoMono-Regular', fontSize: 11 }}>logout</Text>
                </TouchableOpacity>)}
                <TouchableOpacity onPress={() => setShowLogout(prev => !prev)}>
                    <View style={[styles.profile, {backgroundColor: '#85BB65', marginRight: 3 }]}>
                        <ProfileLetter />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {router.push('/main')}}>
                    <View style={[styles.profile, {backgroundColor: '#F87DD8'}]}>
                        <Image source={require('../assets/images/arrow.png')} style={{width: 40, height: 40,}}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={{ color: 'white', fontFamily: 'RobotoMono-Regular', fontSize: 20 }}>Create Transaction</Text>
                <Text style={{ color: '#A6A6A6', fontFamily: 'RobotoMono-Regular', fontSize: 14 }}>—select category to record a{'\n'}transaction</Text>
                <View style={styles.categoryContainer}>
                    {category.map((cat, index) => (
                        <TouchableOpacity key={index} style={styles.categoryWrapper} onPress={() => {setCategoryIcon(cat.icon); setCategoryText(cat.text);}}><Image source={cat.icon} style={styles.category}/></TouchableOpacity>
                    ))}
                </View>
            </View>
            <Animated.View style={[styles.inputContainer, { transform: [{ translateY: shift }] }]}>
                <View style={{ flex: 2.1, alignItems: 'flex-start' }}>
                    {categoryIcon ? (<Image source={categoryIcon} style={{ width: 60, height: 60 }} />) : (<Image source={require('../assets/images/bag.png')} style={{ width: 60, height: 60 }} />)}
                </View>
                <View style={{ flex: 4.7 }}>
                    <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: 'white' }}>{categoryText || 'select category'}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: 'white'}}>Amount ₹</Text>
                        <TextInput keyboardType='numeric' style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: 'white', padding: 0, margin: 0, flex: 1 }} value={amount} onChangeText={handleAmountChange} scrollEnabled={true} ></TextInput>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 3.2, justifyContent: 'flex-start' }}>
                    <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: 'white' }}>date on</Text>
                    <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: '#1A73E9' }}>{formattedDate}</Text>
                </View>
            </Animated.View>
            <TouchableOpacity style={styles.create} onPress={handleCreateTransaction}><Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 14, color: 'white' }}>create</Text></TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 45,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 28,
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        marginRight: 20,
        marginLeft: 20,
        flex: 1,
    },
    category: {
        width: 55,
        height: 55,
    },
    categoryWrapper: {
        width: '18%',
        marginBottom: 5,
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        height: 110,
        borderTopWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
        paddingTop: 10,
        paddingRight: 20,
        paddingLeft: 20,
        backgroundColor: 'black',
    },
    create: {
        width: '100%',
        height: 50,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'white',
        justifyContent: 'center', 
        alignItems: 'center',
    }
})