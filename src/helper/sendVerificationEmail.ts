import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/Verificationemail";
import { ApiRes } from "@/types/ApiRes";


export async function sendVerificationEmail(
    email:string,
    username:string,
    VerifyCode:string
):Promise<ApiRes>{    
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:"Verify your email",
            react:VerificationEmail({username,otp:VerifyCode}) 
        })
        return {success:true, message:"Email sent successfully"};

    } catch (error) {
        console.error("Error sending email",error);
        return {success:true, message:"error sending email"};
    }
}