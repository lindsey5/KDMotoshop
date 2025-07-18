import { InputAdornment, TextField, type StandardTextFieldProps, type TextFieldProps } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import type React from "react";
import useDarkmode from "../hooks/useDarkmode";
import { useEffect, useState } from "react";
import { fetchData } from "../services/api";
import { cn, formatNumber } from "../utils/utils";
import ProductThumbnail from "./images/ProductThumbnail";

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

export const SearchField: React.FC<TextFieldProps> = ({ sx, placeholder, onChange }) => {
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

    const getProducts = async () => {
        const response = await fetchData(`/api/product?page=${pagination.page}&limit=30&searchTerm=${pagination.searchTerm}`);

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
            getProducts();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm, pagination.page])

    const handleBlur = () => {
        setTimeout(() => {
            setAutoComplete(false);
        }, 200);
    };

    const handleFocus = () => setAutoComplete(true)

    return (
        <div className={cn('flex flex-1 min-w-[130px] max-w-[500px] items-center gap-5 px-5 rounded-4xl border-2 border-gray-700 bg-white transition-colors duration-400', isDark && 'bg-[#313131]')}>
            <SearchIcon className={cn(isDark && "text-gray-400")}/>
            <input
              type="text"
              placeholder="Search..."
              className={cn("flex-1 py-2 pr-12 outline-none text-sm md:text-base", isDark && "text-white placeholder-gray-300")}
              onChange={(e) => setPagination(prev => ({ ...prev, searchTerm: e.target.value as string}))}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {autoComplete && pagination.searchTerm && <div className="bg-white max-h-[300px] overflow-y-auto absolute top-[calc(100%+5px)] inset-x-0 z-10 p-3 border border-gray-300 rounded-md">
                {products.length > 0 ? products.map((product) => (
                    <div 
                        key={product._id}
                        className="flex gap-5 cursor-pointer hover:bg-gray-100 px-3 py-2"
                        onClick={() => window.location.href = `/product/${product._id}`}
                    >
                        <ProductThumbnail 
                            product={product}
                            className="w-15 h-15"
                        />
                        <div>
                             <strong>{product.product_name}</strong>
                            <p className="text-gray-500 mt-2">₱{formatNumber(Number(product.price))}</p>
                        </div>
                    </div>
                )) : <p>No results</p>}
            </div>}
        </div>
    )
}