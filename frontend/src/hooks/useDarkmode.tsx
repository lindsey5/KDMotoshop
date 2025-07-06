import { useContext } from "react";
import { DarkmodeContext } from "../context/DarkmodeContext";

const useDarkmode = () => {
    const context = useContext(DarkmodeContext);
    const { theme } = context || { theme: 'light'};
    const isDark = theme === 'dark'

    return isDark
}

export default useDarkmode