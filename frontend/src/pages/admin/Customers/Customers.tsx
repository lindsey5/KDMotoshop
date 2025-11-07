import { useContext, useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import Card from "../../../components/Card";
import CustomizedPagination from "../../../components/Pagination";
import CustomizedTable from "../../../components/Table";
import { Title } from "../../../components/text/Text";
import { SearchField } from "../../../components/Textfield";
import useFetch from "../../../hooks/useFetch";
import PageContainer from "../ui/PageContainer"
import { CircularProgress } from "@mui/material";
import { formatDate, isWithinLast7Days } from "../../../utils/dateUtils";
import UserAvatar from "../../ui/UserAvatar";
import { useDebounce } from "../../../hooks/useDebounce";
import { SocketContext } from "../../../context/socketContext";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Customers', href: '/admin/customers' },
]

const StatusChip = ({ id } : { id : string }) => {
    const { socket } = useContext(SocketContext);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        socket?.emit('isOnline', id)

        socket?.on("customerStatus", ({ customer_id, status} : { customer_id: string, status : boolean}) => {
            console.log(status)
            if(customer_id === id){
                setIsOnline(status);
            }
        })
    }, [socket, id])
    
    return (
        <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
            isOnline
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-gray-100 text-gray-600 border border-gray-300"
        }`}
        >
        <span
            className={`h-2 w-2 rounded-full mr-2 ${
            isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
        />
        {isOnline ? "Online" : "Offline"}
        </div>
    );
};


const CustomersPage = () => {
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data : customersRes, loading } = useFetch(`/api/customers/all?page=${page}&searchTerm=${searchDebounce}&limit=20`)

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };


    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Title className="mb-4">Customers</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="flex-grow min-h-0 flex flex-col gap-5 p-5">
                <SearchField 
                    sx={{ width: '400px'}}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Email, Firstname, Lastname..."
                />
                <CustomizedTable 
                    cols={['Fullname', 'Email', 'Status', 'Last Order', 'Pending Orders', 'Completed Orders']}  
                    rows={customersRes?.customers.map((customer : Customer) => ({
                        'Fullname' : (
                            <div className="flex items-center gap-2">
                                <UserAvatar image={customer.image} />
                                <p>{customer.firstname} {customer.lastname}</p>

                                {isWithinLast7Days(customer?.createdAt) && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">New</span>
                                )}
                            </div>
                        ),
                        'Email' : customer.email,
                        'Status' : <StatusChip id={customer._id} />,
                        'Last Order' : formatDate(customer.lastOrder) || 'N/A',
                        'Pending Orders' : customer.pendingOrders,
                        'Completed Orders' : customer.completedOrders
                    })) || []}
                />
                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <CustomizedPagination count={customersRes?.totalPages} page={customersRes?.page} onChange={handlePage} />
                </div>
            </Card>
        </PageContainer>
    )
}

export default CustomersPage;