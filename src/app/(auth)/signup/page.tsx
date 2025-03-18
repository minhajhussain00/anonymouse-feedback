"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sigupSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof sigupSchema>>({
    resolver: zodResolver(sigupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username){setUsernameMessage(""); return};

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const res = await axios.get(`/api/uniqe-username?username=${username}`);
        setUsernameMessage(res.data.Message);
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.error("Error in checking username", error);
        const errorMessage =
          typeof axiosError.response?.data.Message === "string"
            ? axiosError.response.data.Message
            : "Error checking username";
        toast.error("Error",{description:errorMessage})
        setUsernameMessage(errorMessage);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const delay = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(delay);
  }, [username]);

  const onSubmit = async (data: z.infer<typeof sigupSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/signup", data);
      toast.success(res.data.Message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error("Error in signup", error);
      const errorMessage =
        typeof axiosError.response?.data.Message === "string"
          ? axiosError.response.data.Message
          : "Signup failed";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <><Loader2 className="animate-spin" />Checking usename</>}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is available" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
