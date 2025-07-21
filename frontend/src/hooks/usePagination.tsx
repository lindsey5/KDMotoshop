import { useState } from "react";

const PaginationState ={
    totalPages: 1,
    page: 1,
    searchTerm: ''
}

const usePagination = () => {
    const [pagination, setPagination] = useState<Pagination>(PaginationState);

    return { pagination, setPagination };
}

export default usePagination;