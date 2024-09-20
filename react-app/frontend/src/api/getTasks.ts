
async function getTasks () {
    const token = localStorage.getItem('access_token')

    try {
        const response = await fetch("http://127.0.0.1:5001/tasks/", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }}) 
        const result = response.json()
        return result
    } catch (error) {console.error('Error:', error);} 
}

export default getTasks