import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaeryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector(state => state.user)
  const [openProfile,setOpenProfile] = useState(false)
  const [userData,setUserData] = useState({
    name:user.name,
    email:user.email,
    mobile: user.mobile,
  })
  const[loading,setLoading]= useState(false)
  const dispatch = useDispatch()
  useEffect(()=>{
    setUserData({
      name:user.name,
    email:user.email,
    mobile: user.mobile,
    })
  },[user])
  const handleOnChange =(e)=>{
    const {name,value}=e.target
    setUserData((preve)=>{
      return{
        ...preve,
        [name]:value
      }
    })
  }
  const handelSubmit = async (e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaeryApi.updateUserDetails,
        data:userData
      })
      const{data: responseData} = response

      if (responseData.success) {
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
    
       dispatch(setUserDetails(userData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className='p-4'>
      <div className='w-20 h-20 bg-red-300 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg'> 
        {
          user.avatar ? (
            <img
              alt={user.name}
              src={user.avatar}
              className='w-full h-full '
            />
          ) : (
            <FaRegUserCircle size={65}/>
          )
        }
      </div>
      <button
        onClick={() => setOpenProfile(true)}
        className='text-sm border min-w-20 px-4 py-2 rounded-full mt-3 border-amber-800 bg-amber-600 text-white font-semibold shadow-md transition duration-200 hover:bg-amber-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400'
      >
        Edit
      </button>
      {
        openProfile && (
          <UserProfileAvatarEdit close={() => setOpenProfile(false)} className='hover:text-red-500 hover:bg-red-400' />
        )
      }

      {/* display user name mobile email */}
      <form action="" className='my-4 grid gap-4'onSubmit={handelSubmit}>
        <div className='grid'>
          <label htmlFor="">Name :</label>
          <input type="text" placeholder='Enter Your name ' className='p-2 bg-slate-300 outline-none border focus-within:border-green-400 rounded' value={userData.name} name='name' onChange={handleOnChange} required/>
        </div>
        <div className='grid'>
          <label htmlFor="email">Email :</label>
          <input type="email" id='email' placeholder='Enter Your name ' className='p-2 bg-slate-300 outline-none border focus-within:border-green-400 rounded' value={userData.email} name='email' onChange={handleOnChange} required/>
        </div>
        <div className='grid'>
          <label htmlFor="mobile">Mobile No:</label>
          <input type="text" id='mobile' placeholder='Enter Your mobile ' className='p-2 bg-slate-300 outline-none border focus-within:border-green-400 rounded' value={userData.mobile} name='mobile' onChange={handleOnChange} required/>
        </div>

        <button
          type="submit"
          className='bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400'
        >
        
          {
            loading ? "Loading..." : "Submit"
          }
        </button>
      </form>
    </div>
  )
}

export default Profile
