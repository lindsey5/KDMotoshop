import { Modal} from "@mui/material"
import Card from "../../components/Card";
import { Otp } from "../../components/Textfield";
import { useState } from "react"
import EmailIcon from '@mui/icons-material/Email';
import { RedButton } from "../../components/buttons/Button";
import { postData } from "../../services/api";
import { errorAlert } from "../../utils/swal";

const VerifyEmailModal = ({ open, customer, code } : { open : boolean, customer : NewCustomer, code : number | undefined }) => {
    const [otp, setOtp] = useState(Array(4).fill(""));

    const handleVerify = async () => {
        const enteredCode = parseInt(otp.join("")); 

        if (otp.includes("") || isNaN(enteredCode)) {
            errorAlert("Please enter the complete verification code", "");
            return;
        }

        if (enteredCode === code) {
            const response = await postData('/api/auth/signup', customer);
            response.success ? window.location.href = '/' : errorAlert("Signup failed", response.message || "");
        } else {
            errorAlert("Incorrect code", "");
        }
    };

    return (
        <Modal 
            open={open}
            onClose={close}
            aria-labelledby="create-admin-modal-title"
            aria-describedby="create-admin-modal-description"
            sx={{
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card className="p-10 flex flex-col items-center">
                <EmailIcon sx={{ fontSize: 60 }} />
                <h1 className="font-bold text-2xl my-2">Enter verification code</h1>
                <p>Please enter the code we sent to:</p>
                <p className="mb-18">{customer?.email}</p>
                <Otp otp={otp} setOtp={setOtp}/>
                <RedButton sx={{ marginTop: 4 }} onClick={handleVerify}>Verify</RedButton>
            </Card>
        </Modal>
    )
}

export default VerifyEmailModal