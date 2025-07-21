import { Button, type ButtonProps } from "@mui/material"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import useDarkmode from "../hooks/useDarkmode";
import { postData } from "../services/api";
import { errorAlert } from "../utils/swal";
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

    const handleSuccess = async (googleResponse : any) => {
      try {
        const credential = googleResponse.credential;
        const decoded = JSON.parse(atob(credential.split('.')[1]));

        const response = await postData('/api/auth/google/login', { 
          email: decoded.email, 
          firstname: decoded.given_name,
          lastname: decoded.family_name,
          image: {
            imagePublicId: '',
            imageUrl: decoded.picture
          }
          
        });
        if(response.success){
            localStorage.setItem('token', response.token)
            document.referrer ? navigate(-1) : navigate('/')
            
            setTimeout(() => {
                window.location.reload();
              }, 100);
        }else{
          errorAlert('Sign in error. Please try again', '', isDark);
        }
      } catch (error) {
        console.error('Login processing error:', error);
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