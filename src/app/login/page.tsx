"use client";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import useRegisterModal from '~/hooks/use-register-modal';
 
export default function LoginPage() {
  const registerModal = useRegisterModal();

  const { data: session, status } = useSession();

  if(!session) {
    registerModal.onOpen();
    redirect("/");
  }

  return (
    <div>
    </div>
  );
}