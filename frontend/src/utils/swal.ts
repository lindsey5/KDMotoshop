import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDialog = async (
  title: string,
  text: string,
  confirmText = 'Yes',
  cancelText = 'Cancel'
): Promise<boolean> => {
  const result = await MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: 'red'
  });

  return result.isConfirmed;
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
