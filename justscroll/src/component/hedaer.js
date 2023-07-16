
import React, { useState } from 'react'
import '../App.css';
import logo from '../Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClose, faCoffee, faPagelines } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from "react-router-dom";
const Header = () => {
    const [isOpne,setIsOpen]=useState("none")
    return (
      <div className="App">
      <div className='appHeader' >
      <NavLink  style={{textDecoration:'none',color:'#ff4040'}} to="/">   <img src={logo}  className='appLogo'/></NavLink>
         {
          isOpne=="none"?<FontAwesomeIcon icon={faBars}  style={{marginRight:10}} onClick={()=>setIsOpen("block")}/>:
          <FontAwesomeIcon icon={faClose}  style={{marginRight:10}} onClick={()=>setIsOpen("none")}/>
         }
         
        
      </div>
     
      <div className="sideNavigation" style={{display:isOpne}}>
       <p style={{margin:'10px'}}>About Us</p>
       <p style={{margin:'10px'}}><NavLink  style={{textDecoration:'none',color:'#ff4040'}} to="/verification">Creator Verification</NavLink></p>
       <p style={{margin:'10px'}}><NavLink  style={{textDecoration:'none',color:'#ff4040'}} to="/dashbord">Creator Dashbord</NavLink></p>
       <p style={{margin:'10px'}}>Terms & Condition</p>
       <p style={{margin:'10px'}}>Privacy Policy</p>
       
      
      </div>
      </div>
    )
}

export default Header

