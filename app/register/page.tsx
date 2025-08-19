'use client';
import React, { useState } from 'react'
import axios , {AxiosError} from "axios";
import { useForm } from 'react-hook-form';
import z from 'zod';
import { userZod } from '@/schemas/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiResponse } from '@/lib/ApiResponse';
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const Register = () => {
    const [submiting , isSubmiting] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof userZod>>({
        resolver : zodResolver(userZod),
        defaultValues : {
            email : "",
            password : "",
        }
    })

    const onSubmit = async(data : z.infer<typeof userZod>)=>{
        isSubmiting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/auth/register' , {email : data.email , password : data.password});
            if(response.data.success === true){
                router.replace("/login");
            }
        } catch (error) {
           const axiosError = error as AxiosError<ApiResponse>;
           throw new Error("Registration failed" , axiosError);
        }

        isSubmiting(false);
    }
  return (
    <div>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} type='email'/>
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
                <Input placeholder="password" {...field} type='password'/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submiting}>
            {submiting ? (
                <div>
                    Submiting...
                </div>
            ) : (
                <div>
                    Submit
                </div>
            )}
        </Button>
      </form>
    </Form>
    </div>
  )
}

export default Register
