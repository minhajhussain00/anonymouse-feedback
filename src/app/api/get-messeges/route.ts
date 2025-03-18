import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";

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
    try{
        const user = await User.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ])
        if(!user || user.length === 0){
            return new Response(
                JSON.stringify({success: false, message: "User not found"}),
                {status: 404}
            )
        }
        return new Response(
            JSON.stringify({success: true, messages: user[0].messages}),
            {status: 200}
        )
    }catch(error){
        console.log("Error getting messeges", error)
        return new Response(
            JSON.stringify({success: false, message: "Error getting messeges"}),
            {status: 500}
        )
    }
}