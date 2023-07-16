
import React from 'react'
import Header from './hedaer'

const Verification = () => {

  return (
    
    <div>
        <Header />
        <div style={{marginTop:"50px",textAlign:'center'}}>
        <h2>JustScroll</h2>
        <h3>Creator Verification</h3>

        <input type="email" placeholder='Enter your email '  /><br></br>
        <button>Get Early Access</button>
        </div>
        <div className='verificationSection' style={{marginTop:'30px',padding:'10px'}}>
          <p>Why do i need a creator verification? </p>
        </div>
            
    </div>
  )
}

export default Verification

