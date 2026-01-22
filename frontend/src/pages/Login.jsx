import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const {backendUrl,token,setToken}=useContext(AppContext)

  const navigate=useNavigate()

  const [state, setState] = useState('Sign up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandleer = async (event) => {
    event.preventDefault()

    try {
      

      if(state==='Sign up'){
        const {data}=await axios.post(backendUrl+'api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }else{
        const {data}=await axios.post(backendUrl+'api/user/login',{password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    if (token){
      navigate('/')
    }
  },[token])


  return (
    <form onSubmit={onSubmitHandleer}  className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign up' ? "Sign up" : "Log in"} to book Appointment</p>

        {
          state === 'Sign up' && <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} />
          </div>
        }



        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>


        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>

        <button type='submit' className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base'>{state === 'Sign up' ? "Create Account" : "Login"}</button>

        {
          state === "Sign up"
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-[#5f6FFF] underline cursor-pointer'> Login here</span></p>
            : <p>Create an new account? <span onClick={() => setState('Sign up')} className='text-[#5f6FFF] underline cursor-pointer'> click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login