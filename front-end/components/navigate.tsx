import { View, Text, StyleSheet } from "react-native";

export default function Navigate() {
    return(
        <View style={styles.container}>
            <Text style={{ color: 'white', fontFamily: 'RobotoMono-Regular', fontSize: 12 }}>
Here’s a guide to help you get started and explore its features.
{'\n\n'}Buttons overview:
{'\n'}1. Compass icon: This instructions page. You can return here anytime for guidance.
{'\n'}2. Yellow button: Create transactions. We recommend entering transactions on the very day you spend to track your spending patterns accurately.
{'\n'}3. Blue button with a man on a rope: Create a budget limit for a category. You can set a custom period or expiry date for each limit.
{'\n'}4. Tablet icon: View all your past transactions in detail.
{'\n'}5. Eye icon: View all limits, including expired, completed, or deleted ones.
{'\n'}6. Man on fire icon: Access active limit records to see ongoing limits in real-time.
{'\n'}7. Monthly records icon: Check your spending per category for each month to monitor trends.
{'\n'}8. Trap icon: Displays all budget violations to keep you informed of overspending.
{'\n\n'}Take your time to explore each button. Understanding these features will help you manage your spending better, gain insights into your habits, and reduce unnecessary expenses.
            </Text>
    </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
    }
})