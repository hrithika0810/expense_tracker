import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { ActiveLimit } from "@/app/view_active_limit";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ActiveLimitProps = {
    activeLimits: ActiveLimit;
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

export default function ActiveLimitLog({ activeLimits, onDelete }: ActiveLimitProps) {
    const categoryItem = category.find(item => item.text === activeLimits.category);
    const rupee_symbol = '₹';
    const formatDate = (dateInput: any) => {
        const date = new Date(dateInput.$date || dateInput);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",  
            year: "numeric",
        });
    };
    const API_URI = 'http://192.168.1.7:8000';
    const [canDelete, setCanDelete] = useState(true);
    useEffect(() => {
        const now = new Date();
        const createdAt = new Date(activeLimits.created_at);
        const endOfTheDay = new Date(createdAt);
        endOfTheDay.setHours(23, 59, 59, 999);
        if (now > endOfTheDay) {
            setCanDelete(false);
        } else {
            const timeOut = endOfTheDay.getTime() - now.getTime();
            const timer = setTimeout(() => {
                setCanDelete(false);
            }, timeOut)
            return () => clearTimeout(timer);
        }
    }, [activeLimits.created_at]);
    const handleDeleteLimit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_URI}/deletelimit/${activeLimits._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                onDelete(activeLimits._id);
            } else {
                const error = await response.json();
                alert('Error:' + error.detail);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete record");
        }
    };
    // if (!canDelete) return null;
    return(
        <View style={styles.container}>
            <View style={{ flex: 2.5, marginRight: 5 }}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 10 }}>expiry date</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: '#1A73E9', fontSize: 9 }}>{formatDate(activeLimits.expiry_date)}</Text>
            </View>
            <View style={{ flex: 2, marginRight: 5 }}>
                {categoryItem ? (<Image source={categoryItem.icon} style={{ width: 60, height: 60 }}/>) : (<Image source={require('../assets/images/pet care.png')} style={{ width: 60, height: 60 }}/>)}
            </View>
            <View style={{ flex: 4.5 }}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 12 }}>{activeLimits.category}</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: activeLimits.current_amount > activeLimits.amount_limit ? '#F44336' : '#9FE675' }}>{rupee_symbol}{activeLimits.current_amount}</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 11 }}>Limit {rupee_symbol}{activeLimits.amount_limit}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={handleDeleteLimit} disabled={!canDelete} style={{ opacity: canDelete ? 1 : 0.4 }}><Image source={require('../assets/images/delete.png')} style={{ width: 25, height: 25 }}/></TouchableOpacity>
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