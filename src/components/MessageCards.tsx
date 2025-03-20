import React from 'react'
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
  };
const MessageCards = ({message,onMessageDelete}:MessageCardProps) => {
    const handleDeleteConfirm = async ()=>{
        const response = await axios.delete(
            `/api/delete-message/${message._id}`
          );
          //TODO : MAKE THE DELETE API
          toast.success(
            response.data.message,
          );
          onMessageDelete(message._id as string);
    
    }
    return (
        <Card className="card-bordered">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{message.content}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>
                    <X className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this message.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      );
}

export default MessageCards