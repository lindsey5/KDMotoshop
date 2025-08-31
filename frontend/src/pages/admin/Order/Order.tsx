import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { fetchData, updateData } from "../../../services/api";
import { formatToLongDateFormat } from "../../../utils/dateUtils";
import { cn, formatNumberToPeso } from "../../../utils/utils";
import { Avatar, Backdrop, Button, CircularProgress, IconButton } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import BreadCrumbs from "../../../components/BreadCrumbs";
import OrderItemsContainer from "./ui/OrderItems";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { RedButton } from "../../../components/buttons/Button";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";
import Card from "../../../components/Card";
import useDarkmode from "../../../hooks/useDarkmode";
import OrderStatusStepper from "../../../components/Stepper";
import { Title } from "../../../components/text/Text";
import PageContainer from "../ui/PageContainer";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PlatformChip from "../../../components/Chip";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>({} as Order);
    const navigate = useNavigate();
    const isDark = useDarkmode();

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Details', href: `/admin/orders/${id}`}
    ]

    useEffect(() => {
        const getOrderAsync = async () => {
            const response = await fetchData(`/api/orders/${id}`)
            if(response.success){
              const { customer, ...rest } = response.order
              setOrder({...rest, customer: { ...customer, image: customer.customer_id?.image.imageUrl ?? ''}})
            }else window.location.href = '/admin/dashboard'
        }

        getOrderAsync();
    }, [id])
    
    if(!order._id) return (
        <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
            <CircularProgress sx={{ color: 'red'}}/>
         </div>
    )


    return <PageContainer className="flex flex-col justify-start p-0">
        <div className={cn("p-5 border-b-1", isDark ? 'bg-[#1e1e1e] border-gray-600' : 'bg-white border-gray-300')}>
            <div className="flex items-center mb-6 gap-2">
                <IconButton onClick={() => navigate(-1)} sx={{ color: isDark? 'white' : ''}}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Title fontSize="xl">{order.order_id}</Title>
            </div>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </div>
        <OrderStatusStepper order={order}/>
        <div className="flex flex-wrap items-start p-5 gap-5">
            <div className="flex flex-col gap-5 flex-1">
                <OrderItemsContainer orderItems={order.orderItems} />
                <Card>
                    <h1 className="font-bold text-xl">Payment Summary</h1>
                    <div className="my-6 grid grid-cols-2 gap-5 p-2">
                        <p>Subtotal</p>
                        <p className="text-right">{formatNumberToPeso(order.subtotal)}</p>
                        <p>Shipping Fee</p>
                        <p className="text-right">Free</p>
                    </div>
                    <div className="flex justify-between">
                        <h1 className="font-bold text-xl">Total</h1>
                        <h1 className="font-bold text-xl">{formatNumberToPeso(order.total)}</h1>
                    </div>
                </Card>
                <Card className="justify-end hidden lg:flex">
                    <UpdateButton id={id as string} order={order} setOrder={setOrder}/>
                </Card>
            </div>
            <div className="w-full lg:w-[350px] flex flex-col gap-5">
                <Card className="w-full flex flex-col gap-5">
                    <h1 className="font-bold text-xl">Customer</h1>
                    <div className={cn("flex gap-5 items-center pb-5 border-b-1 border-gray-300", isDark && 'border-gray-700')}>
                        <Avatar src={order.customer.image} />
                        <h1>{order.customer.firstname} {order.customer.lastname}</h1>
                    </div>
                    <div className={cn("flex flex-col gap-5 pb-5 border-b-1 border-gray-300", isDark && 'border-gray-700')}>
                        <h1 className="font-bold">Contact Info</h1>
                        <div className="flex gap-3">
                            <EmailOutlinedIcon />
                            <p>{order.customer.email || 'N/A'}</p>
                        </div>
                        <div className="flex gap-3">
                            <LocalPhoneOutlinedIcon />
                            <p>{order.customer.phone || 'N/A'}</p>
                        </div>
                    </div>
                    {order.address && <div className="flex flex-col gap-2 pb-5 border-b-1 border-gray-300">
                        <h1 className="font-bold">Address</h1>
                         <p>{order.customer.firstname} {order.customer.lastname}</p>
                        <p>{order.address?.street}</p>
                        <p>{order.address?.barangay}</p>
                        <p>{order.address?.city}</p>
                        <p>{order.address?.region}</p>
                    </div>}
                    <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Order Date: {formatToLongDateFormat(order?.createdAt)}</p>
                    {order?.deliveredAt && <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Delivered At: {formatToLongDateFormat(order?.deliveredAt)}</p>}
                    <div className="flex gap-3">
                      <p className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Order Channel:</p>
                      <PlatformChip platform={order.order_source} />
                    </div>
                </Card>
                {order.createdBy && <Card className="w-full">
                    <h1 className="font-bold mb-4">Created by:</h1>
                    <div className="flex items-center gap-3">
                        <Avatar src={order?.createdBy?.image?.imageUrl} />
                        <p>{order?.createdBy?.firstname} {order?.createdBy?.lastname}</p>
                    </div>
                </Card>}
                <Card className="flex justify-end lg:hidden">
                    <UpdateButton id={id as string} order={order} setOrder={setOrder}/>
                </Card>
            </div>
        </div>
    </PageContainer>
}

export default OrderDetails

const UpdateButton = ({ order, setOrder, id }: { order: Order, id: string, setOrder: React.Dispatch<React.SetStateAction<Order>> }) => {
  const isDark = useDarkmode();
  const [loading, setLoading] = useState<boolean>(false);

  const updateOrder = async (message: string, subMessage: string, status: string) => {
    if (await confirmDialog(message, subMessage, isDark)) {
      setLoading(true)
      const response = await updateData(`/api/orders/${id}`, { ...order, status });
      if (response.success) {
        await successAlert(`${order.order_id} successfully updated from ${order.status} to ${status}`, '', isDark)
        setOrder(prev => ({ ...prev, status: status as Order['status'] }))
      } else {
        errorAlert(response.message, '', isDark);
      }
      setLoading(false)
    }
  };

  return (
    <div className="flex gap-5">
      <Backdrop
          sx={{ color: '#fff', zIndex: 1 }}
          open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {order.status === 'Pending' &&
        <RedButton
          onClick={() => updateOrder('Reject Order?', 'This action is irreversible.', 'Rejected')}
          startIcon={<CancelIcon />}
        >
          Reject Order
        </RedButton>
      }

      {order.status === 'Pending' &&
        <Button
          onClick={() => updateOrder('Confirm Order?', 'Make sure you’ve reviewed the details.', 'Confirmed')}
          startIcon={<CheckIcon />}
          sx={{ backgroundColor: 'green', color: 'white' }}
          variant="contained"
        >
          Confirm Order
        </Button>
      }

      {order.status === 'Confirmed' &&
        <RedButton
          onClick={() => updateOrder('Cancel Order?', 'This action is irreversible.', 'Cancelled')}
          startIcon={<CancelIcon />}
        >
          Cancel Order
        </RedButton>
      }

      {order.status === 'Shipped'&&
        <RedButton
          onClick={() => updateOrder('Marked as failed?', 'This action is irreversible.', 'Failed')}
          startIcon={<CancelIcon />}
        >
          Mark as Failed
        </RedButton>
      }

      {order.status === 'Confirmed' &&
        <Button
          onClick={() => updateOrder('Ship Order?', 'Make sure you’ve reviewed the details.', 'Shipped')}
          startIcon={<LocalShippingIcon />}
          variant="contained"
        >
          Ship Order
        </Button>
      }

    {order.status === 'Shipped' &&
        <Button
          onClick={() => updateOrder('Mark as Delivered?', 'You are confirming that the order has been successfully delivered to the customer.', 'Delivered')}
          startIcon={<CheckIcon />}
          sx={{ backgroundColor: 'green', color: 'white' }}
          variant="contained"
        >
          Mark as Delivered
        </Button>
      }

    </div>
  );
};