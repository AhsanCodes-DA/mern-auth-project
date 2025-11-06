import React from 'react';
import { useNavigate } from 'react-router-dom';

const TailwindPage = () => {


  const navigate =useNavigate();




  return (
    <div className='h-full bg-gradient-to-r from-blue-500 to-white-300' >
      {/* Navbar */}
      <div className='flex flex-col space-y-14 justify-center items-center w-full'>
        <ul className='flex flex-row items-center bg-purple-600 w-full py-4 px-14'>
          <li className='cursor-pointer text-2xl font-semibold mr-8'>Home</li>
          <div className='flex-grow'>
            <input
              type='text'
              className='w-full  ml-40 max-w-md sm:text-xl py-2 px-6 text-center outline-none border border-gray-600 bg-slate-900 text-white rounded-full'
              placeholder='Enter a Name of Product'
            />
          </div>
          <li className='cursor-pointer text-xl font-semibold mx-4'>Docs</li>
          <li className='cursor-pointer text-xl font-semibold mx-4'>Products</li>
          <li className='cursor-pointer text-xl font-semibold ml-4'>Sign In</li>
        </ul>

        {/* Content */}
        <h1 className='font-serif text-6xl   tracking-tighter mx-2 my-2  lg:text-2xl'>
          Hii, This is tailwind Understanding page
        </h1>
        <h1 className='font-bold text-2xl  py-8'>This is also</h1>

        {/* Button */}
        <button  onClick={()=>(navigate('/https/facebook.com'))}  className='p-2.5 bg-amber-600 text-xl font-serif text-center border rounded-full border-purple-600 hover:bg-blue-600 hover:text-black hover:tracking-wider  focus:bg-blue-300 focus:font-semibold transition-all'>
          Click me to see FB Page
        </button>

        <button className='  border-2  border-amber-600 hover:text-gray-100
        hover:bg-blue-300 focus:bg-red-800 p-2 w-30 text-center text-black rounded-full  bg-amber-600'> Click me</button>
      </div>

      {/* Footer */}
      <h2 className=' font-semibold text-7xl my-18 ml-110'>Using for margin</h2>
    </div>
  );
};

export default TailwindPage;