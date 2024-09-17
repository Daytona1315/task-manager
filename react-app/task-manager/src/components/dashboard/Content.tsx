import './content.css'
import '../main.css'
import Task from './Task'

import { useEffect, useState } from 'react'

const Content = () => {
    
    const storedToken = localStorage.getItem('access_token');
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
                    try {
                        const response = await fetch("http://127.0.0.1:5001/tasks/", {
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${storedToken}`
                            }})
                        if (!response.ok) {
                            console.log("Couldn't get data")
                        }
                        else {const result = await response.json();
                            setData(result)
                        }
                        }
                        catch (error) {console.error('Error:', error);}
                        finally {
                            setLoading(false)
                        }
                    };

        useEffect(() => {
             fetchData();
            }, []);

            if (loading) {
                return (
                    <div><h1>Loading...</h1></div>
                )
            }

            if (data===null) {
                return (
                    <div className='no_tasks'><h1>No tasks</h1></div>
                )
            }

            return ( 

                <>
                    <div>
                    {data.map(task => (
                        <Task key={task.id} taskData={task} token={storedToken} getTask={fetchData} />
                    ))}
                    </div>
                    
                </>
        
             );
        }
 
export default Content;