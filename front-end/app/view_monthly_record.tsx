import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MonthLog from "@/components/month-log";
import ProfileLetter from "@/components/profile-letter";

type CategoryDictionary = {
    [key: string]: number;
}

export type MonthlyExpenseRecord = {
    _id: string;
    month: number;
    category: CategoryDictionary;
    total: number;
    status: string;
}

export default function MonthlyRecord() {
    const [showLogOut, setShowLogout] = useState(false);
    const API_URI = ''
        const [record, setRecord] = useState<MonthlyExpenseRecord[]>([]);
        useEffect(() => {
            fetchMonthlyExpenses();
        }, []);
        const fetchMonthlyExpenses = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(`${API_URI}/monthlyexpense`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRecord(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
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
            <View style={styles.title}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 18 , paddingRight: 20, paddingLeft: 20 }}>Monthly expense record</Text>
            </View>
            <ScrollView style={styles.content}>
                {record.map((record) => (
                    <MonthLog key={record._id} record={record}/>))}
            </ScrollView>
            <View style={styles.footer}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: 120,
        flexDirection: 'row',
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
    title: {
        paddingBottom: 50,
    },
    content: {
        width: '100%',
        height: 550,
    },
    footer: {
        flex: 1,
    }
})