import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function ProfileLetter() {
    const [firstLetter, setFirstLetter] = useState('');
    const API_URI = 'http://192.168.1.7:8000';
    useEffect(() => {
        fetchFirstLetter();
    }, []);
    const fetchFirstLetter = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_URI}/getLetter`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                setFirstLetter(data.first_letter);
            } else {
                console.error('Failed to fetch letter:', response.status);
            }
        } catch (error) {
            console.error("Falied to fetch the letter", error);
        }
    }
    return(
            <Text style={{ fontFamily: 'RobotoMono-Bold', fontSize: 24 }}>
                {firstLetter ? firstLetter.toUpperCase() : 'E'}
            </Text>
    );
}