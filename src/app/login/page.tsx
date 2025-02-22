"use client";
import { useEffect } from 'react';
import useRegisterModal from '~/hooks/use-register-modal';
 
export default function LoginPage() {
  const registerModal = useRegisterModal();

  useEffect(() => {
    if(registerModal.isOpen === false) {
      registerModal.onOpen();
    }
  }, [registerModal.isOpen]);

  return (
    <div>
    </div>
  );
}