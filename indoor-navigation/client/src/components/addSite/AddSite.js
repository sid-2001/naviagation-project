import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios';

import './AddSite.css'

const AddSite = () => {

    function useForceUpdate(){
        const [value, setValue] = useState(0);
        return () => setValue(value => value + 1); 
    }

	const navigate = useNavigate()
    const forceUpdate = useForceUpdate();

    const [floors, setFloors] = useState(1);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [floorInfo, setFloorInfo] = useState([[{}]])

    const [stores, setStores] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null)

    function handleChange(event){
        setFloors(event.target.value)
    }

    function handleName(event){
        setName(event.target.value)
    }

    function handleDescription(event){
        setDescription(event.target.value)
    }

    function handleStoreName(id, store_index, event){
        let temp_floorInfo = floorInfo

        for(let i = temp_floorInfo.length; i<floors; i++){
            temp_floorInfo.push([{}])
        }

        if ("stores" in temp_floorInfo[id][0]){

            for(let i = temp_floorInfo[id][0]["stores"].length; i<=store_index; i++){
                temp_floorInfo[id][0]["stores"].push({})
            }
    
            temp_floorInfo[id][0]["stores"][store_index]["store"] = event.target.value

        }

        else{
            temp_floorInfo[id][0]["stores"] = []
            for(let i = temp_floorInfo[id][0]["stores"].length; i<=store_index; i++){
                temp_floorInfo[id][0]["stores"].push({})
            }
    
            temp_floorInfo[id][0]["stores"][store_index]["store"] = event.target.value
        }

        setFloorInfo(floorInfo)
        
    }

    function handleStoreCategory(id, store_index, event){
        let temp_floorInfo = floorInfo

        for(let i = temp_floorInfo.length; i<floors; i++){
            temp_floorInfo.push([{}])
        }

        if ("stores" in temp_floorInfo[id][0]){

            for(let i = temp_floorInfo[id][0]["stores"].length; i<=store_index; i++){
                temp_floorInfo[id][0]["stores"].push({})
            }
    
            temp_floorInfo[id][0]["stores"][store_index]["category"] = event.target.value

        }

        else{
            temp_floorInfo[id][0]["stores"] = []
            for(let i = temp_floorInfo[id][0]["stores"].length; i<=store_index; i++){
                temp_floorInfo[id][0]["stores"].push({})
            }
    
            temp_floorInfo[id][0]["stores"][store_index]["category"] = event.target.value
        }

        setFloorInfo(floorInfo)
        
    }

    function submitData(){
        const data = {
            "name": name,
            "description": description,
            "floors": floorInfo
        }

        axios.post("/api/AddSite", data)
            .then(res=>{
                if(res.data.message){
                    if(res.data.message=="sucessfull"){
                        Swal.fire({
                            icon: 'success',
                            title: 'SUCCESS',
                            text: 'Site Added Successfully!',
                            footer: 'Please head to Dashboard to view details'
                          })
                    }
                }

            })
            .catch((err) => console.log(err))

        console.log(data)
    }

    function handleStoreChange(id){
        const temp_stores = stores; 
        
        for(let i = temp_stores.length; i<floors; i++){
            temp_stores.push([])
        }

        let store_index = temp_stores[id].length 

        temp_stores[id].push(<>
            
            <div class="input_grp">
                <div class="input_wrap">
                    <label for="fname">Name</label>
                    <input type="text" onChange={(event) => {handleStoreName(id, store_index, event)}}/>
                </div>
                <div class="input_wrap">
                    <label for="lname">Category</label>
                    <input type="text" onChange={(event) => {handleStoreCategory(id, store_index, event)}}/>
                </div>
            </div>
            
            </>)
        setStores(temp_stores)
    }

    function onFileChange(id, event){
        let temp_floorInfo = floorInfo

        for(let i = temp_floorInfo.length; i<floors; i++){
            temp_floorInfo.push([])
        }

        var reader = new FileReader();
        reader.onloadend = function() {
            temp_floorInfo[id][0]["conf"] = reader.result
            setFloorInfo(temp_floorInfo)
        }
        reader.readAsDataURL(event.target.files[0]);
    };

	const logout = () => {
    	localStorage.removeItem('token');
    	navigate("/Login")
  	};

    const userToken = JSON.parse(localStorage.getItem('token'));

    const Field = ({id}) => {
        return (
        <>
        <hr/> <br/>
        <div class="input_wrap">
            <label>Details of Floor {id+1}:</label>
            <br/>

            <label>Upload Floor Congifuration</label>
            <input type="file" onChange={(event) => {onFileChange(id, event)}} />
            <br/><br/>
            {stores[id]}

            <div class="store-add-button">
                <button onClick={() => {handleStoreChange(id); forceUpdate()}} type="button">Add Another Store</button>
            </div>
        </div>
        <hr/> <br/>
        </>
    ) };
    
    const fields = [];
    for (let i = 1; i <= floors; i++) {
        fields.push(<Field id={i-1}/>);
    }

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

                <div class="wrapper">
                    <div class="registration_form">
                        <div class="title">
                            Details of New Site
                        </div>

                        <form>
                            <div class="form_wrap">
                                <div class="input_grp">
                                    <div class="input_wrap">
                                        <label for="fname">Name</label>
                                        <input type="text" id="fname" onChange={handleName}/>
                                    </div>
                                    <div class="input_wrap">
                                        <label for="floorNum">Number of Floors</label>
                                        <select onChange={handleChange}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(floor => (  
                                            <option>{floor}</option>
                                        ))}  
                                        </select>
                                    </div>
                                </div>
                                <div class="input_wrap">
                                    <label for="email">Description</label>
                                    <input type="text" id="email" onChange={handleDescription}/>
                                </div>

                                {fields}
                                <div class="input_wrap">
                                    <input type="button" value="Register Now" class="submit_btn" onClick={submitData}/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                    
                </div>
            </div>
        </div>
            
        </>
    )
}
export default AddSite