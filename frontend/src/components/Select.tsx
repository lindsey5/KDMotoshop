import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type BaseSelectProps } from '@mui/material/Select';
import { MenuItem } from '@mui/material';

interface CustomizedSelectProps extends BaseSelectProps{
    menu: Menu[];
    label: string;
}

export const CustomizedSelect : React.FC<CustomizedSelectProps> = ({ sx, label, menu, ...props}) => {
    return <FormControl fullWidth>
        <InputLabel 
          sx={{
            '&.Mui-focused': {
              color: 'red', 
            },
          }}
        >{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label={label}
          {...props}
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red' 
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red', 
              borderWidth: '2px'
            },
            ...sx
          }}
        >
          {menu.map(m => <MenuItem value={m.value}>{m.label}</MenuItem>)}
        </Select>
      </FormControl>
}