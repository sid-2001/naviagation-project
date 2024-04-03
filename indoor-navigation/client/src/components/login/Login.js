import React,{useState} from 'react'
import axios from 'axios';
import {useNavigate} from "react-router-dom"

import './login.css'

const Login = ({setLoginUser}) => {

    const navigate = useNavigate()

    const [user,setUser] = useState({
        name:"",
        password: ""
    })

    const handleChange = e =>{
    const {name,value} = e.target
    setUser({
    ...user,//spread operator 
    [name]:value
    })
    }

    const login =()=>{
        axios.post("/api/Login",user)
            .then(res=>{console.log(res.data)
            setLoginUser(res.data.user)
            navigate("/")
            console.log(res)})
            .catch((err) => console.log(err))
    }
    return (
        <>
        <div class="container">
          <header class="header">
            <img src="logo_bg.png" />
            <h2 class="title">Indoor Navigation Login</h2>
            <span class="good">Welcome back! Good to see you again.</span>
          </header>

          <form name="signin" class="form">
            <label for="email" class="label-email">
              <span class="email-span">Email address</span>

              <div class="input-email-container">
                <i class="ph-envelope"></i>
                <input type="email" name="email" value={user.email}  onChange={handleChange} id="email" class="input-email" placeholder="Enter your email" autofocus />
              </div>
            </label>

            <label for="password" class="label-password">
              <span class="password-span">Password</span>

              <div class="input-password-container">
                <i class="ph-lock"></i>
                <input type="password" name="password" value={user.password}  onChange={handleChange} id="password" class="input-password" placeholder="*************" />
              </div>

            </label>

            <button type="button" class="btn-sign-in" onClick={login}>Sign In</button>
          </form>

          <footer class="footer">
            <a href="/Register" class="footer-link">Don't have an account yet? Sign Up!</a>
          </footer>

        </div>

        </>
    )
}
export default Login