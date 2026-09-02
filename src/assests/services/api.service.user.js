import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

export async function getAllUsers() {
    return await axios.get(API_URL);
}

export async function getUserById(userId) {
    return await axios.get(`${API_URL}/${userId}`);
}

export async function createUser(userData) {
    return await axios.post(API_URL, userData);
}

export async function updateUser(userId, userData) {
    return await axios.put(`${API_URL}/${userId}`, userData);
}

export async function deleteUser(userId) {
    return await axios.delete(`${API_URL}/${userId}`);
}
export async function loginUser(credentials) {
    return await axios.post(`${API_URL}/login`, credentials);
}