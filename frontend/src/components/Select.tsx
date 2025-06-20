import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type BaseSelectProps } from '@mui/material/Select';
import { MenuItem } from '@mui/material';

interface CustomizedSelectProps extends BaseSelectProps{
    menu: Menu[];
    label?: string;
    icon?: React.ReactNode
}

export const CustomizedSelect : React.FC<CustomizedSelectProps> = ({ sx, label, menu, icon, ...props}) => {
    return <FormControl fullWidth>
        <InputLabel 
          sx={{
            '&.Mui-focused': {
              color: 'red', 
            },
          }}
        >{label}</InputLabel>
        <div className='absolute left-2 top-1/2 transform -translate-y-1/2'>
        {icon}
        </div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          
          {...(label && { label })}
          {...props}
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red' 
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red', 
              borderWidth: '2px'
            },
            ...(icon && { paddingLeft: 3}),
            ...sx
          }}
        >
          {menu.map(m => <MenuItem value={m.value}>{m.label}</MenuItem>)}
        </Select>
      </FormControl>
}