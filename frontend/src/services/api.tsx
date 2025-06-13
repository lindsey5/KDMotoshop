import axios from 'axios'

const token = localStorage.getItem('token'); 
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const fetchData = async (endpoint : string) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error : any) {
    return error.response.data
  }
};

export const postData = async (endpoint : string, data : any) => {
  try {
    const response = await axios.post(endpoint, data);
    return response.data;

  } catch (error : any) {
    return error.response.data
  }
};

export const updateData = async (endpoint : string, data : any) => {
  try {
    const response = await axios.put(endpoint, data);
    return response.data;
  } catch (error : any) {
    return error.response.data
  }
};

export const deleteData = async (endpoint : string) => {
  try {
    const response = await axios.delete(endpoint);
    return response.data;
  } catch (error : any) {
    return error.response.data
  }
};