import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  await dbConnection();

  try {
    const { username, email, password } = await req.json();
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // ✅ Declare verifyCode outside the if-block

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.isVerified) {
        const message =
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists";

        return new Response(
          JSON.stringify({ success: false, message }),
          { status: 400 }
        );
      } else {
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date();
        existingUser.verifyCodeExpiry.setHours(existingUser.verifyCodeExpiry.getHours() + 1);
        await existingUser.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiry,
        isAcceptingMessege: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    const emailRes = await sendVerificationEmail(email, username, verifyCode);
    if (!emailRes.success) {
      return new Response(
        JSON.stringify({ success: false, message: emailRes.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/signup", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error in signup" }),
      { status: 500 }
    );
  }
}
