const forgotPasswordTemplate =({name,otp})=>{
  return `<p>Hello ${name},</p>
             <p>Your OTP for password reset is: <b style="font-size:20px;">${otp}</b></p>
             <p>This OTP will expire in 1 hour.</p>
             <p>Thanks</p>`
             
}
export default forgotPasswordTemplate