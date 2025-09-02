
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import { IoIosLogOut } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import Axios from '../utils/Axios'
import SummaeryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast'
import { LuExternalLink } from "react-icons/lu";
import AxiosToastError from '../utils/AxiosToastError';
import { FcApproval } from "react-icons/fc";
import { FcSignature } from "react-icons/fc";
import { FcCheckmark } from "react-icons/fc";
import { FcDebian } from "react-icons/fc";
import { FaBluesky } from "react-icons/fa6";
import isAdmin from '../utils/isAdmin';

const UserMenu = ({close}) => {
const user = useSelector((state)=>state.user)
const dispatch = useDispatch()
const navigate = useNavigate()
const handelLogout = async()=>{
  try {
    const response = await Axios({
      ...SummaeryApi.logout
    })
    if (response.data.success) {
      if (close) {
        close()
      }
      
      dispatch(logout())
      localStorage.clear()
      toast.success(response.data.message)
      navigate("/")
    }
  } catch (error) {
    AxiosToastErrorastError(error)
  }
}
const handelClose =()=>{
  if (close) {
    close()
  }
}
  return (
    <div>
      <div className='flex items-center  gap-1.5'>
        <div className='font-semibold'>My Account </div>
      <span className='text-red-600'><FaBluesky /></span>   
      </div>
      
      <div className=' text-sm flex items-center gap-2'><span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='font-medium text-red-500'>({user.role === "ADMIN" ? "Admin":""})</span></span>
      <Link to={"/dashboard/profile"} onClick={handelClose}className='hover:text-pink-600'> <LuExternalLink size={15}/></Link> </div>

      <Divider/>
      <div className='text-sm grid gap-1 '>
        {
          isAdmin(user.role) && (
             <div className='flex items-center gap-1 hover:bg-green-200 rounded py-1'>
          <Link onClick={handelClose} to={"/dashboard/product"} className='px-2'>Product</Link>
          <FcApproval />          

        </div>
          )
        }
        {
          isAdmin(user.role) && (
              <div className='flex items-center gap-1 hover:bg-green-200 rounded py-1'>
          <Link onClick={handelClose} to={"/dashboard/upload-product"} className='px-2'>Upload Product</Link>
          <FcSignature />

        </div>
          )
        }
        {
          isAdmin(user.role) && (
             <div className='flex items-center gap-1 hover:bg-green-200 rounded py-1'>
          <Link onClick={handelClose} to={"/dashboard/subcategory"} className='px-2'>SubCatagory</Link>
          <FcDebian />

        </div>
          )
        }
        {
          isAdmin(user.role) && (
             <div className='flex items-center gap-1 hover:bg-green-200 rounded py-1'>
          <Link onClick={handelClose} to={"/dashboard/category"} className='px-2'>Category</Link>
         <FcCheckmark />

        </div>
          )
        }

        

        
         
         

        <div className='flex items-center gap-1 hover:bg-green-200 rounded py-1'>
          <Link onClick={handelClose} to={"/dashboard/myorders"} className='px-2'>My Order</Link>
          <BsBoxSeam />

        </div>
        
        <div className='flex items-center gap-1 hover:bg-green-200 rounded py-1
        '>
           <Link onClick={handelClose} to={"/dashboard/address"} className='px-2 '>Save Address</Link><FaAddressCard className='text-slate-500'/>
        </div>
       
        <div className='flex items-center gap-1  '>
          <button onClick={handelLogout} className='text-left bg-red-100 rounded border border-red-200 hover:bg-red-300 p-0.5'>Log Out</button>
           <IoIosLogOut />
        </div>
       
      </div>
    </div>
  )
}

export default UserMenu
