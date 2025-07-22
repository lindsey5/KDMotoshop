import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDialog = async (
  title: string,
  text: string,
  isDark : boolean = false,
  icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'warning',
  confirmText = 'Yes',
  cancelText = 'Cancel',
): Promise<boolean> => {
  const result = await MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: 'red',
    background: isDark ? '#1e1e1e' : '', 
    color: isDark ? '#f1f1f1' : '', 
  });

  return result.isConfirmed === true;
};

export const successAlert = async (title: string, text: string, isDark : boolean = false) => {
  return await MySwal.fire({
    icon: 'success',
    title,
    text,
    background: isDark ? '#1e1e1e' : '', 
    color: isDark ? '#f1f1f1' : '', 
  });
};


export const errorAlert = async (title: string, text: string, isDark : boolean = false) => {
  return await MySwal.fire({
    icon: 'error',
    title,
    text,
    background: isDark ? '#1e1e1e' : '', 
    color: isDark ? '#f1f1f1' : '', 
  });
};
