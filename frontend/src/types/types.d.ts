interface ModalProps{
    open: boolean;
    close: () => void
}

interface Menu{
    value: string;
    label: string;
}

interface Pagination{
    totalPages: number;
    page: number;
    searchTerm: string;
}