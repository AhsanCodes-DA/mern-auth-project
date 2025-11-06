import React from 'react'

const FBpage = () => {




  return (
<body className='bg-gray-200'>



<div className='container mt-40  flex flex-row mr-auto justify-center items-center'>

<div className='left w-1/2 mr-18 '>
 

<h1 className=' text-7xl font-extrabold mx-1 mt-3 text-blue-700'> Facebook</h1>


<p className='text-3xl py-5 ml-1 '> Facebook helpss you connect and share with the people in your life.</p>

</div>

 <div className='right flex flex-col bg-white p-8 w-fit rounded-lg relative'>

<input type='text' className='bg-white my-2 px-4 h-11 outline-blue-400 border-1  rounded-lg border-gray-200' placeholder='Email address or phone number' />

<input type='password'  className='bg-white my-2 px-4 h-11 border-1 outline-blue-400 rounded-lg border-gray-200  ' placeholder='Psssword' />

<button className='bg-blue-600 hover:bg-blue-700  text-white my-1 py-2 rounded-md font-bold'> Log in</button>

<span className='text-blue-600 text-center my-1.5 text-sm py-1.5 mb-3 cursor-pointer hover:underline' >Forgotten password? </span>

<hr className=''/>


<button className='bg-green-600  hover:bg-green-700  mx-auto w-fit px-4 text-white mt-[37px] p-2.5  rounded-md font-bold'>Create new Account</button>



<span className='absolute -bottom-14 text-sm' >

  <span className='font-bold hover:underline cursor-pointer'> Create a Page </span>
  for a celebrity,brand or business.
</span>

 </div>



        
    </div>


    </body>
  )
}

export default FBpage
