import { Button, type ButtonProps } from "@mui/material"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import useDarkmode from "../../hooks/useDarkmode";
import { postData } from "../../services/api";
import { errorAlert } from "../../utils/swal";
import { useNavigate } from "react-router-dom";

export const RedButton = ({sx, ...props} : ButtonProps) => {
    const isDark = useDarkmode();

    return <Button 
    variant="contained" 
    sx={{ 
        backgroundColor: 'red', 
        ":hover": {
            backgroundColor: '#c03838'
        },
        '&.Mui-disabled': {
          border: 1,
          color: isDark ? "gray" : '', 
          borderColor: isDark ? 'gray' : ''
        },
        ...sx 
    }} 
    {...props} 
    />
}

export const GoogleButton = ({ theme = 'filled_blue' } : { theme?: 'filled_black' | 'filled_blue' | 'outline'}) => {
    const isDark = useDarkmode()
    const navigate = useNavigate()

    const handleSuccess = async (googleResponse: any) => {
      try {
        const credential = googleResponse.credential;

        if (!credential) {
          errorAlert('Google credential missing', '', isDark);
          return;
        }

        const response = await postData('/api/auth/google/login', { idToken: credential });

        if (response.success) {
          document.referrer ? navigate(-1) : navigate('/');
          setTimeout(() => window.location.reload(), 100);
        } else {
          errorAlert('Sign in error. Please try again', '', isDark);
        }
      } catch (error) {
        console.error('Login processing error:', error);
        errorAlert('An unexpected error occurred during login', '', isDark);
      }
    };
  
    const handleError = () => {
      console.error('Google Login Error:');
    };
  
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID}>
          <div className="border border-white w-full">
            <GoogleLogin 
              onSuccess={handleSuccess} 
              onError={handleError} 
              width={"100%"}
              size="large"
              theme={theme}
            />
          </div>
      </GoogleOAuthProvider>
    );
};