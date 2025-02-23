import { CreateCommunityForm } from "./create-community-form";
import { ResponsiveModal } from "./responsive-modal";

interface Props {
    setIsOpen: (isOpen: boolean) => void;
    close: () => void;
}

export const CreateCommunityModal = ({ setIsOpen, close }: Props) => {
  return (
    <ResponsiveModal open onOpenChange={setIsOpen}>
      <CreateCommunityForm onClose={close} />
    </ResponsiveModal>
  )
}