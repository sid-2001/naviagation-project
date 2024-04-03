import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios';

import './Develop.css'

const Floor = () => {

    const navigate = useNavigate()
    let { sitename, floor } = useParams();

    const userToken = JSON.parse(localStorage.getItem('token'));
    
    const [selectedFloor, setSelectedFloor] = useState([]);
    const [storesCat, setStoresCategories] = useState([]);
    const [node, setNode] = useState(["", ""]);

    useEffect(()=>{
        axios.post("/api/GetFloor",{"name": sitename, "floor": floor})
            .then(res=>{
                    setSelectedFloor(res.data.floor)
                    console.log(res.data.floor)
                }
            )
            .catch((err) => console.log(err))

            axios.post("/api/GetStoresAndCategories",{"name": sitename, "floor": floor})
            .then(res=>{
                console.log(res.data)
                    setStoresCategories(res.data)
                }
            )
            .catch((err) => console.log(err))
    }, [])

    const findPosition = (oElement) =>{
        if(typeof( oElement.offsetParent ) != "undefined")
        {
            for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
            {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            return [ posX, posY ];
        }
        else
        {
            return [ oElement.x, oElement.y ];
        }
    }


    const getCoordinates = async (e) =>{
        var PosX = 0;
        var PosY = 0;

        var ImgPos = findPosition(document.getElementById("baseImage"))
        
        if (!e) var e = window.event;
        if (e.pageX || e.pageY)
        {
            PosX = e.pageX;
            PosY = e.pageY;
        }
        else if (e.clientX || e.clientY)
        {
            PosX = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            PosY = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        PosX = PosX - ImgPos[0];
        PosY = PosY - ImgPos[1];

        await Swal.fire({
            title: '<strong><u>Add POI Here</u></strong>',
            input: 'select',
            text: 'Coordinates of chosen point: ' + PosX + ' ' + PosY,
            inputOptions: storesCat.stores,
            progressSteps: ['1', '2'],
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              'Next',
            cancelButtonText:
              'Cancel',
        }).then( (nodeName) => {
            Swal.fire({
                title: '<strong><u>Add POI Here</u></strong>',
                input: 'select',
                text: 'Coordinates of chosen point: ' + PosX + ' ' + PosY,
                inputOptions: storesCat.categories,
                progressSteps: ['1', '2'],
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                  'Confirm Addition of POI',
                cancelButtonText:
                  'Cancel',
            }).then( (category) => {
                if(!nodeName.value)
                    return
                if(!category.value)
                    return
                axios.post("/api/AddNode",{"name": sitename, "floor": floor, "floorId": selectedFloor[0]._id, "nodeName": storesCat.stores[nodeName.value], "category": storesCat.categories[category.value], "x": PosX, "y": PosY})
                    .then(res=>{console.log(res.data)})
                    .catch((err) => console.log(err))
            })
        })

        console.log(ImgPos[1], PosX, PosY)
    }

    const logout = () => {
    	localStorage.removeItem('token');
    	navigate("/Login")
  	};

    async function selectNode(nodeVal){
        if(node[0]==""){
            console.log(nodeVal)
            setNode([nodeVal, ""])
        }
        else{
            setNode([node[0], nodeVal])
            console.log(node)
            await Swal.fire({
                title: '<strong><u>Connect POIs Here</u></strong>',
                input: 'text',
                text: 'Please input distance',
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText:
                  'Submit',
                cancelButtonText:
                  'Cancel',
            }).then( (distance) => {
                    axios.post("/api/AddNodePair",{"name": sitename, "floor": floor, "floorId": selectedFloor[0]._id, "nodeA": node[0]._id, "nodeB": nodeVal._id, "distance": parseInt(distance.value), "x1": node[0].x, "y1": node[0].y, "x2": nodeVal.x, "y2": nodeVal.y})
                        .then(res=>{console.log(res.data); setNode(["", ""])})
                        .catch((err) => {console.log(err); setNode(["", ""])})
                })
        }
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
                <br/><br/><br/><br/>
                <div class="box-element-flex">
                    

                    <div class="develop-container floor">

                    <>
                    <div>
                        <div class="title-element">{sitename} : Floor {floor}</div> <br/>
                        <div className="base-image-container">
                            <img class="base-image" src={selectedFloor[0] ? selectedFloor[0].conf : ""} id="baseImage" onClick={ () => getCoordinates()}/>
                            

                                {selectedFloor[0] ? selectedFloor[0].adjacency.map(path => (  
                                <>
    
                                
                                <svg class="lines" onClick={ () => getCoordinates()}>
                                    <line x1={path.x1} y1={path.y1} x2={path.x2} y2={path.y2} stroke="black"/>
                                </svg>

                                </>

                            
                            )) : ""}
                            {selectedFloor[0] ? selectedFloor[0].nodes.map(node => (  
                                <>
                                <div class="node" style={{ "left": node.x-12, "top": node.y-12}} onClick={() => selectNode(node)}></div>
                            

                                </>

                            
                            )) : ""}
                        </div>
                    </div>
                    </>
                    </div>
                    
                </div>
            </div>
        </div>
            
        </>
    )
}
export default Floor