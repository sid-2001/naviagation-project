import './App.css';

import {
  BrowserRouter as Router, 
  Routes, 
  Route

} from "react-router-dom";
import {useState} from 'react';

import Home from "./components/home/Home"
import Login from "./components/login/Login"
import Register from "./components/register/Register"
import AddSite from "./components/addSite/AddSite"
import Develop from "./components/developSite/Develop"
import Floor from "./components/developSite/Floor"

import useToken from './useToken'

function App() {

  const {user, setLoginUser} = useToken();

  console.log(user)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={user && user._id ? <Home/>:<Login setLoginUser={setLoginUser}/>} />
          <Route path="/AddSite" element={user && user._id ? <AddSite/>:<Login setLoginUser={setLoginUser}/>} />
          <Route path="/develop/:sitename" element={user && user._id ? <Develop/>:<Login setLoginUser={setLoginUser}/>} />
          <Route path="/develop/:sitename/:floor" element={user && user._id ? <Floor/>:<Login setLoginUser={setLoginUser}/>} />
          <Route path="/Login" element={user && user._id ? <Home/>:<Login setLoginUser={setLoginUser}/>}/>
          <Route path="/Register" element={user && user._id ? <Home/>:<Register/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
