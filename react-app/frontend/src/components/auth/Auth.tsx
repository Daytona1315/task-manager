import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './loginsignup.css'

const LoginSignup = () => {
  
  const [action, setAction] = useState('Sign In')
  const navigate = useNavigate();

  const [regFields, setRegistrationFields] = useState({
    email: '',
    username: '',
    password: '',
  });
 
  const handleRegistrationSubmit = async () => {
    if (action==='Sign Up') {
      if (regFields.username === '' || regFields.email === '' || regFields.password === '') {
        alert('All fields are required!');
        return;
      }
    }
    if (action==='Sign In') {
      if (regFields.username === '' || regFields.password === '') {
        alert('All fields are required!');
        return;
      }
    }

    // Send registration data to API
    try {
      
      // SIGN UP
        if (action==='Sign Up') {
          const response = await fetch('http://127.0.0.1:5001/auth/sign-up/', {
            method: 'POST',
            body: JSON.stringify(regFields),
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
            },
          });
          if (!response.ok) {
            await response.json();
            if (response.status === 409) {
              alert('Email already exist!');
            }
          } 
          else {
            const data = await response.json();
            const str = JSON.stringify(data)
            const json = JSON.parse(str)
            const token = json.access_token
            localStorage.setItem('access_token', token);
            navigate('/my-tasks')
          } 
        }

      // SIGN IN

        if (action==='Sign In') {
          const response = await fetch('http://127.0.0.1:5001/auth/sign-in/', {
            method: 'POST',
            body: JSON.stringify(regFields),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            await response.json();
            if (response.status === 409) {
              alert('User not found!');
            }
            if (response.status === 401) {
              alert('Password is incorrect!');
            }
          } 
          else {
            const data = await response.json();
            const str = JSON.stringify(data)
            const json = JSON.parse(str)
            const token = json.access_token
            localStorage.setItem('access_token', token);
            navigate('/my-tasks')
          } 
        }

    } catch (error) {console.error('Error:', error);};
  }

  return ( 

      <>
        <div className='login_container'>
          <div className='login_header'>
            <div className='login_text'>{action}</div>
            <div className='login_underline'></div>
          </div>
          <div className='login_inputs'>

            {action==='Sign In'?<div style={{height: '80' + 'px'}}></div>:
            <div className='login_input'>
              <input type='email' placeholder='E-mail' maxLength="20"
              onChange={(e) => setRegistrationFields({ ...regFields, email: e.target.value })}
              value={regFields.email}>
              </input>
            </div>}

            <div className='login_input'>
              <input type='username' placeholder='Username' maxLength="20"
              onChange={(e) => setRegistrationFields({ ...regFields, username: e.target.value })}
              value={regFields.username}>
              </input>
            </div>

            <div className='login_input'>
              <input type='password' placeholder='Password' maxLength="32"
              onChange={(e) => setRegistrationFields({ ...regFields, password: e.target.value })}
              value={regFields.password}>
              </input>
            </div>

          </div>

          {action==='Sign Up'?<div style={{height: '49' + 'px'}}></div>:
          <div className='forgot_password'>Forgot password?
            <span> Restore</span>
          </div>}

          <div className='submit_button'>
            <span onClick={handleRegistrationSubmit}>Submit</span>
          </div>
          <div className='login_submit_container'>
            <div className=
            {action==='Sign In'?'login_submit': 'login_submit gray'}
            onClick={() => {setAction('Sign In')}}>Sign In</div>
            <div className=
            {action==='Sign Up'?'login_submit': 'login_submit gray'}
            onClick={() => {setAction('Sign Up')}}>Sign Up</div>
          </div>
          
        </div>
      </>

   );
}

export default LoginSignup;