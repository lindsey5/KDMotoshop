import { useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { RedButton } from "../../../components/buttons/Button"
import { Title } from "../../../components/text/Text"
import PageContainer from "../ui/PageContainer"
import { SearchField } from "../../../components/Textfield"
import Card from "../../../components/Card"
import { CustomizedSelect } from "../../../components/Select"
import useFetch from "../../../hooks/useFetch"
import { CircularProgress } from "@mui/material"
import AddVoucherModal from "./ui/AddVoucherModal"
import CustomizedTable from '../../../components/Table';
import { formatToShortDate } from "../../../utils/dateUtils"
import { formatNumberToPeso } from "../../../utils/utils"
import CustomizedPagination from "../../../components/Pagination"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Vouchers', href: '/admin/vouchers' },
]

const Vouchers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [status, setStatus] = useState('Active');
    const [page, setPage] = useState(1);
    const { data, loading} = useFetch(`/api/vouchers?searchTerm=${searchTerm}&status=${status}&page=${page}&limit=50`);

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <AddVoucherModal close={() => setOpenModal(false)} open={openModal}/>
            <div className="flex justify-between items-center">
                <div className="space-y-4">
                    <Title>Shop Vouchers</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <RedButton onClick={() => setOpenModal(true)}>Add Voucher</RedButton>
            </div>
            <Card className="min-h-0 flex-grow flex flex-col gap-5">
                <div className="flex gap-10 justify-between items-center">
                    <SearchField 
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }} 
                        sx={{ maxWidth: '350px'}} 
                        placeholder="Search by name or code..."
                    />
                    <div className="w-[400px]">
                        <CustomizedSelect 
                            sx={{ height: 55 }}
                            label="Status"
                            menu={['Active', 'Expired'].map(status => ({ label: status, value: status }))}
                            value={status}
                            fullWidth
                            onChange={(e) => setStatus(e.target.value as string)}
                        />
                    </div>
                </div>
                <div className="min-h-0 flex-grow overflow-y-auto">
                    <CustomizedTable
                        cols={['Name', 'Code', 'Discount', 'Min. Spend', 'Max. Discount', 'Start Date', 'End Date' , 'Usage Limit', 'Used Count', 'Status',]}
                        rows={data?.vouchers.map((voucher : Voucher) => ({
                            'Name' : voucher.name,
                            'Code' : voucher.code,
                            'Discount' : voucher.voucherType === 'percentage' ? `${voucher.percentage}%` : formatNumberToPeso(voucher.amount ?? 0),
                            'Min. Spend' : voucher.minSpend,
                            'Max. Discount' : voucher.maxDiscount,
                            'Start Date' : formatToShortDate(voucher.startDate),
                            'End Date' : formatToShortDate(voucher.endDate),
                            'Usage Limit' : voucher.usageLimit,
                            'Used Count' : voucher.usedCount,
                            'Status': (
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                new Date(voucher.endDate) >= new Date()
                                    ? "bg-green-100 text-green-700" // Active
                                    : "bg-red-100 text-red-700"    // Expired
                                }`}
                            >
                                {new Date(voucher.endDate) >= new Date() ? "Active" : "Expired"}
                            </span>
                            ),
                        })) || []}
                    />
                    {loading && (
                        <div className="flex justify-center items-center p-4">
                            <CircularProgress />
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <CustomizedPagination count={data?.totalPages} page={page} onChange={handlePage} />
                </div>
            </Card>
        </PageContainer>
    )
}

export default Vouchers