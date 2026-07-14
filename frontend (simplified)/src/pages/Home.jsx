import React, { useState } from 'react'
import '../App.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const navigate = useNavigate();
  

  const [signInData, setSignInData] = useState({
    email:"",
    password:""
  })
  const [signUpData, setSignUpData] = useState({
    name:"",
    email:"",
    password:""
  })
  

  function handleSignIn(e){
    e.preventDefault()
        axios.post(
          `${apiUrl}/api/auth/login`, 
          signInData, 
          { withCredentials: true }
        )
        .then(res=> navigate('/tasks'))
        .catch(err=> alert(err.response?.data?.message))
  }

  function handleSignUp(e){
    e.preventDefault()
        axios.post(
          `${apiUrl}/api/auth/signup`, 
          signUpData, 
          { withCredentials: true }
        )
        .then(res=> navigate('/tasks'))
        .catch(err=> alert(err.response?.data?.message))
  }

  return (
    <main>
      {/* TOP */}
      <div className="top w-full h-1/2">
        <form 
        onSubmit={handleSignIn}
        className='h-full w-full'>
          <div className='h-full w-full flex flex-col gap-4 justify-center items-center'>
            <div>
              <label  className='mr-2' htmlFor='email'>Email :</label>
              <input type='email'
              value={signInData.email}
              onChange={(e)=>setSignInData({...signInData,email:e.target.value})}
              placeholder='email here' required name='email'/>
            </div>
            <div>
              <label className='mr-2' htmlFor='password'>Pass :</label>
              <input type='password'
              value={signInData.password}
              onChange={(e)=>setSignInData({...signInData,password:e.target.value})}
               placeholder='pasword here' required name='password'/>
            </div>
          <button type='submit' className='cursor-pointer bg-[#474747] px-3 pb-2 pt-1 rounded-lg'>Sign-in</button>
          </div>
        </form>
      </div>
      {/* BOTTOM */}
       <div className="top w-full h-1/2 border-t border-amber-50">
        <form 
        onSubmit={handleSignUp}
        className='h-full w-full'>
          <div className='h-full w-full flex flex-col gap-4 justify-center items-center'>
            <div>
              <label  className='mr-2' htmlFor='name'>Name :</label>
              <input type='text'
              value={signUpData.name}
              onChange={(e)=>setSignUpData({...signUpData,name:e.target.value})} 
              placeholder='name here' required name='name'/>
            </div>
            <div>
              <label  className='mr-2' htmlFor='email'>Email :</label>
              <input type='email'
              value={signUpData.email}
              onChange={(e)=>setSignUpData({...signUpData,email:e.target.value})} 
               placeholder='email here' required name='email'/>
            </div>
            <div>
              <label className='mr-2' htmlFor='password'>Pass :</label>
              <input type='password' 
              value={signUpData.password}
              onChange={(e)=>setSignUpData({...signUpData,password:e.target.value})} 
              placeholder='pasword here' required name='password'/>
            </div>
          <button type='submit' className='cursor-pointer bg-[#474747] px-3 pb-2 pt-1 rounded-lg'>Sign-up</button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Home