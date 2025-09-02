import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
const Footer = () => {
  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+918334815137');
    alert('Phone number copied to clipboard!');
  };
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('seedskraft9@gmail.com');
    alert('Email address copied to clipboard!');
  };
  return (
    <footer className='border-t border-gray-300'>
      <div className='container mx-auto p-4 text-center flex flex-col gap-2 lg:flex-row lg:justify-between'>
         <p> © All Rights Reserved 2025</p>

         <div className='flex items-center gap-4 justify-center text-2xl'>
            {/* <a href="" className='hover:text-blue-500'>
               <FaFacebookSquare />
            </a> */}
            <a href="" className='hover:text-pink-600 flex items-center gap-1'>
              <FaPhone />  <p className='text-sm font-mono' onClick={handleCopyNumber}>+918334815137</p>
            </a>
            <a href="" className='hover:text-green-500 flex items-center gap-1'>
               <IoIosMail />  <p className='text-sm font-mono' onClick={handleCopyEmail}>seedskraft9@gmail.com</p>
            </a>
         </div>
      </div>
    </footer>
  )
}

export default Footer
