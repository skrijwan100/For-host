const varifyEmailTemplate = ({name,url}) =>{
   return `
   <p>Dear ${name} ❤️ </p>
   <p>Thank you for registering SeedsKr@ft .🎋 </p>
   <a href=${url} style="color:black;background:green;margin-top:10px,padding:20px,display:block">
   Verify Email
   </a>
   `
}
export default varifyEmailTemplate