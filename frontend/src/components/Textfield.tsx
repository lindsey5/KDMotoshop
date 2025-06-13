import { InputAdornment, TextField, type StandardTextFieldProps, type TextFieldProps } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';

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

export const SearchField: React.FC<TextFieldProps> = ({ sx, ...props }) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          fontSize: 15,
          height: '45px',
          borderRadius: 20,
          '&:hover fieldset': {
            borderColor: 'black',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'black',
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
        ...props.InputProps,
      }}
    />
  );
};