import { memo, useContext, useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import Card from "../../../components/Card";
import CustomizedPagination from "../../../components/Pagination";
import CustomizedTable from "../../../components/Table";
import { Title } from "../../../components/text/Text";
import { SearchField } from "../../../components/Textfield";
import useFetch from "../../../hooks/useFetch";
import PageContainer from "../ui/PageContainer"
import { CircularProgress } from "@mui/material";
import { formatDate, isWithinLast7Days, minutesAgo } from "../../../utils/dateUtils";
import UserAvatar from "../../ui/UserAvatar";
import { useDebounce } from "../../../hooks/useDebounce";
import { SocketContext } from "../../../context/socketContext";
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import { updateData } from "../../../services/api";
import { confirmDialog, errorAlert } from "../../../utils/swal";
import { Lock, Unlock } from "lucide-react";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Customers', href: '/admin/customers' },
]

const StatusChip = memo(({ status }: { status : 'Active' | 'Deactivated'}) => {

    return (
        <div className="flex flex-col">
            <div
                className="inline-flex items-center text-sm font-medium"
            >
                <span
                    className={`h-2 w-2 rounded-full mr-2 ${
                        status === 'Active' ? "bg-green-500" : "bg-gray-400"
                    }`}
                />
                {status}
            </div>
        </div>
    );
});

const UpdateStatusButton = ({ status, id }: { status: "Active" | "Deactivated"; id: string }) => {
  const isDark = useDarkmode();

  const updateStatus = async () => {
    if (
      await confirmDialog(
        "Change customer status?",
        "This can be reverted later.",
        isDark
      )
    ) {
      const response = await updateData(`/api/customers/${id}/status`, {
        status: status === "Active" ? "Deactivated" : "Active",
      });

      if (!response.success) {
        await errorAlert("Error", response.message, isDark);
        return;
      }

      window.location.reload();
    }
  };

  const isActive = status === "Active";

  return (
    <button
      onClick={updateStatus}
      className={cn(
        "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-colors duration-200",
        !isDark &&
          "border-neutral-300 text-neutral-700",
        isDark &&
          "border-neutral-600 text-neutral-300",
        isActive ? "hover:bg-red-50 hover:text-red-400" : "hover:bg-green-50 hover:text-green-400"
      )}
    >
      {isActive ? <Lock size={14} /> : <Unlock size={14} />}
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
};

const CustomersPage = () => {
    const [page, setPage] = useState<number>(1);
    const isDark = useDarkmode();
    const { socket } = useContext(SocketContext);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data : customersRes, loading } = useFetch(`/api/customers/all?page=${page}&searchTerm=${searchDebounce}&limit=20`)
    const [customers, setCustomers] = useState<Customer[]>([]);
    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    useEffect(() => {
        if(customersRes?.customers.length > 0){
            setCustomers(customersRes.customers.sort((a : Customer, b : Customer) => (Number(b.isOnline) || 0) - (Number(a.isOnline) || 0)))
        }
    }, [customersRes])

    useEffect(() => {
        const handleStatusUpdate = ({ customer_id, status, lastOnline }: { customer_id: string; status: boolean; lastOnline: Date }) => {
            
            setCustomers(prev =>
            prev.map(customer =>
                customer._id === customer_id ? { ...customer, isOnline: status, lastOnline } : customer)
                .sort((a, b) => (Number(b.isOnline) || 0) - (Number(a.isOnline) || 0))
            );
        };

        socket?.on("customerStatus", handleStatusUpdate);

        return () => {
            socket?.off("customerStatus", handleStatusUpdate);
        };
    }, [socket]);


    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Title className="mb-4">Customers</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="w-full flex-grow min-h-0 flex flex-col gap-5 p-5">
                <div className="w-full flex justify-between">
                    <div className="w-[400px] bg-red-100">
                        <SearchField 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Email, Firstname, Lastname..."
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                ) : (
                    <CustomizedTable 
                        cols={['Fullname', 'Email', 'Status', 'Last Order', 'Pending Orders', 'Completed Orders', 'Created At', 'Action']}  
                        rows={customers.map((customer : Customer) => ({
                            'Fullname' : (
                                <div className="flex items-center gap-2 relative">
                                <UserAvatar image={customer.image} />

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                            {customer.firstname} {customer.lastname}
                                        </p>

                                        {isWithinLast7Days(customer?.createdAt) && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    {!customer.isOnline && customer.lastOnline ? (
                                        <p className={cn("text-xs text-gray-600", isDark && 'text-gray-400')}>
                                            {minutesAgo(customer.lastOnline)}
                                        </p>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <p className={cn("text-xs text-green-600", isDark && 'text-green-400')}>
                                                Online
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            ),
                            'Email' : customer.email,
                            'Status' : <StatusChip status={customer.status} />,
                            'Last Order' : formatDate(customer.lastOrder) || 'N/A',
                            'Pending Orders' : customer.pendingOrders,
                            'Completed Orders' : customer.completedOrders,
                            'Created At' : formatDate(customer.createdAt),
                            'Action' :  (
                                <div className="flex justify-center">
                                    <UpdateStatusButton status={customer.status} id={customer._id} />
                                </div>
                            )
                        })) || []}
                    />
                )}
                <div className="flex justify-end mt-4">
                    <CustomizedPagination count={customersRes?.totalPages} page={customersRes?.page} onChange={handlePage} />
                </div>
            </Card>
        </PageContainer>
    )
}

export default CustomersPage;