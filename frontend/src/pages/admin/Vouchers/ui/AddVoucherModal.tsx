import Modal from "@mui/material/Modal";
import Card from "../../../../components/Card";
import { useState, useEffect } from "react";
import { RedTextField } from "../../../../components/Textfield";
import { RedButton } from "../../../../components/buttons/Button";
import { postData } from "../../../../services/api";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";
import useDarkmode from "../../../../hooks/useDarkmode";
import { Backdrop, CircularProgress } from "@mui/material";
import { CustomizedSelect } from "../../../../components/Select";
import { cn } from "../../../../utils/utils";

interface AddVoucherModalProps {
    open: boolean;
    close: () => void;
}

const generateRandomCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const AddVoucherModal = ({ open, close }: AddVoucherModalProps) => {
    const [voucherState, setVoucherState] = useState({
        name: "",
        code: "",
        voucherType: "percentage",
        percentage: 0,
        amount: 0,
        minSpend: 0,
        maxDiscount: 0,
        startDate: "",
        endDate: "",
        usageLimit: 1,
    });

    const [loading, setLoading] = useState(false);
    const isDark = useDarkmode();

    useEffect(() => {
        if (open) {
        setVoucherState({
            name: "",
            code: '',
            voucherType: "percentage",
            percentage: 0,
            amount: 0,
            minSpend: 0,
            maxDiscount: 0,
            startDate: "",
            endDate: "",
            usageLimit: 1,
        });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
        await confirmDialog(
            "Add Voucher",
            "Are you sure you want to create this new voucher?",
            isDark
        )
        ) {
        setLoading(true);

        const response = await postData("/api/vouchers", voucherState);

        if (response.success) {
            await successAlert(
            "Voucher Created!",
            "The new voucher has been added successfully.",
            isDark
            );
            window.location.reload();
        } else {
            errorAlert(response.message, "Please check your input.", isDark);
        }

        setLoading(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <Modal
        open={open}
        onClose={close}
        sx={{
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        <Card className="w-[90%] max-w-[600px] p-10">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
            <Backdrop sx={(t) => ({ zIndex: t.zIndex.drawer + 1 })} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <h1 className="text-2xl font-bold col-span-2">Add Voucher</h1>

            {/* Voucher Name */}
            <RedTextField
                label="Voucher Name"
                required
                value={voucherState.name}
                onChange={(e) => setVoucherState((p) => ({ ...p, name: e.target.value }))}
            />

            {/* Voucher Code (manual or auto) */}
            <div className="relative pb-5">
                <RedTextField
                    label="Code"
                    required
                    value={voucherState.code}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    onChange={(e) =>
                    setVoucherState((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                    }
                />
                <button 
                    type="button"
                    className={cn("absolute right-0 bottom-0 text-sm text-red-500 cursor-pointer hover:opacity-50", isDark && 'text-white')}
                    onClick={() => setVoucherState(prev => ({ ...prev, code: generateRandomCode(8)}))}
                >Generate Code
                </button>
            </div>

            {/* Voucher Type */}
            <CustomizedSelect
                label="Voucher Type"
                sx={{ height: 55 }}
                menu={[
                { label: "Percentage", value: "percentage" },
                { label: "Amount", value: "amount" },
                ]}
                value={voucherState.voucherType}
                onChange={(e) =>
                setVoucherState((p) => ({
                    ...p,
                    voucherType: e.target.value as "percentage" | "amount",
                }))
                }
            />

            {/* Percentage (only if type is percentage) */}
            {voucherState.voucherType === "percentage" && (
                <RedTextField
                label="Percentage (%)"
                type="number"
                value={voucherState.percentage || ""}
                onChange={(e) =>
                    setVoucherState((p) => ({ ...p, percentage: Number(e.target.value) }))
                }
                />
            )}

            {/* Amount (only if type is amount) */}
            {voucherState.voucherType === "amount" && (
                <RedTextField
                label="Amount Discount"
                type="number"
                value={voucherState.amount || ""}
                onChange={(e) =>
                    setVoucherState((p) => ({ ...p, amount: Number(e.target.value) }))
                }
                />
            )}

            {/* Minimum Spend */}
            <RedTextField
                label="Minimum Spend"
                type="number"
                value={voucherState.minSpend || ""}
                onChange={(e) =>
                setVoucherState((p) => ({ ...p, minSpend: Number(e.target.value) }))
                }
            />

            {/* Maximum Discount */}
            {voucherState.voucherType === "percentage" && <RedTextField
                label="Maximum Discount"
                type="number"
                value={voucherState.maxDiscount || ""}
                onChange={(e) =>
                setVoucherState((p) => ({ ...p, maxDiscount: Number(e.target.value) }))
                }
            />}

            {/* Start Date */}
            <RedTextField
                label="Start Date"
                type="date"
                value={voucherState.startDate}
                onChange={(e) =>
                setVoucherState((p) => ({ ...p, startDate: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
            />

            {/* End Date */}
            <RedTextField
                label="End Date"
                type="date"
                value={voucherState.endDate}
                onChange={(e) =>
                setVoucherState((p) => ({ ...p, endDate: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: voucherState.startDate || today }}
            />

            {/* Usage Limit */}
            <RedTextField
                label="Usage Limit"
                type="number"
                value={voucherState.usageLimit || ""}
                onChange={(e) =>
                setVoucherState((p) => ({ ...p, usageLimit: Number(e.target.value) }))
                }
            />

            {/* Submit Button */}
            <RedButton type="submit" className="col-span-2">
                Add Voucher
            </RedButton>
            </form>
        </Card>
        </Modal>
    );
};

export default AddVoucherModal;
