import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnection();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    const userId = session.user._id; // Ensure this is correct
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return new Response(
            JSON.stringify({ success: false, message: "Invalid user ID" }),
            { status: 400 }
        );
    }

    try {
        const userMessages = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        if (!userMessages.length) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 405 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, messages: userMessages[0].messages }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error getting messages", error);
        return new Response(
            JSON.stringify({ success: false, message: "Error getting messages" }),
            { status: 500 }
        );
    }
}
