import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios';
import SummaeryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updateAvatar } from '../store/userSlice';
import { GiCrossMark } from "react-icons/gi";

const UserProfileAvatarEdit = ({close}) => {
   const user = useSelector(state => state.user)
   const dispatch = useDispatch()
   const [loading,setLoading] = useState(false)
   const handleSubmit = (e)=>{
      e.preventDefault()
   }
   const handelUploadAvatarImage = async(e)=>{
     const file = e.target.files[0]
     if (!file) {
      return
     }
     const formData = new FormData()
     formData.append('avatar',file)

     setLoading(true)
     try {
      const response = await Axios({
       ...SummaeryApi.uploadAvatar,
       data:formData,

     })
     const{data :responseData} = response
     dispatch(updateAvatar(responseData.data.avatar))
     } catch (error) {
      AxiosToastError(error)
     }finally{
       setLoading(false)
     }
     
   
    
     
   }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/60 p-4 flex items-center justify-center'>
      <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
          <button onClick={close} className='w-fit block ml-auto'>
              <GiCrossMark size={20}/>
          </button>
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
               <div>
                  <form onSubmit={handleSubmit}>
                     <label htmlFor="uploadProfile">
                         <div className='border cursor-pointer border-green-200 hover:bg-green-200 px-4 py-1 rounded text-sm my-3'>
                          {
                            loading?"Loading....." :"Upload" 
                          }
                         </div>
                     </label>
                     <input onChange={handelUploadAvatarImage} type="file" id='uploadProfile' className=' hidden' />
                  </form>
                 
               </div>
      </div>

    </section>
  )
}

export default UserProfileAvatarEdit
