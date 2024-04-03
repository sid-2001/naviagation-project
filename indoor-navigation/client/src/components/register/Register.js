import React , {useState} from 'react'
import axios from "axios";

const Register = () => {
    const [user,setUser] = useState({
        name:"",
        email:"",
        password: ""
    })
    const handleChange = e =>{
    const {name,value} = e.target
    setUser({
    ...user,//spread operator 
    [name]:value
    })
    }
    //register function 
    const egister = ()=>{
    const {name,email,password} = user
    if (name && email && password){
        axios.post("/api/Register",user )
                .then(res=>console.log(res))
                .catch((err) => console.log(err))
        }
    else{
        alert("invalid input")
    };
}
    
    return (
        <>    
            <div class="container">
              <header class="header">
                <img src="logo_bg.png" />
                <h2 class="title">Indoor Navigation Register</h2>
                <span class="good">Welcome! Please register for an account below.</span>
              </header>

              <form name="signin" class="form">
                <label for="name" class="label-email">
                  <span class="email-span">Full Name</span>

                  <div class="input-email-container">
                    <i class="ph-envelope"></i>
                    <input type="text" name="name" value={user.name} onChange={handleChange} id="name" class="input-email" placeholder="Enter your full name" autoFocus />
                  </div>
                </label>

                <label for="email" class="label-email">
                  <span class="email-span">Email address</span>

                  <div class="input-email-container">
                    <i class="ph-envelope"></i>
                    <input type="email" name="email" value={user.email}  onChange={handleChange} id="email" class="input-email" placeholder="Enter your email" />
                  </div>
                </label>

                <label for="password" class="label-password">
                  <span class="password-span">Password</span>

                  <div class="input-password-container">
                    <i class="ph-lock"></i>
                    <input type="password" name="password" value={user.password}  onChange={handleChange} id="password" class="input-password" placeholder="*************" />
                  </div>

                </label>

                <button type="button" class="btn-sign-in" onClick={egister}>Sign Up</button>
              </form>

              <footer class="footer">
                <a href="/Login" class="footer-link">Already have an account? Sign In!</a>
              </footer>

            </div>
        </>
    )
}

export default Register