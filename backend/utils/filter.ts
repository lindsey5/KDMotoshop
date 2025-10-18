import { SortOrder } from 'mongoose';

type ProductFilterType = {
  searchTerm : string | undefined,
  min : number | undefined,
  max : number | undefined,
  category : string | undefined,
  visibility : string | undefined
}

export const createProductFilter = ({
  searchTerm,
  min,
  max,
  category,
  visibility,
}: ProductFilterType) => {
  const filter: any = { $and: [] };

  // helper to escape regex special characters
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (searchTerm) {
    const safeSearch = escapeRegExp(searchTerm);
    filter.$and.push({
      $or: [
        { product_name: { $regex: safeSearch, $options: 'i' } },
        { sku: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
        // ✅ use dot notation instead of $elemMatch
        { 'variants.sku': { $regex: safeSearch, $options: 'i' } },
      ],
    });
  }

  if (min && max) {
    const minVal = Number(min);
    const maxVal = Number(max);
    filter.$and.push({
      $or: [
        { price: { $gte: minVal, $lte: maxVal } },
        { 'variants.price': { $gte: minVal, $lte: maxVal } },
      ],
    });
  }

  if (visibility && visibility !== 'All') {
    filter.$and.push({ visibility });
  } else {
    filter.$and.push({ visibility: { $ne: 'Deleted' } });
  }

  if (category && category !== 'All') {
    filter.$and.push({ category });
  }

  return filter;
};


export const determineSortOption = (sort : string) : { [key: string]: SortOrder }  => {
    let sortOption: { [key: string]: SortOrder };
    if(sort === "a-z") sortOption = { product_name: 1 };
    else if (sort === "ratingDesc") sortOption = { rating: -1 };
    else if (sort === "ratingAsc") sortOption = { rating: 1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };
    else sortOption = { createdAt: -1}

    return sortOption
}