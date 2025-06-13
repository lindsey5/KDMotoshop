import { Button, type ButtonProps } from "@mui/material"


export const RedButton: React.FC<ButtonProps> = ({sx, ...props}) => {
    return <Button variant="contained" sx={{ backgroundColor: 'red', ...sx }} {...props} />
}