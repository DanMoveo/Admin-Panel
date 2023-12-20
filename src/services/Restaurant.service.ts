import { Restaurant } from "../models/Restaurant.interfaces";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const generateInitialRestaurant = (): Restaurant => ({
  id: "",
  image: "",
  name: "",
  chefId: {
    id: "",
    name: "",
    image: "",
  },
  rate: 0,
  dishes: [],
});


export const fetchRestaurants = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants?page=1&pageSize=200`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createRestaurant = async (data: any) => {
  try {
    const token = localStorage.getItem("token") as string;
    const response = await fetch(`${API_BASE_URL}/admins/restaurants`, {
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

export const deleteRestaurant = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admins/restaurants/${id}`, {
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
    console.error("Error deleting restaurant:", error);
    return false;
  }
};

