import { IconButton, InputAdornment, TextField, type StandardTextFieldProps, type TextFieldProps } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import useDarkmode from "../hooks/useDarkmode";
import React, { useEffect, useRef, useState } from "react";
import { cn, formatNumber } from "../utils/utils";
import ProductThumbnail from "../pages/ui/ProductThumbnail";
import { getProducts } from "../services/productService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LineTextFieldProps extends StandardTextFieldProps {
  label: string;
}

export const LineTextField = ({ label, sx, ...props }: LineTextFieldProps) => {
  const isDark = useDarkmode();

  return (
    <TextField
      variant="standard"
      label={label}
      InputProps={{
        sx: {
          color: isDark ? 'white' : 'black', // input text color
          '& input::placeholder': {
            color: isDark ? '#aaa' : '#666', // placeholder color
            opacity: 1, // ensure visibility
          },
        },
      }}
      sx={{
        // underline default color
        '& .MuiInput-underline:before': {
          borderBottomColor: isDark ? '#555' : '#ccc',
        },
        // underline on hover (not focused)
        '& .MuiInput-underline:hover:before': {
          borderBottomColor: isDark ? 'red' : '#666',
        },
        // underline when focused
        '& .MuiInput-underline:after': {
          borderBottomColor: 'red', // customize focused underline
        },
        // label when focused
        '& label.Mui-focused': {
          color: 'red',
        },
        // label default color
        '& label': {
          color: isDark ? '#aaa' : '#555',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export const RedTextField = ({ sx, ...props } : TextFieldProps) => {
  const isDark = useDarkmode()
  
  return (
    <TextField 
      variant="outlined"
      sx={{
        backgroundColor: isDark ? '#313131' : 'white',
        width: '100%',
        borderRadius: 3,
        '& .MuiInputLabel-root': {
          color: isDark ?  '#bdbdbd' : '',
          '&.Mui-focused': {
            color: isDark ? 'white' : 'red', 
          },
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          fontSize: 15,
          color: isDark ? 'white' : 'black', // Text color
          '& input::placeholder': {
            color: isDark ? '#bdbdbd' : '#757575', // Placeholder color
            opacity: 1,
          },
          '& fieldset': {
            borderColor: isDark ? '#919191' : '', 
          },
          '&:hover fieldset': {
            borderColor:  isDark ? '#919191' : '',
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

export const PasswordField = ({sx, ...props} : TextFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isDark = useDarkmode()

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
        <RedTextField 
          type={showPassword ? "text" : "password"} 
          sx={sx} 
          {...props} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff sx={{ color: isDark ? '#919191' : 'black'}}/> : <Visibility sx={{ color: isDark ? '#919191' : 'black'}}/>}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
    )
}

export const SearchField = ({ sx, placeholder, onChange } : TextFieldProps) => {
  const isDark = useDarkmode()

  return (
    <TextField
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      sx={{
        backgroundColor: isDark ? '#313131' : 'white',
        width: '100%',
        '& .MuiOutlinedInput-root': {
          fontSize: 15,
          color: isDark ? 'white' : 'black', // Text color
          '& input::placeholder': {
            color: isDark ? '#bdbdbd' : '#757575', // Placeholder color
            opacity: 1,
          },
          '& fieldset': {
            borderColor: isDark ? '#919191' : '', 
          },
          '&:hover fieldset': {
            borderColor: isDark ? '#919191' : 'gray',
          },
          '&.Mui-focused fieldset': {
            borderColor: isDark ? '#919191' : 'gray',
          },
        },
        ...sx
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: isDark ? 'white' : 'action.active' }} />
          </InputAdornment>
        ),
      }}
    />
  );
};


export const HeaderSearchField = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [autoComplete, setAutoComplete] = useState<boolean>(false);
    const isDark = useDarkmode();
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        searchTerm: '',
        totalPages: 1,
    });

    const getProductsAsync = async () => {
        const response = await getProducts(`limit=30&searchTerm=${pagination.searchTerm}`)

        if(response.success) {
            const mappedProducts = response.products.map((product : Product) => ({
                    ...product,
                    price: product.product_type === 'Single' ? product.price : product.variants.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0].price
            }))

            setProducts(mappedProducts)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getProductsAsync();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm, pagination.page])

    const handleBlur = () => {
        setTimeout(() => {
            setAutoComplete(false);
        }, 500);
    };

    const handleFocus = () => setAutoComplete(true)

    const handleSearch = (e : React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      window.location.href = `/products?search=${pagination.searchTerm}`

    }

    return (
        <form 
          className={cn('flex flex-1 min-w-[130px] max-w-[600px] items-center gap-2 md:gap-5 px-2 md:px-5 rounded-4xl border-2 border-gray-700 bg-white transition-colors duration-400', isDark && 'bg-[#313131]')}
          onSubmit={handleSearch}
        >
            <IconButton type="submit">
              <SearchIcon className={cn(isDark && "text-gray-400")}/>
            </IconButton>
            <input
              type="text"
              placeholder="Search..."
              className={cn("flex-1 py-2 pr-2 md:pr-12 outline-none text-sm md:text-base", isDark && "text-white placeholder-gray-300")}
              onChange={(e) => setPagination(prev => ({ ...prev, searchTerm: e.target.value as string}))}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {autoComplete && pagination.searchTerm && <div className={cn("bg-white max-h-[300px] overflow-y-auto absolute top-[calc(100%+5px)] inset-x-5 z-10 p-3 border border-gray-300 rounded-md", isDark && 'border-gray-600 bg-[#121212]')}>
                {products.length > 0 ? products.map((product) => (
                    <div 
                        key={product._id}
                        className={cn("flex gap-5 cursor-pointer hover:bg-gray-100 px-3 py-2", isDark && 'hover:bg-[#313131]')}
                        onClick={() => window.location.href = `/product/${product._id}`}
                        onMouseDown={() => window.location.href = `/product/${product._id}`}
                    >
                        <ProductThumbnail 
                            product={product}
                            className="w-15 h-15"
                        />
                        <div>
                             <strong className={cn(isDark && 'text-white')}>{product.product_name}</strong>
                              <p className={cn("text-gray-500 mt-2", isDark && 'text-gray-300')}>₱{formatNumber(Number(product.price))}</p>
                        </div>
                    </div>
                )) : <p className={cn(isDark && 'text-white')}>No results</p>}
            </div>}
        </form>
    )
}


export function Otp({ setOtp, otp } : { setOtp : React.Dispatch<React.SetStateAction<string[]>>; otp: string[]}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const isDark = useDarkmode();

  const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.currentTarget);
      setOtp((prevOtp) => prevOtp.map((otp, i) => i === index ? "" : otp));
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => prevOtp.map((otp, i) => i === index ? target.value : otp));
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleFocus = (e : React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e : React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
  };

  return (
    <div className={cn("flex gap-2", isDark && 'bg-[#2A2A2A]')}>
      {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onPaste={handlePaste}
              ref={(el) => {inputRefs.current[index] = el}}
              className={cn("shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke border-gray-400 p-2 text-center text-2xl font-medium outline-none sm:text-4xl", isDark && 'text-white border-2 border-gray-300')}
            />
      ))}
    </div>
  );
}