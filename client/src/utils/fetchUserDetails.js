import Axios from "./Axios"
import SummaeryApi from "../common/SummaryApi"

const fetchUserDetails = async () =>{
      try {
         const response = await Axios({
            ...SummaeryApi.userDetails
         })
         return response.data
      } catch (error) {
         console.log(error);
         
      }
}
export default fetchUserDetails