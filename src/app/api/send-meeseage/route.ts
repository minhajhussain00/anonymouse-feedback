import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import {Message} from "@/model/User";


export async function POST(req: Request) {
    await dbConnection()
    const { username, content } = await req.json()
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return Response.json({
                succuss: false,
                message: "User not found"
            }, { status: 401 })
        }
        if (!user?.isAcceptingMessege) {
            return Response.json({
                succuss: false,
                message: "User not accepting messages"
            }, { status: 401 })
        }
        const message = {content,createdAt:new Date()}
       await user.messages.push(message as Message)

       return Response.json({
        succuss: true,
        message: "Message send succesfully"
    }, { status: 200 })
    } catch (err) {
        console.log("error sending message :",err)
        return Response.json({
            succuss: false,
            message: "error sending error"
        }, { status: 500 })
    }
}