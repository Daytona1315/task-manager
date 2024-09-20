import { Link } from 'react-router-dom'

import '../main.css'
import promo_img from './../../assets/images/promo_img.jpg'
import { useState, useEffect } from 'react';

function Promo() {

    const [link, setLink] = useState('/auth')
    const [word, setWord] = useState('Sign In')

    useEffect(() => {
        function checkUser() {
            try {
                const username = localStorage.getItem('username')
                if (username!=null) {
                    setLink('/my-tasks')
                    setWord('My tasks')
                }
            } catch (error) {
                console.error('No user, sign in first', error);
                }
        } checkUser()
    }, [])

    return ( 
        <section className='promo'>

            <div className="container">
                <div className="promo_row">
                    <div className="promo_text_cont">
                        <p>Manage your tasks easily!</p>
                        <p className='promo_p'>Service absolutely free</p>
                        <Link className='promo_button' to={link}>{word}</Link>
                    </div>
                    
                    <div className="promo_img_cont">
                        <img className="promo_img" src={promo_img}></img>
                    </div>
                </div>
            </div>  

        </section>
     );
}

export default Promo;