import { InputAdornment, TextField, type StandardTextFieldProps, type TextFieldProps } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import type React from "react";

interface LineTextFieldProps extends StandardTextFieldProps {
  label: string;
}

export const LineTextField: React.FC<LineTextFieldProps> = ({ label, ...props }) => {
  return (
    <TextField
      variant="standard" 
      label={label}
      sx={{
        '& .MuiInput-underline:after': {
          borderBottomColor: 'red',
        },
        '& label.Mui-focused': {
          color: 'red', 
        },
      }}
      {...props}
    />
  );
};

export const RedTextField  : React.FC<TextFieldProps> = ({ sx, ...props }) => {
  return (
    <TextField 
      variant="outlined"
      sx={{
            '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: 'red', 
                    },
                },
            '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                    borderColor: 'red', 
                },
                '&.Mui-focused fieldset': {
                    borderColor: 'red',
                },
            },
            ...sx
      }}
      {...props}

    />
  )
}

export const SearchField: React.FC<TextFieldProps> = ({ sx, placeholder, onChange }) => {
  return (
    <TextField
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      sx={{
        backgroundColor: 'white',
        width: '100%',
        '& .MuiOutlinedInput-root': {
          fontSize: 15,
          '&:hover fieldset': {
            borderColor: 'red',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'red',
          },
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};