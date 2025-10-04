import { StyleSheet, View, Text } from "react-native";
import { MonthlyExpenseRecord } from "@/app/view_monthly_record";
type Properties = {
    record: MonthlyExpenseRecord;
}

export default function MonthLog({ record }: Properties) {
    const rupee_symbol = '₹';
    const month_names = [
        "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
        "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
    ];
    return(
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 12 }}>MONTH: {month_names[record.month - 1] || 'UNKNOWN'}</Text>
                <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 12 }}>{record.status.toUpperCase() || 'N/A'}</Text>
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 12 }}>CATEGORY</Text>
                <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 12 }}>PRICE</Text>
            </View>
            <View style={styles.separator} />
            {record.category && typeof record.category === 'object' ? Object.entries(record.category).filter(([_, amt]) => amt > 0).map(([cat, amt]) => (
                <View key={cat} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'RobotoMono-Medium', fontSize: 11 }}>{cat.toUpperCase()}</Text>
                    <Text style={{ fontFamily: 'RobotoMono-Medium', fontSize: 11 }}>{rupee_symbol}{amt.toLocaleString()}</Text>
               </View>
            )) : <Text style={{ fontFamily: 'RobotoMono-Medium', fontSize: 11 }}>No category data</Text>}
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 12 }}>SPENDING TOTAL</Text>
                <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 12 }}>{rupee_symbol}{record.total.toLocaleString() || 0}</Text>
            </View>
            <View style={styles.separator} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        width: '100%',
        borderColor: 'black',
        padding: 20,
        flex: 1,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: 'black',
        marginVertical: 5,
    },
})