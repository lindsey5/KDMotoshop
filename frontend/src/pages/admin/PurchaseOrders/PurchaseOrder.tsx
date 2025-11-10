import { useParams } from "react-router-dom";
import BreadCrumbs from "../../../components/BreadCrumbs"
import { Title } from "../../../components/text/Text"
import PageContainer from "../ui/PageContainer"
import Card from "../../../components/Card";
import { CustomizedSelect } from "../../../components/Select";
import useFetch from "../../../hooks/useFetch";
import { Button, Divider } from "@mui/material";
import { formatDate } from "../../../utils/dateUtils";
import { useEffect, useMemo, useState } from "react";
import { cn, formatNumberToPeso } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import AddItemSection from "./ui/AddItemSection";
import { RedButton } from "../../../components/buttons/Button";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";
import { fetchData, postData, updateData } from "../../../services/api";
import PrintIcon from '@mui/icons-material/Print';
import { POStatusChip } from "../../../components/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";

const poInitialState : PurchaseOrder = {
    supplier: { } as Supplier,
    totalAmount: 0,
    status: 'Pending',
    notes: '',
    purchase_items: [] 
}

const PurchaseOrder = () => {
    const { id } = useParams();
    const isDark = useDarkmode();
    const { data : suppliersRes } = useFetch('/api/suppliers?status=Active')
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder>(poInitialState);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Purchase Orders', href: '/admin/purchase-orders' },
        { label: `${id ? '' : 'Create'} Purchase Order`, href: `/admin/purchase-order/${id ? id : ''}` },
    ]

    useEffect(() => {
        const getPurchaseOrder = async () => {
            const response = await fetchData(`/api/purchase-orders/${id}`);
            if(response.success){
                setPurchaseOrder(response.purchaseOrder)
            }
        }

        if(id) getPurchaseOrder();
    }, [])

    const totalAmount = useMemo(() => purchaseOrder.purchase_items.reduce((acc, item) => acc + item.price * item.quantity,0), [purchaseOrder.purchase_items])

    const handleSupplier = (value : string) => {
        const supplier = suppliersRes.suppliers.find((s: Supplier) => s._id ===value);
        setPurchaseOrder((prev) => ({ ...prev, supplier }));
    };

    const addItem = (item : any) => {
        const isExist = purchaseOrder.purchase_items.find(po_item => item.sku === po_item.sku)

        if(isExist){
            errorAlert('Item already exists', '', isDark)
            setLoading(false)
            return;
        }
        
        setPurchaseOrder((prev) => ({
            ...prev, 
            purchase_items: [...prev.purchase_items, item]
        }))
        setShowAdd(false);
    }

    const removeItem = (sku : string) => {
        setPurchaseOrder(prev => ({...prev, purchase_items: prev.purchase_items.filter(item => item.sku !== sku)}))
    }

    const handleSubmit = async () => {
        if(!purchaseOrder.supplier._id){
            errorAlert('Select supplier', 'Please choose a supplier before proceeding.', isDark);
            return;
        }

        if(purchaseOrder.purchase_items.length < 1){
            errorAlert('Add at least one item', 'Your purchase order must include at least one item.', isDark);
            return;
        }

        if(await confirmDialog(
            'Are you sure you want to create this Purchase Order?',
            'Once submitted, it will be saved and visible in the Purchase Orders list.',
            isDark
        )){
            setLoading(true);
            const { _id : supplier_id } = purchaseOrder.supplier;
            const response = await postData('/api/purchase-orders', { purchaseOrder: { ...purchaseOrder, supplier: supplier_id, totalAmount }});
            if(response.success){
                setPurchaseOrder(response.purchaseOrder)
            }
            setLoading(false);
        }
    }

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Purchase Order - ${purchaseOrder.po_id || 'New'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1, h2, h3 { margin: 5px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background: #f5f5f5; }
                        .text-right { text-align: right; }
                    </style>
                </head>
                <body>
                    <h1>Purchase Order</h1>
                    <p><strong>PO ID:</strong> ${purchaseOrder.po_id || ''}</p>
                    <p><strong>Order Date:</strong> ${formatDate(purchaseOrder.createdAt)}</p>
                    <p><strong>Status:</strong> ${purchaseOrder.status}</p>
                    <p><strong>Created By:</strong> ${purchaseOrder?.createdBy?.firstname} ${purchaseOrder?.createdBy?.lastname}</p>
                    
                    <h2>Supplier Information</h2>
                    <p><strong>Name:</strong> ${purchaseOrder.supplier?.name || ''}</p>
                    <p><strong>Email:</strong> ${purchaseOrder.supplier?.email || ''}</p>
                    <p><strong>Phone:</strong> ${purchaseOrder.supplier?.phone || ''}</p>

                    <h2>Items</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchaseOrder.purchase_items.map(item => `
                                <tr>
                                    <td>${item.sku}</td>
                                    <td>${formatNumberToPeso(item.price)}</td>
                                    <td>${item.quantity}</td>
                                    <td>${formatNumberToPeso(item.price * item.quantity)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="text-right"><strong>Total Amount</strong></td>
                                <td>${formatNumberToPeso(totalAmount)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    const onUpdate = async (status: PurchaseOrder['status']) => {
        if (await confirmDialog(`Mark this as ${status}?`, '', isDark)) {
            const response = await updateData(`/api/purchase-orders/${purchaseOrder._id}`, { status });

            if (response.success) {
                successAlert(`Purchase Order marked as ${status}`, '', isDark);
                setPurchaseOrder((prev) => ({ ...prev, status }));
            } else {
                errorAlert('Failed to update status', 'Please try again later.', isDark);
            }
        }
    };

    return (
        <PageContainer className="flex flex-col gap-5">
            <div className="flex justify-between gap-5 items-start">
                <div>
                    <Title className="mb-5">{id ? purchaseOrder.po_id : 'Create Purchase Order'}</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                {purchaseOrder._id && <RedButton startIcon={<PrintIcon />} onClick={handlePrint}>Print</RedButton>}
            </div>
            <div className="h-screen flex flex-col gap-5">
                <div className="flex justify-between items-center gap-5">
                    <div>
                        <p>{`${purchaseOrder._id ? 'Order ' : ''}Date:`} {formatDate(purchaseOrder.createdAt ? purchaseOrder.createdAt : new Date())}</p>
                        {purchaseOrder._id && <p>Created by: {purchaseOrder.createdBy?.firstname} {purchaseOrder.createdBy?.lastname}</p>}
                    </div>
                    {purchaseOrder._id && <POStatusChip status={purchaseOrder.status} />}
                </div>
                <h1 className="font-bold">Supplier Information</h1>
                <Divider sx={{ background: isDark ? '#b8b8b8ff' : ''}}/>
                {!purchaseOrder._id && <CustomizedSelect 
                    label="Select Supplier"
                    sx={{ width: '350px'}}
                    onChange={(e) => handleSupplier(e.target.value as string)}
                    menu={suppliersRes?.suppliers.map((supplier : Supplier )=> ({ value: supplier._id, label: supplier.name})) ?? []}
                />}
                {purchaseOrder.supplier?._id && <Card className="md:max-w-1/2">
                      <div className="flex justify-between">
                        <span className={cn("text-gray-600 font-medium", isDark && 'text-gray-400')}>Supplier Name:</span>
                        <span className={cn("text-gray-900 font-semibold", isDark && 'text-gray-200')}>{purchaseOrder.supplier.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={cn("text-gray-600 font-medium", isDark && 'text-gray-400')}>Email:</span>
                        <span className={cn("text-gray-900 font-semibold", isDark && 'text-gray-200')}>{purchaseOrder.supplier.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={cn("text-gray-600 font-medium", isDark && 'text-gray-400')}>Phone:</span>
                        <span className={cn("text-gray-900 font-semibold", isDark && 'text-gray-200')}>{purchaseOrder.supplier.phone}</span>
                    </div>
                </Card>}
                <div className="flex justify-between items-center">
                    <h1 className="font-bold mt-10">Items</h1>
                    {!purchaseOrder._id &&<RedButton onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : 'Add Item'}</RedButton>}
                </div>
                <Divider sx={{ background: isDark ? '#b8b8b8ff' : ''}}/>
                {showAdd && !purchaseOrder._id && <AddItemSection addItem={addItem}/>}
                <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-red-600 to-red-600 text-white">
                        <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                        {!purchaseOrder._id && <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrder.purchase_items.map((item, idx) => (
                        <tr
                            key={item.sku}
                            className={`${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition`}
                        >
                            <td className="px-6 py-3 text-gray-700 font-medium">{item.sku}</td>
                            <td className="px-6 py-3 text-gray-700">
                            {formatNumberToPeso(item.price)}
                            </td>
                            <td className="px-6 py-3">
                            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                {item.quantity}
                            </span>
                            </td>
                            {!purchaseOrder._id && <td className="px-6 py-3">
                                <Button sx={{ color: 'red'}} onClick={() => removeItem(item.sku)}>Remove</Button>
                            </td>}
                        </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-800">
                        <td className="px-6 py-3">Total</td>
                        <td className="px-6 py-3" colSpan={3}>
                            {formatNumberToPeso(totalAmount)}
                        </td>
                        </tr>
                    </tfoot>
                </table>
                <div className="flex justify-end gap-5">
                    {!purchaseOrder._id ? 
                        <RedButton onClick={handleSubmit} disabled={loading}>Create</RedButton>
                        : updateButtons(purchaseOrder.status, onUpdate)}
                </div>
            </div> 
        </PageContainer>
    )
}

export default PurchaseOrder

const updateButtons = (
  status: PurchaseOrder['status'],
  onUpdate: (newStatus: PurchaseOrder['status']) => void
) => {
  switch (status) {
    case 'Pending':
      return (
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => onUpdate('Approved')}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => onUpdate('Rejected')}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BlockIcon />}
            onClick={() => onUpdate('Cancelled')}
          >
            Cancel
          </Button>
        </div>
      );
    case 'Approved':
      return (
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="success"
            startIcon={<DoneAllIcon />}
            onClick={() => onUpdate('Received')}
          >
            Mark Received
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BlockIcon />}
            onClick={() => onUpdate('Cancelled')}
          >
            Cancel
          </Button>
        </div>
      );
    default:
      return null;
  }
};