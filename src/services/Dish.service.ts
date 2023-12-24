import { Dish } from "../models/Restaurant.interfaces";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const generateInitialDish = (): Dish => ({
  id: "",
  name: "",
  image: "",
  category: "",
  description: "",
  price: 0,
  icons: [],
});

export const fetchDishes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createDish = async (data: any) => {
  try {
    const token = localStorage.getItem("token") as string;
    const response = await fetch(`${API_BASE_URL}/admins/dishes`, {
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

export const deleteDish = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admins/dishes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error("Error deleting dish:", error);
    return false; 
  }
};
