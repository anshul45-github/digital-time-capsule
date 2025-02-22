"use client";

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai'; 
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import useRegisterModal from '~/hooks/use-register-modal';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { set } from 'zod';
import { Modal } from './modal';
import { Heading } from './heading';
import { Input } from './inputs/input';
import { toast } from 'sonner';
import Button from './button';

import { signIn } from "next-auth/react";

export const LoginModal = () => {
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(false);
        axios.post('/api/register', data)
            .then(() => {
                registerModal.onClose();
            })
            .catch((error) => {
                toast.error("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    const footerContent = (
        <div className='flex flex-col gal-4 mt-3'>
            <br />
            <Button outline label='Continue with Google' icon={FcGoogle} onClick={() => signIn('google')} />
            <Button outline label='Continue with Github' icon={AiFillGithub} onClick={() => signIn('github')} />
            {/* <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>
                        Already have an account?
                    </div>
                    <div onClick={registerModal.onClose} className='text-neutral-800 cursor-pointer hover:underline'>
                        Login
                    </div>
                </div>
            </div> */}
        </div>
    )

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Welcome to Digital Image Capsule' subtitle='Create an account?' center />
            <Input id="email" label="Email" register={register} disabled={isLoading} errors={errors} required />
            <Input id="name" label="Name" register={register} disabled={isLoading} errors={errors} required />
            <Input id="password" label="Password" type='password' register={register} disabled={isLoading} errors={errors} required />
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={registerModal.isOpen} title='Login' actionLabel='Continue' onClose={registerModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent} />
    )
}