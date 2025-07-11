import { FormControlLabel, Radio } from "@mui/material"
import useDarkmode from "../hooks/useDarkmode"
import { red } from "@mui/material/colors"

export const RedRadio = ({ label, value } : { label: string, value: string }) => {
    const isDark = useDarkmode()

    return (
        <FormControlLabel
            value={value} 
            control={( <Radio 
                sx={{
                    color: isDark ? 'white' : '',
                    '&.Mui-checked': {
                        color: red[600],
                    },
                }}
            /> )} 
             label={label} 
        />   
    )
}