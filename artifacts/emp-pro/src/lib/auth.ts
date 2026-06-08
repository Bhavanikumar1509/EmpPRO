export const getToken = () => typeof localStorage !== 'undefined' ? localStorage.getItem('emp_pro_token') : null;
export const setToken = (token: string) => typeof localStorage !== 'undefined' ? localStorage.setItem('emp_pro_token', token) : null;
export const removeToken = () => typeof localStorage !== 'undefined' ? localStorage.removeItem('emp_pro_token') : null;
