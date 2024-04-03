import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios';


import './Home.css'

const Home = () => {

	const navigate = useNavigate()

    const [sites, setSites] = useState([])
    const [selectedSite, setSelectedSite] = useState("")

    const userToken = JSON.parse(localStorage.getItem('token'));

    useEffect(()=>{
        axios.get("/api/GetSites")
        .then(res=>{setSites(res.data); console.log(res.data)
        })
        .catch((err) => console.log(err))
    }, [])

    const goToSite = (siteName) => {
        navigate("/develop/"+siteName)
    } 

	const logout = () => {
    	localStorage.removeItem('token');
    	navigate("/Login")
  	};

    return (
        <>

            <div class="Side-bar">
            <div class="Box-logo">Nav System</div>
            <div class="box-alert-infomation">
                <div class="box-infomation">
                    <img class="info-avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx9tjaExsY-srL4VsHNE_OKGVCJ-eIFNBktw&usqp=CAU" />
                    <div class="info-name">{userToken.name}</div>
                </div>
            </div>
            <div class="Box-menu">
                <div class="side-header">GENERAL</div>
                <ul class="ul-menu">
                    <li class="li-mneu Active-menu">
                        <img src="/dashboard.png" alt="dashboard"/>
                        <div class="title-menu"> &nbsp; &nbsp; Dashboard</div>
                    </li>
                    <li class="li-mneu">
                        <img src="/add.png" alt="add"/>
                        <div class="title-menu" onClick={() => {navigate("/AddSite")}}> &nbsp; &nbsp; Add New Site</div>
                    </li>
                    <li class="li-mneu logout">
                        <svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512">
                            <link xmlns="" type="text/css" rel="stylesheet" id="dark-mode-custom-link" />
                            <link xmlns="" type="text/css" rel="stylesheet" id="dark-mode-general-link" />
                            <style xmlns="" lang="en" type="text/css" id="dark-mode-custom-style" />
                            <style xmlns="" lang="en" type="text/css" id="dark-mode-native-style" />
                            <style xmlns="" lang="en" type="text/css" id="dark-mode-native-sheet" />
                            <path
                                d="M11.476,15a1,1,0,0,0-1,1v3a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7.476a3,3,0,0,1,3,3V8a1,1,0,0,0,2,0V5a5.006,5.006,0,0,0-5-5H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7.476a5.006,5.006,0,0,0,5-5V16A1,1,0,0,0,11.476,15Z" fill="orange"/>
                            <path
                                d="M22.867,9.879,18.281,5.293a1,1,0,1,0-1.414,1.414L21.13,10.97,6,11a1,1,0,0,0,0,2H6l15.188-.03-4.323,4.323a1,1,0,1,0,1.414,1.414l4.586-4.586A3,3,0,0,0,22.867,9.879Z" fill="orange"/>
                        </svg>
                        <div class="title-menu" onClick={logout}>Logout</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="Page">
            <div class="Box-header">
                <div class="Box-search">
                    <svg class="icon-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                        <link xmlns="" type="text/css" rel="stylesheet" id="dark-mode-custom-link" />
                        <link xmlns="" type="text/css" rel="stylesheet" id="dark-mode-general-link" />
                        <style xmlns="" lang="en" type="text/css" id="dark-mode-custom-style" />
                        <style xmlns="" lang="en" type="text/css" id="dark-mode-native-style" />
                        <style xmlns="" lang="en" type="text/css" id="dark-mode-native-sheet" />
                        <g fill="none" fill-rule="evenodd">
                            <path d="m0 0h32v32h-32z" />
                            <path
                                d="m15 0c8.2842712 0 15 6.71572875 15 15 0 3.7823596-1.3999424 7.2377452-3.7099407 9.8762702l5.3667949 5.3663705-1.4142135 1.4142135-5.3663705-5.3667949c-2.638525 2.3099983-6.0939106 3.7099407-9.8762702 3.7099407-8.28427125 0-15-6.7157288-15-15 0-8.28427125 6.71572875-15 15-15zm0 2c-7.17970175 0-13 5.82029825-13 13 0 7.1797017 5.82029825 13 13 13 7.1797017 0 13-5.8202983 13-13 0-7.17970175-5.8202983-13-13-13z"
                                fill="black" fill-rule="nonzero" />
                        </g>
                    </svg>
                    <input class="input-search" placeholder="Search" type="text" />
                </div>
            </div>

            <div class="Box-elements">
                <div class="box-element-flex">
                   

                    <div class="stocks ">
                    <br/><br/>
                        <div class="title-element">My Sites</div>
                        {sites.map(site => (  
                            <div class="stocks-main" onClick={() => goToSite(site.name)}>
                                <div class="sub-stocks">
                                    <div class="stocks-titles">{site.name}</div>
                                    <div class="stocks-status">{site.status}</div>
                                </div>
                            </div>  
                        ))}  
                        
                        <div class="stocks-main">
                            <div class="sub-stocks">
                                <div class="stocks-titles">Hiranandani Estate</div>
                                <div class="stocks-status up-trans">COMPLETE</div>
                            </div>
                        </div>
                        <div class="stocks-main">
                            <div class="sub-stocks">
                                <div class="stocks-titles">DLF Mall</div>
                                <div class="stocks-status up-trans">COMPLETE</div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </div>
            
        </>
    )
}
export default Home