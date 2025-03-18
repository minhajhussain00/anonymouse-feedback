import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";

export async function POST(req:Request){
    await dbConnection()
    try {
        const {username, code} = await req.json()
        const user = await User.findOne({
            username,
            verifyCode: code,
            verifyCodeExpiry: {$gt: new Date()}
        })
        if (!user){
            return new Response(
                JSON.stringify({success: false, message: "Invalid code"}),
                {status: 400}
            )
        }
        user.isVerified = true
        await user.save()
        return new Response(
            JSON.stringify({success: true, message: "Code verified"}),
            {status: 200}
        )
    } catch (error) {
        console.log("Error verifying code", error)
        return new Response(
            JSON.stringify({success: false, message: "Error verifying code"}),
            {status: 500}
        )
    }

}