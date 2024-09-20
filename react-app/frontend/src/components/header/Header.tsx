import '../dashboard/head.css'
import '../main.css'
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


function Header () {

    const [userClassName, setUserClassName] = useState('')
    const [username, setUsername] = useState('')
    const [buttonSignIn, setButtonSignIn] = useState('sign_in')
    const [buttonSignOut, setButtonSignOut] = useState('invisible')

    function signOut() {
        localStorage.clear()
        setButtonSignIn('sign_in')
        setButtonSignOut('invisible')
        setUsername('')
    }

    useEffect(() => {
        function  handleUsername() {
            try {
                const username = localStorage.getItem('username')
                if (username!=null) {
                    setUsername(username)
                    setButtonSignIn('invisible')
                    setUserClassName('username')
                    setButtonSignOut('sign_out')
                }
            } catch (error) {
                console.error('No user, sign in first', error);
                }
        }handleUsername()
    }, [username])
    
    return ( 
        <header className='header'>

            <div className="container">
                <div className="header_row">
                    <div className="header_button">
                        <Link to='/' className="header_button">ToDo</Link>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path></svg>
                    </div>
                    <div className="header_nav">
                        <div className={buttonSignIn}>
                            <Link to="/auth" className="header_button">Sign In</Link>
                        </div>
                        <div className={userClassName}>{username}</div>
                        <div className={buttonSignOut} onClick={signOut}>
                                <Link to='/' className="header_button">Sign Out</Link>
                        </div>
                    </div>
                </div>
            </div>

        </header>
     );
}

export default Header