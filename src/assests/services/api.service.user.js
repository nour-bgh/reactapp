import axios from "axios";

const API_URL = "http://localhost:8080/api/user";


export async function getUserById() {
    return await axios.get('${API_URL}/getAllusers');
}


export async function deleteuser(userId) {
    return await axios.delete(`${API_URL}deleteuser/${userId}`);
}
