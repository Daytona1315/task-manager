import './head.css'
import '../main.css'
import { Link } from "react-router-dom";

import { useState, useEffect } from 'react';

const Head = () => {
    
    const storedToken = localStorage.getItem('access_token');

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [buttonSignIn, setButtonSignIn] = useState('invisible')

    useEffect(() => {
        async function getInfo(): Promise<any> {
            try {
                const response = await fetch("http://127.0.0.1:5001/auth/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                },
                });
                if (!response.ok) {
                    throw new Error('Error');
                }
                const data = await response.json()
                setUserData(data)
                localStorage.setItem('username', data.username)
                setButtonSignIn('sign_out')

            }   catch (error) {
                console.error('Error:', error);
                } finally {
                    setLoading(false); // Устанавливаем состояние загрузки в false после получения данных
                }
        } getInfo() 
        
    }, [storedToken])
    
    if (loading) {
        return (
            <div><h1>Loading...</h1></div>
        )
    }
    
    return ( 

        <>
            <header>
                <div className="container">
                    <div className="head_row">
                        <div className="my_tasks">
                            <h1 className='head_h1'>My Tasks</h1>
                            <div className="underline"></div>
                        </div>
                        <div className="nav">
                            <div className='username'>{userData === null?
                                <div style={{fontWeight: 700, fontSize: 'x-large'}}>
                                    <Link to={'/'}>Sign In</Link>
                                </div>
                                :userData.username}</div>
                            <div className={buttonSignIn} onClick={() => localStorage.clear()}>
                                <Link to='/' className='a'>Sign Out</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>

    );
}

export default Head;