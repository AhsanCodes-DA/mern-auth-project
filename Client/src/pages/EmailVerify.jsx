import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../Context-API/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
 axios.defaults.withCredentials=true

  const navigate = useNavigate();

  const inputRef = React.useRef([]);
  
  const{backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContent);

  // Function to move focus to the next input box
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  // Function to handle backspace and move focus to the previous input box
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // Function to handle paste event
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').trim(); // Get pasted data
    const pasteArray = paste.split('').slice(0, 6); // Limit to 6 characters

    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char; // Update input value
      }
    });

    // Focus on the last input field after pasting
    if (pasteArray.length > 0) {
      inputRef.current[pasteArray.length - 1].focus();
    }
  };

  const onSubmitHandler = async(e)=>{
 
try{

e.preventDefault();
 const otpArray=inputRef.current.map(e=>e.value)
 const otp=otpArray.join('')

 const {data}=await axios.post(backendUrl+'/api/auth/verify-account',{otp})

 if(data.success){

  toast.success(data.message)
    getUserData()
    navigate('/')
 } else{

  toast.error(data.message)
 }

  }
  catch (error){
  toast.error(error.message)

    }

  }

  useEffect(()=>{
 isLoggedIn && userData && userData.isAccountVerified && navigate('/')

  },[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=''
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type='text'
                maxLength='1'
                key={index}
                required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'

                ref={(el) => (inputRef.current[index] = el)} // Assign ref to each input
                onInput={(e) => handleInput(e, index)} // Handle input change
                onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
              />
            ))}
        </div>

        <button className='w-full py-3 bg-gradient-to-br from-indigo-500 to-indigo-900 text-white rounded-full'>
          Verify Email
        </button>
      </form>
    </div>
  );
}; 

export default EmailVerify;