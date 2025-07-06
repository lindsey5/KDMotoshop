import { Button, type ButtonProps } from "@mui/material"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import useDarkmode from "../hooks/useDarkmode";

export const RedButton: React.FC<ButtonProps> = ({sx, ...props}) => {
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

    const handleSuccess = async (response : any) => {
      try {
        const credential = response.credential;
        const decoded = JSON.parse(atob(credential.split('.')[1]));
        
      } catch (error) {
        console.error('Login processing error:', error);
      }
    };
  
    const handleError = () => {
      console.error('Google Login Error:');
    };
  
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <div className="border border-white w-full">
            <GoogleLogin 
              onSuccess={handleSuccess} 
              onError={handleError} 
              size="large"
              theme={theme}
            />
          </div>
      </GoogleOAuthProvider>
    );
};