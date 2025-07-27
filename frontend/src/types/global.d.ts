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

type ChartData = {
    data: { value: number; label: string} []
}

type UploadedImage = {
  imageUrl: string;
  imagePublicId: string;
};