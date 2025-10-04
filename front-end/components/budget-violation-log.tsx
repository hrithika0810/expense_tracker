import { View, Text, StyleSheet } from "react-native";
import { BudgetViolations } from "./budget-violation";

type BudgetViolationLogProps = {
    budgetViolation: BudgetViolations;
}

const messages: Record<string, string[]> = {
    'Pet Care' : [
        "🐾 Your pet is now officially living a better life than you. Overspent ₹{exceeded_amount}, while the limit was just ₹{limit_amount}..",
        "Your fur baby says thanks for the luxury! You spent ₹{current_amount}, while the limit was just ₹{limit_amount}."
    ],
    'Dining Out' : [
        "🍽️ Apparently, your kitchen has been declared a museum. You spent ₹{current_amount} against a limit of ₹{limit_amount}",
        "Restaurant staff might add you to payroll soon. You spent ₹{current_amount}, while your limit was just ₹{limit_amount}."
    ],
    'Therapy & Counselling' : [
        "💚 You’re investing in your well-being. Just remember — financial peace counts too. Current: ₹{current_amount}, Limit: ₹{limit_amount}.",
        "🛋️ Self-care is priceless, but your wallet disagrees — you spent ₹{current_amount} (limit ₹{limit_amount})."
    ],
    'Public Transaport': [
        "🚌 ₹{current_amount} on rides, limit ₹{limit_amount}. You almost own a bus now.",
        "Wallet says stop tapping that metro card! ₹{current_amount} vs limit ₹{limit_amount}."
    ],
    'Groceries' : [
        "Fridge space: 0. Overspent ₹{current_amount - limit_amount}.",
        "Oops! ₹{current_amount} on groceries, limit was ₹{limit_amount}. Hope you bought enough snacks for everyone!"
    ],
    'Home Appliances' : [
        "Whoa! ₹{current_amount} spent vs ₹{limit_amount} allowed. That toaster is officially expensive!",
        "Alert! ₹{current_amount} blown on appliances, limit ₹{limit_amount}. Time to slow down before your blender stages a coup!",
        "🏠 Spent ₹{current_amount}, limit was ₹{limit_amount}. Your house might start buzzing with appliances!"
    ],
    'Hospital Visit' : [
        "Alert: ₹{current_amount} spent on hospital visits, limit ₹{limit_amount}. Consider reviewing your health spending.",
        "🏥 ₹{current_amount} spent, limit was ₹{limit_amount}. Health comes first—make sure this is necessary care."
    ],
    'Gadgets' : [
        "Beep boop! ₹{current_amount} spent, limit ₹{limit_amount}. Gadgets are fun, but your budget isn’t.",
        "₹{current_amount} on gadgets, limit ₹{limit_amount}. Soon your toaster might feel jealous of your new smartwatch."
    ],
    'Subscription' : [
        "Too many subscriptions! ₹{current_amount} spent, limit ₹{limit_amount}. Your wallet says 'unsubscribe, please!'",
        "₹{current_amount} on subscriptions, limit ₹{limit_amount}. Netflix, Spotify, Disney+, oh my!"
    ],
    'Furniture' : [
        "Limit was ₹{limit_amount}, you went ₹{current_amount}. Your coffee table has better taste than your budget!" ,
        "₹{current_amount} spent, limit ₹{limit_amount}. That lamp now demands a name and a seat at the dinner table."
    ],
    'Online shopping' : [
        "Limit ₹{limit_amount}, spent ₹{current_amount}. At this rate, your parcels might start forming a welcome committee!",
        "₹{current_amount} already spent online, limit was ₹{limit_amount}. Your delivery guy knows your name now!"
    ],
    'Rent' : [
        "₹{current_amount} on rent, limit ₹{limit_amount}. Your piggy bank just waved goodbye!",
        "Limit ₹{limit_amount}, spent ₹{current_amount}. Who knew walls and ceilings could be so expensive?"
    ],
    'Utility' : [
        "Limit ₹{limit_amount}, spent ₹{current_amount}. Your utility bills just leveled up to 'legendary'!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. The fridge is chillin’, the heater is burnin’!"
    ],
    'Vacation & Travel' : [
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Your beach tan comes with a price tag!",
        "₹{current_amount} on vacation, limit ₹{limit_amount}. You just bought memories (and debt) at the same time!",
        "₹{current_amount} spent on travel, limit ₹{limit_amount}. Your suitcase just filed a complaint!"
    ],
    'Take Out' : [
        "Limit ₹{limit_amount}, spent ₹{current_amount}. You’ve officially joined the gourmet couch potato club!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Your wallet smells like pizza!"
    ],
    'Education': [
        "Spent ₹{current_amount}, limit ₹{limit_amount}. You’re investing in your future… and your bank account is crying!",
        "₹{current_amount} on learning, limit ₹{limit_amount}. Knowledge is expensive, huh?"
    ],
    'Gift' : [
        "Limit ₹{limit_amount}, spent ₹{current_amount}. Secret Santa just got a little too real!",
        "₹{current_amount} spent, limit ₹{limit_amount}. Gifts are love, but maybe not for your bank account!"
    ],
    'Entertainment' : [
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Entertainment budget exceeded – time to binge less… or earn more!",
        "₹{current_amount} on fun, limit ₹{limit_amount}. Your inner party animal is thriving… your budget, maybe not!"
    ],
    'Fuel & Gas' : [
        "₹{current_amount} on fuel, limit ₹{limit_amount}. Your car might be happier than your wallet!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Petrol prices making you reconsider road trips!",
        "₹{current_amount} spent, limit ₹{limit_amount}. At this rate, your car's dreams are bigger than your budget."
    ],
    'Internet' : [
        "₹{current_amount} on internet, limit ₹{limit_amount}. Streaming like there's no tomorrow!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Who knew memes and movies could cost this much?",
        "₹{current_amount} spent, limit ₹{limit_amount}. WiFi addiction strikes again!"
    ],
    'Car Service' : [
        "₹{current_amount} on car service, limit ₹{limit_amount}. Your car deserves pampering, your wallet maybe not.",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Oil, tires, and your bank account crying!",
        "₹{current_amount} spent, limit ₹{limit_amount}. Car happy, wallet… sad."
    ],
    'Clothing & Footwear' : [
        "₹{current_amount} on fashion, limit ₹{limit_amount}. Looking good never looked this expensive!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Your wardrobe is thriving, your bank account is not.",
        "₹{current_amount} spent, limit ₹{limit_amount}. Shoe collection: impressive. Wallet: questionable."
    ],
    'Personal Care' : [
        "₹{current_amount} on self-care, limit ₹{limit_amount}. Glow up comes at a cost!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Lotion, shampoo… and regret?",
        "₹{current_amount} spent, limit ₹{limit_amount}. Beauty on point, budget on pause."
    ],
    'Medicine' : [
        "₹{current_amount} on meds, limit ₹{limit_amount}. Health first, wallet second.",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Vitamin bills stacking up!",
        "₹{current_amount} spent, limit ₹{limit_amount}. The pharmacy is winning."
    ],
    'Emergency' : [
        "₹{current_amount} on emergencies, limit ₹{limit_amount}. Hope everything’s okay, but your budget is screaming!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Unexpected stuff always has a price tag.",
        "₹{current_amount} spent, limit ₹{limit_amount}. Budget emergency alert!"
    ],
    'Salon & Spa' : [
        "₹{current_amount} on pampering, limit ₹{limit_amount}. You’re relaxed, your wallet isn’t.",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Hair, nails, and bank balance got styled!",
        "₹{current_amount} spent, limit ₹{limit_amount}. Spa day deluxe, budget day meh."
    ],
    'Toll gate & Parking' : [
        "₹{current_amount} on tolls, limit ₹{limit_amount}. Your car paid more than you did!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Road fees adding up fast.",
        "₹{current_amount} spent, limit ₹{limit_amount}. Parking tickets and tolls: not friends with budgets."
    ],
    'Phone recharge' : [
        "₹{current_amount} on recharge, limit ₹{limit_amount}. Your phone is happy, your wallet less so.",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Unlimited talk, limited budget!",
        "₹{current_amount} spent, limit ₹{limit_amount}. Recharge today, regret tomorrow?"
    ],
    'Stationary & Supplies' : [
        "₹{current_amount} on stationery, limit ₹{limit_amount}. Pens, paper… and a slightly lighter wallet.",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. School supplies or secret shopping?",
        "₹{current_amount} spent, limit ₹{limit_amount}. Notebook collection level: expert. Budget: amateur."
    ],
    'Fitness & Gym' : [
        "₹{current_amount} on fitness, limit ₹{limit_amount}. Gains in muscles, losses in wallet!",
        "Spent ₹{current_amount}, limit ₹{limit_amount}. Gym membership thriving, bank account crying.",
        "₹{current_amount} spent, limit ₹{limit_amount}. Fit body, slightly unfit budget."
    ]
}

export default function BudgetViolationLog({ budgetViolation }: BudgetViolationLogProps) {
    const formatMessage = () => {
        const categoryMessages = messages[budgetViolation.category] || ['Overspent!'];
        const randomMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
        const currentAmount = budgetViolation.current_amount;
        const limitAmount = budgetViolation.amount_limit;
        return randomMessage
            .replace(/\{current_amount\}/g, currentAmount.toLocaleString("en-IN"))
            .replace(/\{limit_amount\}/g, limitAmount.toLocaleString("en-IN"))
            .replace(/\{exceeded_amount\}/g, (currentAmount - limitAmount).toLocaleString("en-IN"));
    };
    return(
        <View style={styles.container}>
            <Text style={styles.content}>{formatMessage()}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#1A1A1A',
        borderRadius: 5,
        marginBottom: 8,
        padding: 15,
    },
    content: {
        fontFamily: 'RobotoMono-Regular',
        color: 'white',
        fontSize: 11,
        textAlign: 'justify',
    }
})