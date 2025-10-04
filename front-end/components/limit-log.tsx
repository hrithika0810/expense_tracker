import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { LimitRecords } from "@/app/view_limit";

type LimitRecordsProps = {
    limitRecord: LimitRecords;
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

export default function LimitLog({ limitRecord }: LimitRecordsProps) {
    const rupee_symbol = '₹';
    const categoryItem = category.find(item => item.text === limitRecord.category);
    return(
        <View style={styles.container}>
            <View style={{ flex: 2.5 }}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 10 }}>status</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 10, color: limitRecord.status === 'completed' ? '#9FE675' : limitRecord.status === 'exceeded' ? '#F44336' : '#EFB22F' }}>{limitRecord.status}</Text>
            </View>
            <View style={{ flex: 2, marginRight: 5 }}>
                {categoryItem ? (<Image source={categoryItem.icon} style={{ width: 60, height: 60 }}/>) : (<Image source={require('../assets/images/pet care.png')} style={{ width: 60, height: 60 }}/>)}
            </View>
            <View style={{ flex: 5.5 }}>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 12 }}>{limitRecord.category}</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 12, color: limitRecord.current_amount > limitRecord.amount_limit ? '#F44336' : '#9FE675' }}>{rupee_symbol}{limitRecord.current_amount}</Text>
                <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'white', fontSize: 11 }}>Limit {rupee_symbol}{limitRecord.amount_limit}</Text>
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
        paddingRight: 20,
        paddingLeft: 20,
        flexDirection: 'row',
    }
})