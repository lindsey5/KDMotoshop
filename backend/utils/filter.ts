import { SortOrder } from 'mongoose';

type ProductFilterType = {
  searchTerm : string | undefined,
  min : number | undefined,
  max : number | undefined,
  category : string | undefined,
  visibility : string | undefined
}

export const createProductFilter = ({ searchTerm, min, max, category, visibility } : ProductFilterType) => {
    let filter: any = {};
    if (searchTerm) {
      filter.$or = [
          { product_name: { $regex: searchTerm, $options: "i" } },
          { sku: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
          { "variants.sku": { $regex: searchTerm, $options: "i" } },
        ];
    }

    if (min && max) {
      const minVal = Number(min);
      const maxVal = Number(max);

      filter.$and = [{
          $or: [
            { price: { $gte: minVal, $lte: maxVal } },
            { "variants.price": { $gte: minVal, $lte: maxVal } }
          ]
      }];
    }

    if(visibility) filter.visibility = visibility;

    if (category && category !== "All") filter.category = category;
    
    return filter
}

export const determineSortOption = (sort : string) : { [key: string]: SortOrder }  => {
    let sortOption: { [key: string]: SortOrder };

    if (sort === "ratingDesc") sortOption = { rating: -1 };
    else if (sort === "ratingAsc") sortOption = { rating: 1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };
    else sortOption = { createdAt: -1}

    return sortOption
}