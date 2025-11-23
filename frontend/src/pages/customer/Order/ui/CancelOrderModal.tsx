import { Backdrop, Button, CircularProgress, Modal } from "@mui/material";
import Card from "../../../../components/Card";
import useDarkmode from "../../../../hooks/useDarkmode";
import { confirmDialog, errorAlert } from "../../../../utils/swal";
import { updateData } from "../../../../services/api";
import { useState } from "react";
import { CustomizedSelect } from "../../../../components/Select";
import { RedTextField } from "../../../../components/Textfield";
import { RedButton } from "../../../../components/buttons/Button";

const cancellationReasons = [
  "Found a better price elsewhere",
  "Order placed by mistake",
  "Item will not arrive on time",
  "Need to change shipping address",
  "Changed mind about purchase",
  "Payment issues",
  "Other",
];

const CancelOrderModal = ({
  open,
  close,
  id,
}: {
  open: boolean;
  close: () => void;
  id: string;
}) => {
  const [loading, setLoading] = useState(false);
  const isDark = useDarkmode();
  const [reason, setReason] = useState<string>();
  const [otherReason, setOtherReason] = useState<string>("");

  const cancelOrder = async () => {
    if (
      await confirmDialog(
        "Are you sure you want to cancel this order?",
        "This action cannot be undone.",
        isDark
      )
    ) {
      setLoading(true);

      const payload = reason === "Other" ? { cancellationReason: otherReason } : { cancellationReason: reason };
      const response = await updateData(`/api/orders/customer/${id}/cancel`, payload);

      setLoading(false);

      if (response.success) {
        window.location.reload();
      } else {
        errorAlert(response.message, "", isDark);
      }
    }
  };

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        open={open}
        onClose={close}
        aria-labelledby="cancel-order-modal-title"
        aria-describedby="cancel-order-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          zIndex: 1
        }}
      >
        <Card className="w-full flex flex-col gap-5 max-w-md">
          <h2 className="text-lg font-semibold">Cancel Order</h2>
          <p className="text-gray-500">
            Please select a reason for cancelling this order:
          </p>

          <CustomizedSelect
            label="Cancellation Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as string)}
            menu={cancellationReasons.map((r) => ({ label: r, value: r }))}
          />

          {reason === "Other" && (
            <RedTextField
              label="Please specify"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              multiline
              rows={4}
              inputProps={{ maxLength: 100 }}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button
                onClick={close}
                variant="outlined" 
                sx={{ color: "gray", borderColor: 'gray'}}
            >
                Cancel
            </Button>

            <RedButton
                onClick={cancelOrder}
            >Confirm</RedButton>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default CancelOrderModal;
