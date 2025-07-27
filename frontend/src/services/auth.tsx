
export const signout = (path : string) => { 
    localStorage.removeItem('token')
    localStorage.removeItem('items')
    localStorage.removeItem('cart')
    window.location.href = path;
}