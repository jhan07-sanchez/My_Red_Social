import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/usuarios/`;

export const registerUser = (email, password) => {
  return axios.post(`${API_URL}registro/`, { email, password });
};

export const verifyUser = (email, verificationCode) => {
  return axios.post(`${API_URL}verificar/`, { email, verification_code: verificationCode });
};
