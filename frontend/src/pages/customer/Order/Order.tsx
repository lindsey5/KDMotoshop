import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { fetchData } from "../../../services/api";
import { formatToLongDateFormat } from "../../../utils/dateUtils";
import { cn, formatNumberToPeso } from "../../../utils/utils";
import { Avatar, CircularProgress, IconButton } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import BreadCrumbs from "../../../components/BreadCrumbs";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Card from "../../../components/Card";
import useDarkmode from "../../../hooks/useDarkmode";
import OrderStatusStepper from "../../../components/Stepper";
import { RedButton } from "../../../components/buttons/Button";
import { Status, Title } from "../../../components/text/Text";
import CustomerOrderItems from "./ui/OrderItems";
import { useSelector } from "react-redux";
import type { RootState } from "../../../features/store";
import CancelOrderModal from "./ui/CancelOrderModal";

const CustomerOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();
    const navigate = useNavigate();
    const isDark = useDarkmode();
    const { user : customer, loading : customerLoading} = useSelector((state : RootState) => state.user)
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Home', href: '/' },
        { label: 'Orders', href: '/orders' },
        { label: order?.order_id ?? '', href: `/order/${id}`}
    ]

    useEffect(() => {
        const getOrderAsync = async () => {
            const response = await fetchData(`/api/orders/${id}`)
            console.log(response)
            if(response.success){
                const { customer, ...rest } = response.order
                setOrder({...rest, customer: { ...customer, customer_id: customer.customer_id._id, image: customer.customer_id?.image.imageUrl ?? ''}})
            }else window.location.href = '/login'
        }

        getOrderAsync();
    }, [id])

    const discountedPrice = useMemo(() => {
        if(!order?.voucher) return 0;
        return order.orderItems?.reduce((total, item) => item.lineTotal + total, 0)
    }, [order]);
    
    
    if(!order) return (
        <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
            <CircularProgress sx={{ color: 'red'}}/>
         </div>
    )

    if (!customer && !customerLoading) {
        return <Navigate to="/" />;
    }

    if(customer?._id === order.customer?.customer_id) {
        return <div className={cn("pt-20 transition-colors duration-600 flex flex-col justify-start bg-gray-100 min-h-screen", isDark && 'bg-[#1e1e1e]')}>
            <div className={cn("p-5 border-b-1", isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300')}>
                <div className="flex items-center mb-6 gap-2">
                    <IconButton onClick={() => navigate(-1)} sx={{ color: isDark? 'white' : ''}}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Title className="text-2xl">{order?.order_id}</Title>
                </div>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>
            
            <div className="lg:block hidden">
                <OrderStatusStepper order={order}/>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-start p-5 gap-5">
                <div className="flex flex-col gap-5 flex-2">
                    <div className="flex lg:hidden ">
                        <div className={cn("font-bold px-3 py-1 rounded-full", isDark && 'bg-[#313131] text-white')}>
                            <Status status={order.status} isDark={isDark} />
                        </div>
                    </div>
                    <CustomerOrderItems order={order}/>
                    <Card>
                        <h1 className="font-bold text-lg md:text-xl">Payment Summary</h1>
                        <div className="text-sm md:text-base my-6 grid grid-cols-2 gap-5 p-2">
                            <p >Subtotal</p>
                            <p className="text-right">{formatNumberToPeso(order.subtotal)}</p>
                            {order?.voucher &&
                            <>
                                <p>Voucher Name:</p>
                                <p className={`text-right text-green-600 ${isDark && 'text-green-500'}`}>{order.voucher.name}</p>
                                 <p >Discount:</p>
                                <p className={`text-right text-red-600 ${isDark && 'text-red-500'}`}> - {order.voucher?.voucherType === 'amount' ? formatNumberToPeso(order.voucher?.amount ?? 0) : `${order.voucher?.percentage}%`}</p>
                                <p>Max Discount:</p>
                                <p className={`text-right text-green-600 ${isDark && 'text-green-500'}`}>{order.voucher.maxDiscount ? formatNumberToPeso(order.voucher.maxDiscount) : 'N/A'}</p>
                                <p>Min. Spend:</p>
                                <p className={`text-right text-green-600 ${isDark && 'text-green-500'}`}>{formatNumberToPeso(order.voucher.minSpend)}</p>
                                {discountedPrice && <>
                                <p>Discounted Subtotal:</p>
                                <p className="text-right">{formatNumberToPeso(discountedPrice)}</p>
                                </>}
                            </>
                            }
                            <p>Shipping Fee</p>
                            <p className="text-right">{order?.shipping_fee ? formatNumberToPeso(order?.shipping_fee) : 'Free'}</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg md:text-xl">
                            <h1>Total</h1>
                            <h1>{formatNumberToPeso(order.total)}</h1>
                        </div>
                    </Card>
                    <Card className="justify-end hidden lg:flex">
                        {order?.cancellationReason && <div className={cn("w-full bg-gray-200 p-3 rounded-md", isDark && 'bg-gray-700')}>
                            <h1 className="font-bold text-lg mb-2">Cancellation Reason:</h1>
                            <p>{order.cancellationReason}</p>
                        </div>}
                        {(order.status === 'Pending' || order.status === 'Confirmed') && <RedButton onClick={() => setOpenCancelDialog(true)}>Cancel Order</RedButton>}
                    </Card>
                </div>
                <div className="flex-1 lg:max-w-[400px] flex flex-col gap-5">
                    <Card className="w-full flex flex-col gap-5">
                        <h1 className="font-bold text-lg md:text-xl">Information:</h1>
                        <div className={cn("flex gap-5 items-center pb-5 border-b-1 border-gray-300", isDark && 'border-gray-700')}>
                            <Avatar src={order?.customer?.image} />
                            <h1>{order?.customer?.firstname} {order?.customer?.lastname}</h1>
                        </div>
                        <div className={cn("text-sm md:text-base flex flex-col gap-5 pb-5 border-b-1 border-gray-300", isDark && 'border-gray-700')}>
                            <h1 className="font-bold">Contact Info</h1>
                            <div className="flex gap-3">
                                <EmailOutlinedIcon />
                                <p>{order?.customer?.email || 'N/A'}</p>
                            </div>
                            <div className="flex gap-3">
                                <LocalPhoneOutlinedIcon />
                                <p>{order?.customer?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        {order.address && <div className="text-sm md:text-base flex flex-col gap-2 pb-5 border-b-1 border-gray-300">
                            <h1 className="font-bold">Address</h1>
                            <p>{order?.customer?.firstname} {order?.customer?.lastname}</p>
                            <p>{order.address?.street}</p>
                            <p>{order.address?.barangay}</p>
                            <p>{order.address?.city}</p>
                            <p>{order.address?.region}</p>
                        </div>}
                        <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Order Date: {formatToLongDateFormat(order?.createdAt)}</p>
                        <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Payment Method: {order.payment_method}</p>
                        {!['Cancelled', 'Delivered', 'Failed', 'Rejected'].includes(order.status) && (
                        <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>
                            Expected delivery: 3-5 days
                        </p>
                        )}
                        {order?.deliveredAt && <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Delivered At: {formatToLongDateFormat(order?.deliveredAt)}</p>}

                    </Card>
                </div>
            </div>
            <div className={cn("lg:hidden flex justify-end p-5", isDark && 'text-white')}>
                {order?.cancellationReason && <div className={cn("w-full bg-gray-200 p-3 rounded-md", isDark && 'bg-gray-700')}>
                            <h1 className="font-bold text-lg mb-2">Cancellation Reason:</h1>
                            <p>{order.cancellationReason}</p>
                        </div>}
                {(order.status === 'Pending' || order.status === 'Confirmed') && <RedButton onClick={() => setOpenCancelDialog(true)}>Cancel Order</RedButton>}
            </div>
            <CancelOrderModal 
                open={openCancelDialog}
                close={() => setOpenCancelDialog(false)}
                id={id as string}
            />
        </div>
    }
}

export default CustomerOrderDetails