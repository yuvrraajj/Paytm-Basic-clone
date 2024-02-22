import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export function Dashboard(){
    const [value,setvalue]=useState(1000);
    useEffect(() => {
        // Define an async function inside useEffect
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using bearer token authentication
                    }
                });
                setvalue(response.data.balance); // Assuming the API returns an object with a balance property
            } catch (error) {
                console.error("Error fetching balance:", error);                
            }
        };

        fetchBalance();
    }, []); // R

    return <div>
        <Appbar/>
        <Balance value={value}/>
        <Users/>     

    </div>
}