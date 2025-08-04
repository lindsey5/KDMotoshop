import { postData } from "./api";

export const signout = async (path : string) => {
    await postData('/api/auth/logout', { })
    localStorage.removeItem('items')
    localStorage.removeItem('cart')
    window.location.href = path;
}