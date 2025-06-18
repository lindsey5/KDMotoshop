import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDialog = async (
  title: string,
  text: string,
  icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'warning',
  confirmText = 'Yes',
  cancelText = 'Cancel'
): Promise<boolean> => {
  const result = await MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: 'red',
  });

  return result.isConfirmed === true;
};

export const successAlert = (title: string, text: string) => {
  return MySwal.fire({
    icon: 'success',
    title,
    text,
  });
};


export const errorAlert = (title: string, text: string) => {
  return MySwal.fire({
    icon: 'error',
    title,
    text,
  });
};
