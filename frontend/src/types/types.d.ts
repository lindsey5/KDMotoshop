type ModalProps = {
    open: boolean;
    close: () => void
}

type Menu = {
    value: string;
    label: string;
}

type Pagination = {
    totalPages: number;
    page: number;
    searchTerm: string;
}