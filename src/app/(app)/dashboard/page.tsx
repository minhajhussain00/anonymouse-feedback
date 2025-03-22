"use client "
import MessageCards from '@/components/MessageCards'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User'
import { acceptMessegeSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const page = () => {
  const [message, setMessage] = useState<Message[]>([])
  const [isloading, setIsloading] = useState(false)
  const [isswitchloading, setIsswitchloading] = useState(false)
  const handledelete = async (id: string) => {
    setMessage(message.filter((message)=> message.id !== id))
  }
  const {data:session} = useSession()
  const form = useForm({
        resolver:zodResolver(acceptMessegeSchema)
  })
  const {register, watch,setValue} = form
 const acceptMessages = watch('acceptMessage')

 const fetchAceptMessages = useCallback(async()=>{
   try {
     setIsswitchloading(true)
     const res = await axios.get('/api/accept-message')
     setValue("acceptMessage",res.data.isAcceptingMessege)
     setIsswitchloading(false)
   } catch (error) {
    const Axioserror =error as AxiosError
    toast.error(Axioserror.message || "Failed to fetch data")
    setIsswitchloading(false)
   }
 }
 ,[setMessage])
 const fetchMessages = useCallback(async(refresh:boolean = false)=>{
  try {
    setIsloading(true)
    setIsswitchloading(true)
    const res = await axios.get('/api/get-message')
    setMessage(res.data.messages || [])
    if(refresh){
      toast.success("Messages refreshed",{position:"top-center"})
    }
    setIsloading(false)
    setIsswitchloading(false)
  } catch (error) {
    const Axioserror =error as AxiosError
    toast.error(Axioserror.message || "Failed to fetch data")
    setIsswitchloading(false)
  }
 },[setIsloading,setMessage])

 useEffect(() => {
   if(!session || !session.user)return
   fetchMessages()
   fetchAceptMessages()
 

 }, [session,fetchMessages,fetchAceptMessages,setValue])
 
 const handleSwitchChange = async ()=>{
  try {
    const res = await axios.post('/api/accept-message',{acceptingMessege:!acceptMessages}) 
    setValue('acceptMessage', !acceptMessages)
    toast.success(res.data.message)
  } catch (error) {
    const Axioserror =error as AxiosError
    toast.error(Axioserror.message || "Failed to change status")
  }
 }
const router = useRouter();

if(!session || !session.user){
  router.replace('/signin');
  return null;
}
const { username } = session.user as User;

const baseUrl = `${window.location.protocol}//${window.location.host}`;
const profileUrl = `${baseUrl}/u/${username}`;

const copyToClipboard = () => {
  navigator.clipboard.writeText(profileUrl);
  toast.success("URL Copied!",{
    description: 'Profile URL has been copied to clipboard.',
  });
};
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessage')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isswitchloading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {message.length > 0 ? (
        message.map((message, index) => (
          <MessageCards
            key={index}
            message={message}
            onMessageDelete={handledelete}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  )
}

export default page