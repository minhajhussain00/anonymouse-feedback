import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";

export async function POST(req: Request) {
     await dbConnection()
     const session  = await getServerSession(authOptions)
     const user = session?.user 
     if(!session || !user){
         return new Response(
             JSON.stringify({success: false, message: "Unauthorized"}),
             {status: 401}
            )
        }
        const userId = user._id
        const {acceptingMessege} = await req.json()
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                {isAcceptingMessege:acceptingMessege},
                {new: true}
            )
            if(!user){
                return new Response(
                    JSON.stringify({success: false, message: "User not found"}),
                    {status: 404}
                )
            }
            return new Response(
                JSON.stringify({success: true, message: "Status changed", user}),
                {status: 200}
            )
        
     } catch (error) {
            console.log("Failed to change status", error)
            return new Response(
                JSON.stringify({success: false, message: "Failed to change status"}),
                {status: 500}
            )
     }
}

export async function GET(req: Request) {
    await dbConnection()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if(!session || !user){
        return new Response(
            JSON.stringify({success: false, message: "Unauthorized"}),
            {status: 401}
        )
    }
    const userId = user._id
    try {
        const user = await User.findById(userId)
        if(!user){
            return new Response(
                JSON.stringify({success: false, message: "User not found"}),
                {status: 404}
            )
        }
        return new Response(
            JSON.stringify({success: true, isAcceptingMessege: user.isAcceptingMessege}),
            {status: 200}
        )
    } catch (error) {
        console.log("Failed to get user", error)
        return new Response(
            JSON.stringify({success: false, message: "Failed to get user"}),
            {status: 500}
        )
    }
}