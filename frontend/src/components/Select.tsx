import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type BaseSelectProps, type SelectChangeEvent } from '@mui/material/Select';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, MenuItem } from '@mui/material';

interface CustomizedSelectProps extends BaseSelectProps{
    menu: Menu[];
    label?: string;
    icon?: React.ReactNode;
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
            backgroundColor: 'white',
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

type StatusSelectProps = {
    value: string;
    menu: { value: string; label: string; color: string }[];
    sx?: React.CSSProperties;
    onChange?: (event: SelectChangeEvent) => void;
}

export const StatusSelect : React.FC<StatusSelectProps> = ({ sx, menu, value, onChange}) => {
    return <FormControl fullWidth>
        <InputLabel 
          sx={{
            '&.Mui-focused': {
              color: 'red', 
            },
          }}
        >Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Status"
          value={value}
          onChange={onChange}
          sx={{
            backgroundColor: 'white',
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
          {menu.map(m => <MenuItem value={m.value}>
            <Box display="flex" alignItems="center" gap={1}>
              <CircleIcon sx={{ color: m.color, fontSize: 14 }} />
              {m.label}
            </Box>
          </MenuItem>)}
        </Select>
      </FormControl>
}

