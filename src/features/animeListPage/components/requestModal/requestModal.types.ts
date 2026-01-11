export interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  title: string;
  placeholder?: string;
  isLoading: boolean;
}