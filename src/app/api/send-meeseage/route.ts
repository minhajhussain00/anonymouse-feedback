import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";

export async function POST(req: Request) {
    await dbConnection();
    const { username, content } = await req.json();

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 401 }
            );
        }

        if (!user.isAcceptingMessage) { 
            return new Response(
                JSON.stringify({ success: false, message: "User not accepting messages" }),
                { status: 401 }
            );
        }

        user.messages.push({ content, createdAt: new Date() });
        await user.save();

        return new Response(
            JSON.stringify({ success: true, message: "Message sent successfully" }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error sending message:", err);
        return new Response(
            JSON.stringify({ success: false, message: "Error sending message" }),
            { status: 500 }
        );
    }
}
