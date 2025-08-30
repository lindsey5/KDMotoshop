import Modal from "@mui/material/Modal";
import Card from "../../../../components/Card";
import { useState, useEffect } from "react";
import { RedTextField } from "../../../../components/Textfield";
import { RedButton } from "../../../../components/buttons/Button";
import { postData, updateData } from "../../../../services/api";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";
import useDarkmode from "../../../../hooks/useDarkmode";
import { Backdrop, CircularProgress } from "@mui/material";

interface Supplier {
    _id?: string;
    name: string;
    email: string;
    phone: string;
}

interface SupplierModalProps {
    open: boolean;
    close: () => void;
    supplier?: Supplier;
}

const SupplierModal = ({ supplier, open, close }: SupplierModalProps) => {
  const [supplierState, setSupplierState] = useState<Supplier>({
    name: "",
    email: "",
    phone: "",
  });
    const [loading, setLoading] = useState<boolean>(false);
    const isDark = useDarkmode();

    // Sync state when modal opens or supplier changes
    useEffect(() => {
        if (supplier) {
        setSupplierState(supplier);
        } else {
        setSupplierState({ name: "", email: "", phone: "" });
        }
    }, [supplier, open]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (await confirmDialog(
        supplier ? "Update Supplier" : "Add Supplier",
        supplier
        ? "Are you sure you want to update this supplier's details?"
        : "Are you sure you want to add this new supplier?",
        isDark
    )) {
        setLoading(true);

        const response = supplier
        ? await updateData(`/api/suppliers/${supplier._id}`, supplierState)
        : await postData("/api/suppliers", supplierState);

        if (response.success) {
            const message = supplier
                ? "Supplier updated successfully!"
                : "Supplier added successfully!";

            const subMessage = supplier
                ? "The supplier details have been updated in the system."
                : "The new supplier has been added to the system.";

            await successAlert(message, subMessage, isDark);
            window.location.reload();
        } else {
            const subMessage = "Please check the entered details and try again.";
            errorAlert(response.message, subMessage, isDark);
        }

        setLoading(false);
    }

  };

    return (
        <Modal
        open={open}
        onClose={close}
        aria-labelledby="supplier-modal-title"
        aria-describedby="supplier-modal-description"
        sx={{
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        <Card className="w-[90%] max-w-[450px] p-10">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Backdrop
                sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <h1 className="text-2xl font-bold">
                {supplier ? "Edit" : "Add"} Supplier
            </h1>

            <RedTextField
                label="Name"
                required
                value={supplierState.name}
                onChange={(e) =>
                setSupplierState((prev) => ({ ...prev, name: e.target.value }))
                }
            />
            <RedTextField
                label="Email"
                type="email"
                required
                value={supplierState.email}
                onChange={(e) =>
                setSupplierState((prev) => ({ ...prev, email: e.target.value }))
                }
            />
            <RedTextField
                label="Phone"
                required
                value={supplierState.phone}
                onChange={(e) =>
                setSupplierState((prev) => ({ ...prev, phone: e.target.value }))
                }
            />

            <RedButton type="submit">
                {supplier ? "Save changes" : "Add new supplier"}
            </RedButton>
            </form>
        </Card>
        </Modal>
    );
};

export default SupplierModal;
