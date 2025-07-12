export const signout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('items')
    localStorage.removeItem('cart')
    window.location.href = '/';
}