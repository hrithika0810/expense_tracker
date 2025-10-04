import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { TransactionRecords } from "@/app/view_transaction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type TransactionRecordsProps = {
    transactionRecord: TransactionRecords;
    onDelete: (id: string) => void;
} 

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

export default function TransactionLog({ transactionRecord, onDelete }: TransactionRecordsProps) {
    const rupee_symbol = '₹';
    const categoryItem = category.find(item => item.text === transactionRecord.category);
    const formatDate = (dateInput: any) => {
        const date = new Date(dateInput.$date || dateInput);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",  
            year: "numeric",
        });
    };
    const API_URI = 'http://192.168.1.7:8000';
    const [canDeleteTransaction, setCanDeleteTransaction] = useState(true);
    useEffect(() => {
        const now = new Date();
        const createdAt = new Date(transactionRecord.date_of_transaction);
        const endOfTheDay = new Date(createdAt);
        endOfTheDay.setHours(23, 59, 59, 999);
        if (now > endOfTheDay) {
            setCanDeleteTransaction(false);
        } else {
            const timeOut = endOfTheDay.getTime() - now.getTime();
            const timer = setTimeout(() => {
                setCanDeleteTransaction(false);
            }, timeOut)
            return () => clearTimeout(timer);
        }
    }, [transactionRecord.date_of_transaction]);
    const handleDeleteTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_URI}/deletetransaction/${transactionRecord._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                onDelete(transactionRecord._id);
            } else {
                const error = await response.json();
                alert('Error:' + error.detail);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete record");
        }
    }
    return(
        <View style={styles.container}>
            <View style={{ flex: 2.5, marginRight: 5 }}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 10 }}>made on</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: '#1A73E9', fontSize: 9 }}>{formatDate(transactionRecord.date_of_transaction)}</Text>
            </View>
            <View style={{ flex: 2, marginRight: 5 }}>
                {categoryItem ? (<Image source={categoryItem.icon} style={{ width: 60, height: 60 }}/>) : (<Image source={require('../assets/images/pet care.png')} style={{ width: 60, height: 60 }}/>)}
            </View>
            <View style={{ flex: 4.5 }}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 12 }}>{transactionRecord.category}</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 11 }}>Amount {rupee_symbol} {transactionRecord.amount}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={handleDeleteTransaction} disabled={!canDeleteTransaction} style={{ opacity: canDeleteTransaction ? 1 : 0.4 }}><Image source={require('../assets/images/delete.png')} style={{ width: 25, height: 25 }}/></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 110,
        backgroundColor: 'black',
        borderTopWidth: 1,
        borderColor: 'white',
        paddingTop: 10,
        paddingRight: 15,
        paddingLeft: 15,
        flexDirection: 'row',
    }
})