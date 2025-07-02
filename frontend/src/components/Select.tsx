import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { type BaseSelectProps, type SelectChangeEvent } from '@mui/material/Select';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, MenuItem } from '@mui/material';
import { useState } from 'react';
import * as motion from "motion/react-client"
import { cn } from '../utils/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

type CustomSelectProps = {
  options: string[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export const CustomSelect = ({ options, selected, setSelected} : CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded shadow-md border border-gray-500 hover:bg-gray-50 hover:border-red-400 transition cursor-pointer"
      >
        {selected}
        <ExpandMoreIcon />
      </button>
        {isOpen && (
          <motion.ul
            className="absolute w-full mt-2 bg-white border border-gray-300 rounded shadow z-1 overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {options.map((option) => (
              <motion.li
                key={option}
                onClick={() => handleSelect(option)}
                className={cn("px-4 py-3 cursor-pointer", selected === option ? 'bg-red-100' : 'hover:bg-gray-100')}
                whileHover={{ scale: 1.02 }}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
    </div>
  );
};