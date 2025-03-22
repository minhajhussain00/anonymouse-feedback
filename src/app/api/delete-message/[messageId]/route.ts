import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";

export async function DELETE(req: Request,{params}: {params: {messageId: string}}) {
    const messegeId = params.messageId
    await dbConnection()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if(!session || !user){
        return new Response(
            JSON.stringify({success: false, message: "Unauthorized"}),
            {status: 401}
        )
    }
    try {
       const result =  await User.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messegeId}}}
        )
        if (result.modifiedCount === 0) {
            return Response.json(
              { message: 'Message not found or already deleted', success: false },
              { status: 404 }
            );
          }
          return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
          );
        } catch (error) {
          console.error('Error deleting message:', error);
          return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
          );
        }
}