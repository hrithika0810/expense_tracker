import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BudgetViolationLog from "./budget-violation-log";
import { View } from "react-native";

export type BudgetViolations = {
    _id: string;
    category: string;
    current_amount: number;
    amount_limit: number;
}

export default function BudgetViolation() {
    const API_URI = 'http://192.168.1.7:8000';
    const [getBudgetViolations, setGetBudgetViolations] = useState<BudgetViolations[]>([]); // can be null as well
    useEffect(() => {
        fetchBudgetViolation();
    }, []);
    const fetchBudgetViolation = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_URI}/budgetviolation`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                    const data = await response.json();
                    console.log("Budget violation data:", data);
                    setGetBudgetViolations(data);
            }
        } catch (error) {
            console.error("Falied to fetch budget violation records:", error);
        }
    }
    return(
        <View>
        {getBudgetViolations.length > 0 ? 
            (getBudgetViolations
                .map((violation) => (
                <BudgetViolationLog 
                    key={violation._id} 
                    budgetViolation={violation}
                />)
            )) : (
                <></>
            )}
        </View>
    );
}