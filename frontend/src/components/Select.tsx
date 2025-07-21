import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type BaseSelectProps, type SelectChangeEvent } from '@mui/material/Select';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, MenuItem } from '@mui/material';
import { cn } from '../utils/utils';
import useDarkmode from '../hooks/useDarkmode';

interface CustomizedSelectProps extends BaseSelectProps{
    menu: Menu[];
    label?: string;
    icon?: React.ReactNode;
}

export const CustomizedSelect = ({ sx, label, menu, icon, ...props} : CustomizedSelectProps) => {
    const isDark = useDarkmode();
    
    return <FormControl fullWidth>
        <InputLabel 
          sx={{
            color: isDark ? '#bdbdbd' : '',
            '&.Mui-focused': {
              color: isDark ? 'white' : 'red', 
            },
          }}
        >{label}</InputLabel>
        <div className={cn('absolute z-1 left-2 top-1/2 transform -translate-y-1/2', isDark ? 'text-white' : '')}>
        {icon}
        </div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          
          {...(label && { label })}
          {...props}
          sx={{
            backgroundColor: isDark ? '#313131' : 'white',
            color: isDark ? 'white' : '#313131',
            '.MuiOutlinedInput-notchedOutline':{
              borderColor: isDark ? '#919191' : '',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#919191' : 'red'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#919191' : 'red',
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
    const isDark = useDarkmode();
    
    return <FormControl fullWidth>
        <InputLabel 
          sx={{
            color: isDark ? '#bdbdbd' : '',
            '&.Mui-focused': {
              color: isDark ? 'white' : 'red', 
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
            backgroundColor: isDark ? '#313131' : 'white',
            color: isDark ? 'white' : '#313131',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#919191' : 'red',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#919191' : 'red',
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

