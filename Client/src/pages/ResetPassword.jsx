import React, { useContext, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context-API/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;
   


  const navigate = useNavigate();
  const inputRef = useRef([]); // Initialize refs for OTP inputs

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false); // Initialize as boolean

  const [otp, setOtp] = useState(''); // Initialize as empty string

  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);



  // Function to move focus to the next input box // Auto-Space
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();  //for auto move to next box 
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


  
// Function to submit email and send OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  // Function to submit OTP
  const onSubmitOtp = async (e) => {
    e.preventDefault();

    const otpArray = inputRef.current.map((input) => input.value);
    const otpValue = otpArray.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };



  // Function to reset password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword: password, // Use `password` instead of `newPassword`
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };
  
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Logo'
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Email form to send OTP */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='Email Icon' className='w-3 h-3' />
            <input
              type='email'
              value={email}
              placeholder='Email'
              className='bg-transparent outline-none text-white'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className='w-full py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      )}

      {/* OTP input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type='text'
               
                  key={index}
                  required
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  ref={(el) => (inputRef.current[index] = el)}
                  onInput={(e) => handleInput(e, index)} //Auto-Space
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button className='w-full py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      )}

      {/* Enter new password form */}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Enter New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password below</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='Lock Icon' className='w-3 h-3' />
            <input
              type='password'
              value={password}
              placeholder='Password' 
              className='bg-transparent outline-none text-white'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className='w-full py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;