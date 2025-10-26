import { Modal} from "@mui/material"
import Card from "../../components/Card";
import { Otp } from "../../components/Textfield";
import { useEffect, useState } from "react"
import EmailIcon from '@mui/icons-material/Email';
import { RedButton } from "../../components/buttons/Button";
import { postData } from "../../services/api";
import { errorAlert, successAlert } from "../../utils/swal";

function formatTime(seconds : number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const VerifyEmailModal = ({ open, customer, code, close } : { open : boolean, customer : NewCustomer, code : number | undefined, close : () => void }) => {
    const [otp, setOtp] = useState(Array(4).fill(""));
    const [sending, setSending] = useState(false);
    const [countdown, setCountdown] = useState(300);

    const sendVerificationCode = async () => {
        setSending(true);
        const response = await postData('/api/auth/signup/verification', { email: customer?.email})
        if(!response.success){
            errorAlert("Error", response.message || "")
            setSending(false);
            return;
        }
        setCountdown(300);
        setSending(false);
        successAlert("Verification code sent", `A new verification code has been sent to ${customer?.email}`)
    };
    
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

    useEffect(() => {
        if (!open) return;

        setCountdown(300);

        const timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
            clearInterval(timer);
            return 0;
            }
            return prev - 1;
        });
        }, 1000);

        return () => clearInterval(timer);
    }, [open, code]);

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
                <p className="mt-4 text-sm text-gray-500">{countdown ? `Code expires in ${formatTime(countdown)}` : 'Verification code expired. Please request a new one.'}</p>
                <RedButton sx={{ marginTop: 4 }} onClick={handleVerify} disabled={countdown === 0 || sending}>Verify</RedButton>
                <div className="mt-4 text-sm">
                    Didn't receive the code?{' '}
                    <button 
                        className="cursor-pointer disabled:cursor-auto text-red-500 underline disabled:text-gray-400" 
                        onClick={sendVerificationCode} 
                        disabled={sending || countdown > 0}
                    >
                        Resend Code
                    </button>
                </div>
            </Card>
        </Modal>
    )
}

export default VerifyEmailModal