import { useFonts } from "expo-font";
import { Href, router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import BudgetViolation from "@/components/budget-violation";
import Navigate from "@/components/navigate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import ProfileLetter from "@/components/profile-letter";

const images: { src: any; screen: Href; dynamic?: boolean; component?: React.ReactNode; }[] = [
    { src : require('../assets/images/navigation.png'), screen : './main', dynamic: true, component: <Navigate />},
    { src : require('../assets/images/createTransaction.png'), screen : './create_transaction', dynamic: false},
    { src : require('../assets/images/createLimit.png'), screen : './create_limit', dynamic: false},
    { src : require('../assets/images/viewTransaction.png'), screen : './view_transaction', dynamic: false},
    { src : require('../assets/images/viewLimit.png'), screen : './view_limit', dynamic: false},
    { src : require('../assets/images/viewActiveLimit.png'), screen : './view_active_limit', dynamic: false},
    { src : require('../assets/images/monthly-expense.png'), screen : './view_monthly_record', dynamic: false},
    { src: require('../assets/images/budget-violation.png'),  screen : '/main', dynamic: true, component: <BudgetViolation />},
]

type MonthlyRecord = {
    _id: string;
    month: number;
    total: number;
}

export default function Main() {
    const [fontsLoaded] = useFonts({
        "RobotoMono-Bold": require("../assets/fonts/RobotoMono-Bold.ttf"),
        "RobotoMono-Medium": require("../assets/fonts/RobotoMono-Medium.ttf"),
        "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
    });
    if (!fontsLoaded) {
        return null; 
    }
    const [activeComponent, setActiveComponent] = useState(<Navigate />);
    const handlePress = (img: any) => {
        if (img.dynamic) {
            setActiveComponent(img.component);
        } else {
            router.push(img.screen);
        }
    }
    const [showLogOut, setShowLogout] = useState(false);
    const [currentMonthRecord, setCurrentMonthRecord] = useState<MonthlyRecord | null>(null);
    const API_URI = ''
    useEffect(() => {
        const fetchMonthlyExpenses = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;
                const response = await fetch(`${API_URI}/monthlyexpense`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data: MonthlyRecord[] = await response.json();
                    const now = new Date();
                    const currentMonth = now.getMonth() + 1;
                    const monthRecord = data.find(record => record.month === currentMonth);
                    setCurrentMonthRecord(monthRecord || null);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchMonthlyExpenses();
    }, []);
    if (!currentMonthRecord) return <Text>No data for this month</Text>;
    const month_names = [
        "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
        "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ];
    const rupee_symbol = '₹';
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                {showLogOut && (<TouchableOpacity style={{ width: 80, height: 25, backgroundColor: 'white', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => {router.push('/'); setShowLogout(false);}}>
                    <Text style={{ color: '#black', fontFamily: 'RobotoMono-Regular', fontSize: 11 }}>logout</Text>
                </TouchableOpacity>)}
                <TouchableOpacity style={styles.profile} onPress={() => setShowLogout(prev => !prev)}>
                    <ProfileLetter />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.mainMessage} >hello user,</Text>
                    <Text style={styles.mainMessage} >welcome back</Text>
                </View>
                <View style={{marginTop: 15 }}>
                    <Text style={{ color: '#A6A6A6', fontFamily: 'RobotoMono-Regular', fontSize: 14 }}>{month_names[currentMonthRecord.month - 1]} SPENDING</Text>
                    <Text style={{ color: '#1A73E9', fontFamily: 'RobotoMono-Regular', fontSize: 30}}>{rupee_symbol}{currentMonthRecord.total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>
                <View>
                    <ScrollView horizontal={true} style={{ marginTop: 10, height: 80  }}>
                        {images.map((img, index) => (
                            <TouchableOpacity key={index} style={{ marginRight: 10 }} onPress={() => handlePress(img)}><Image source={img.src} style={styles.component} /></TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <ScrollView style={{ marginTop: 10 }}>
                    {activeComponent}  
                </ScrollView>
                <View style={{ height: 30}}></View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 25,
        paddingTop: 20,
        gap: 1,
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#85BB65',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginRight: 20,
        marginLeft: 20,
    },
    mainMessage: {
        color: 'white',
        fontFamily: 'RobotoMono-Regular',
        fontSize: 22,
    },
    component: {
        width: 80,
        height: 70,
    }
})