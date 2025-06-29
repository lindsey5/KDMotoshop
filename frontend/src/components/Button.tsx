import { Button, type ButtonProps } from "@mui/material"

export const RedButton: React.FC<ButtonProps> = ({sx, ...props}) => {
    return <Button 
    variant="contained" 
    sx={{ 
        backgroundColor: 'red', 
        ":hover": {
            backgroundColor: '#f28b82'
        },
        ...sx 
    }} 
    {...props} 
    />
}