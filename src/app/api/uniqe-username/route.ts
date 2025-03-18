import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameValidationQuery = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {


  await dbConnection();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameValidationQuery.safeParse(queryParam);

if (!result.success) {
  const errorMessages = result.error.errors.map(err => err.message).join(", ");

  return Response.json({
    success: false,
    Message: errorMessages 
  }, { status: 200 });
}


    const username = result.data.username;

    const user = await User.findOne({ username,isVerified:true });

    if (user) {
      return Response.json(
        {
          success: false,
          Message: "Username is already taken",
        },
        { status: 299 }
      );
    }

    return Response.json(
      {
        success: true,
        Message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in username check:", error);
    return Response.json(
      {
        success: false,
        Message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

