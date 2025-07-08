import { confirmDialog, errorAlert } from "../utils/swal";
import { fetchData, postData, updateData } from "./api";

const isVariantValid = (variant: Variant): boolean => {
  return (
    variant.sku.trim() !== '' &&
    variant.price !== null &&
    variant.stock !== null &&
    Object.keys(variant.attributes).length > 0 &&
    Object.values(variant.attributes).every((v) => v.trim() !== '')
  );
};

const createProduct = async (product : Product) => {
    const response = await postData('/api/product', product);
    if(response.success) window.location.href = '/admin/products'
    else errorAlert(response.message, '');
}

const updateProduct = async (id: string, product : Product) => {
    const response = await updateData(`/api/product/${id}`, product);
    if(response.success) window.location.reload();
    else errorAlert(response.message, '');
}

export const saveProduct = async (
  product: Product,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!(await confirmDialog('Save product?', '', false, 'success',))) return;

  setLoading(true);
  try {
    // --- Validate required fields ---
    if (!product.product_name) {
      errorAlert('Product name is required', '');
      return;
    } else if (!product.description) {
      errorAlert('Description is required', '');
      return;
    } else if (!product.category) {
      errorAlert('Category is required', '');
      return;
    } else if (!product.thumbnail) {
      errorAlert('Add thumbnail', '');
      return;
    } else if (product.images.length < 1) {
      errorAlert('Upload at least one product image', '');
      return;
    } else if (product.weight === 0) {
      errorAlert('Weight should not be 0', '');
      return;
    }

    // --- Validate based on type ---
    if (product.product_type === 'Variable') {
      if (product.variants.length < 1) {
        errorAlert('Add at least one variant', '');
        return;
      } else if (product.attributes.length < 1) {
        errorAlert('Add at least one attribute', '');
        return;
      } else if (!product.variants.every((v) => isVariantValid(v))) {
        errorAlert('Invalid Variant', 'Please fill in all fields for each variant.');
        return;
      }
      
      const seen = new Set();
      for (const variant of product.variants) {
        
        const sortedAttributes = Object.entries(variant.attributes)
          .map(([k, v]) => [k, v.trim()])
          .sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

        const key = JSON.stringify(Object.fromEntries(sortedAttributes));

        if (seen.has(key)) {
          errorAlert(
            'Duplicate Variant',
            `Each variant must have a unique combination of attributes.`
          );
          return;
        }
        seen.add(key);
      }

      const { sku, price, stock, ...rest } = product;
      if (product._id) {
        await updateProduct(product._id as string, rest);
      } else {
        await createProduct(rest);
      }

    } else {
      if (!product.sku) {
        errorAlert('SKU is required', '');
        return;
      } else if (!product.price) {
        errorAlert('Price is required', '');
        return;
      }

      product._id ? await updateProduct(product._id as string, product) : await createProduct(product);
    }

  } catch (error) {
    console.error(error);
    errorAlert('An error occurred while saving the product', '');
  } finally {
    setLoading(false);
  }
};

export const getProducts = async (query? : string) => {
  const response = await fetchData(`/api/product?${query}`);

  if(response.success) {
    return response
  }
}
