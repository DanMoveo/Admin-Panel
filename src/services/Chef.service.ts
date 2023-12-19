import { Chef } from "../models/Restaurant.interfaces";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const generateInitialChef = (): Chef => ({
  id: "",
  name: "",
  image: "",
});

export const fetchChefs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chefs/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createChef = async (data: any) => {
  try {
    const token = localStorage.getItem("token") as string;
    const response = await fetch(`${API_BASE_URL}/admins/chefs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteChef = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admins/chefs/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return true; // Deleted successfully
    } else {
      return false; // Failed to delete
    }
  } catch (error) {
    console.error("Error deleting chef:", error);
    return false; // Failed to delete due to an error
  }
};
