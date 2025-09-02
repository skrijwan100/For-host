import React,{useEffect,  useState} from "react"

 const useMobile =(breakpoint = 768)=>{
   const [isMobile , setIsMobile] = useState(window.innerWidth < breakpoint)
   const handelResize =()=>{
      const checkPoint = window.innerWidth < breakpoint
      setIsMobile(checkPoint)
   }
   useEffect(()=>{
         handelResize()
         window.addEventListener('resize',handelResize)
         return ()=>{
            window.removeEventListener('resize',handelResize)
         }
   },[])
   return[isMobile]
}

export default useMobile