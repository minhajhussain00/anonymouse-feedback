import { Message } from "@/model/User";

export interface ApiRes{
    success:boolean,
    message:string,
    isAcceptingMessege?:boolean,
    messages?:Array<Message>
}