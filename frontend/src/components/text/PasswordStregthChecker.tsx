import { Typography, Box } from "@mui/material";

const PasswordStrengthChecker = ({ password } : { password: string}) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[\W_]/.test(password),
    };

    const isStrong = Object.values(checks).every(Boolean);

    return (
        <Box>
          {!isStrong &&
            <>
            <Typography color={checks.length ? 'green' : 'red'}>
                {checks.length ? '✔' : '✖'} At least 8 characters
            </Typography>
            <Typography color={checks.uppercase ? 'green' : 'red'}>
                {checks.uppercase ? '✔' : '✖'} Contains uppercase letter
            </Typography>
            <Typography color={checks.lowercase ? 'green' : 'red'}>
                {checks.lowercase ? '✔' : '✖'} Contains lowercase letter
            </Typography>
            <Typography color={checks.number ? 'green' : 'red'}>
                {checks.number ? '✔' : '✖'} Contains a number
            </Typography>
            <Typography color={checks.symbol ? 'green' : 'red'}>
                {checks.symbol ? '✔' : '✖'} Contains a special character
            </Typography>
            </>
          }
        </Box>
    )
}

export default PasswordStrengthChecker