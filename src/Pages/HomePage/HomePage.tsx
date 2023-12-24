import "./HomePage.scss";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tabs from "../../Components/Tabs/Tabs";
import axios from "axios";
import {
  Restaurant,
  Chef,
  Dish,
  DecodedToken,
} from "../../models/Restaurant.interfaces";
import {
  createRestaurant,
  deleteRestaurant,
  fetchRestaurants,
  generateInitialRestaurant,
} from "../../services/Restaurant.service";
import { jwtDecode } from "jwt-decode";
import {
  createDish,
  deleteDish,
  fetchDishes,
  generateInitialDish,
} from "../../services/Dish.service";
import {
  createChef,
  deleteChef,
  fetchChefs,
  generateInitialChef,
} from "../../services/Chef.service";
import SignOutButton from "../../Components/SignOutButton/SignOutButton";
import { RoutePaths } from "../../shared/constants";
import { validateFields } from "../../services/validationHelper";
import NewRestaurantForm from "../../Components/NewRestaurantForm/NewRestaurantForm";
import NewChefForm from "../../Components/NewChefForm/NewChefForm";
import NewDishForm from "../../Components/NewDishForm/NewDishForm";
import DeleteButton from "../../Components/DeleteButton/DeleteButton";
import UpdateRestaurantForm from "../../Components/UpdateRestaurantForm/UpdateRestaurantForm";
import UpdateChefForm from "../../Components/UpdateChefForm/UpdateChefForm";
import UpdateDishForm from "../../Components/UpdateDishForm/UpdateDishForm";
import CardListContainer from "../../Components/CardListContainer/CardListContainer";

const API_BASE_URL = "http://localhost:5000";
function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const tabs: string[] = ["Restaurants", "Chefs", "Dishes"];
  const { type } = useParams<{ type?: string }>();
  const initialActiveTab = type ? tabs.indexOf(type) : 0;
  const [activeTab, setActiveTab] = useState<number>(initialActiveTab);
  const [allChefs, setAllChefs] = useState<Chef[]>([]);
  const [clickedDivId, setClickedDivId] = useState<string | null>(null);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [allDishes2, setAllDishes2] = useState<Dish[]>([]);
  const icons = ["spicy", "vegan", "vegetarian"];
  const [role, setRole] = useState<string>();
  const [newRestaurant, setNewRestaurant] = useState<Restaurant>(
    generateInitialRestaurant()
  );
  const [newChef, setNewChef] = useState<Chef>(generateInitialChef);
  const [newDish, setNewDish] = useState<Dish>(generateInitialDish);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(
    generateInitialRestaurant
  );
  const [selectedChef, setSelectedChef] = useState<Chef>(generateInitialChef);
  const [selectedDish, setSelectedDish] = useState<Dish>(generateInitialDish);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    if (!token) {
      console.error("Token is not present");
      navigate(RoutePaths.Login);
      return;
    }
    const decoded = jwtDecode(token) as DecodedToken;
    setRole(decoded.roles[0]);
    async function fetchChefs() {
      try {
        const response = await axios.get<Chef[]>(`${API_BASE_URL}/chefs/`);
        setAllChefs(response.data);
        const response1 = await axios.get<Dish[]>(`${API_BASE_URL}/dishes/`);
        setAllDishes(response1.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchChefs();
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tabIndex: number) => {
    try {
      let data;
      switch (tabIndex) {
        case 0: // Restaurants
          data = await fetchRestaurants();
          setRestaurants(data);
          break;
        case 1: // Chefs
          data = await fetchChefs();
          setChefs(data);
          break;
        case 2: // Dishes
          data = await fetchDishes();
          setDishes(data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleCardClick = async (item: Restaurant | Chef | Dish) => {
    setClickedDivId(item.id);
    if ("chefId" in item) {
      // It's a restaurant
      setSelectedRestaurant(item);
      console.log(item);
      try {
        const response2 = await axios.get<Restaurant>(
          `${API_BASE_URL}/restaurants/restaurant/${item.id}`
        );
        const parsedRes = JSON.parse(JSON.stringify(response2.data.dishes));
        setAllDishes2(parsedRes);
      } catch (error) {
        console.error(error);
      }
    } else if ("icons" in item) {
      // It's a dish
      setSelectedDish(item);
    } else {
      // It's a chef
      setSelectedChef(item);
    }
  };

  const isCardClicked = (
    id: string,
    isChef: boolean,
    isDish: boolean
  ): boolean => {
    switch (true) {
      case isChef:
      case isDish:
        return id === clickedDivId;
      default:
        return false;
    }
  };

  const handleNewClick = async () => {
    try {
      switch (activeTab) {
        case 0: // Restaurants
          if (
            validateFields([
              newRestaurant.image,
              newRestaurant.name,
              newRestaurant.chefId.id,
              newRestaurant.rate,
            ])
          )
            return;

          const restaurantData = {
            image: newRestaurant.image,
            name: newRestaurant.name,
            chefId: newRestaurant.chefId.id,
            rate: newRestaurant.rate,
            dishes: newRestaurant.dishes,
          };
          const restaurantResponse = await createRestaurant(restaurantData);
          restaurantResponse.ok
            ? alert("Restaurant created successfully")
            : alert("Failed to create restaurant");
          break;

        case 1: // Chefs
          if (validateFields([newChef.name])) return;
          const chefData = { name: newChef.name, image: newChef.image };
          const chefResponse = await createChef(chefData);
          chefResponse.ok
            ? alert("Chef created successfully")
            : alert("Failed to create chef");
          break;

        case 2: // Dishes
          if (
            validateFields([
              newDish.name,
              newDish.image,
              newDish.description,
              newDish.price,
              newDish.icons,
              newDish.category,
            ])
          )
            return;
          const dishData = {
            name: newDish.name,
            image: newDish.image,
            category: newDish.category,
            description: newDish.description,
            icons: newDish.icons,
            price: Number(newDish.price),
          };
          console.log(dishData);
          const dishResponse = await createDish(dishData);
          dishResponse.ok
            ? alert("Dish created successfully")
            : alert("Failed to create dish");
          break;
        default:
          break;
      }
      fetchData(activeTab);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    inputType: string
  ) => {
    const { name, value } = event.target;
    switch (inputType) {
      case "chef":
        setNewChef((prevChef) => ({
          ...prevChef,
          [name]: value,
        }));
        break;
      case "dish":
        setNewDish((prevDish) => ({
          ...prevDish,
          [name]: value,
        }));
        break;
      default:
        setNewRestaurant((prevRestaurant) => ({
          ...prevRestaurant,
          [name]: value,
        }));
        break;
    }
  };

  const handleUpdateClick = async (isChef: boolean, isDish: boolean) => {
    try {
      if (isChef) {
        // Update chef
        if (!selectedChef.name || !selectedChef.image) {
          alert("Please fill in all required fields.");
          return;
        }
        const token = localStorage.getItem("token");
        const updatedChefData = {
          name: selectedChef.name,
          image: selectedChef.image,
        };
        const chefResponse = await fetch(
          `${API_BASE_URL}/admins/chefs/${clickedDivId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedChefData),
          }
        );

        if (chefResponse.ok) {
          // Chef created successfully
          alert("Chef update successfully");
        } else {
          // Handle error response
          alert("Failed to update chef");
        }
      } else if (isDish) {
        // Update dish
        if (
          !selectedDish.image ||
          !selectedDish.name ||
          !selectedDish.description ||
          !selectedDish.price ||
          !selectedDish.category ||
          !selectedDish.icons
        ) {
          alert("Please fill in all required fields.");
          return;
        }

        const token = localStorage.getItem("token");

        const updatedDishData = {
          image: selectedDish.image,
          name: selectedDish.name,
          description: selectedDish.description,
          price: selectedDish.price,
          category: selectedDish.category,
          icons: selectedDish.icons,
        };
        const restaurantResponse = await fetch(
          `${API_BASE_URL}/admins/dishes/${clickedDivId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedDishData),
          }
        );

        if (restaurantResponse.ok) {
          alert("Dish update successfully");
        } else {
          alert("Failed to update dish");
        }
      } else {
        // Update restaurant
        if (
          !selectedRestaurant.image ||
          !selectedRestaurant.name ||
          !selectedRestaurant.chefId.id ||
          !selectedRestaurant.rate
        ) {
          alert("Please fill in all required fields.");
          return;
        }

        const token = localStorage.getItem("token");
        console.log(token);

        const updatedRestaurantData = {
          image: selectedRestaurant.image,
          name: selectedRestaurant.name,
          chefId: selectedRestaurant.chefId.id,
          rate: selectedRestaurant.rate,
          dishes: selectedRestaurant.dishes,
        };
        console.log(updatedRestaurantData);
        const restaurantResponse = await fetch(
          `${API_BASE_URL}/admins/restaurants/${clickedDivId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedRestaurantData),
          }
        );

        if (restaurantResponse.ok) {
          alert("Restaurant update successfully");
        } else {
          alert("Failed to update restaurant");
        }
      }
      fetchData(activeTab);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      switch (activeTab) {
        case 0: // Restaurants
          if (!clickedDivId) {
            console.error("No restaurant selected for deletion.");
            return;
          }

          const token = localStorage.getItem("token");

          if (!token) {
            console.error("No token found.");
            return;
          }

          const isRestaurantDeleted = await deleteRestaurant(
            clickedDivId,
            token
          );

          if (isRestaurantDeleted) {
            alert("Restaurant deleted successfully");
            setSelectedRestaurant(generateInitialRestaurant());
            fetchData(activeTab);
          } else {
            alert("Failed to delete restaurant");
          }
          break;
        case 1: // Chefs
          if (!clickedDivId) {
            console.error("No chef selected for deletion.");
            return;
          }

          const token1 = localStorage.getItem("token");

          if (!token1) {
            console.error("No token found.");
            return;
          }

          const isChefDeleted = await deleteChef(clickedDivId, token1);

          if (isChefDeleted) {
            alert("Chef deleted successfully");
            setSelectedChef(generateInitialChef());
            fetchData(activeTab);
          } else {
            alert("Failed to delete chef");
          }
          break;
        case 2: // Dishes
          if (!clickedDivId) {
            console.error("No dish selected for deletion.");
            return;
          }

          const token2 = localStorage.getItem("token");

          if (!token2) {
            console.error("No token found.");
            return;
          }

          const isDishDeleted = await deleteDish(clickedDivId, token2);

          if (isDishDeleted) {
            alert("Dish deleted successfully");
            setSelectedDish(generateInitialDish());
            fetchData(activeTab);
          } else {
            alert("Failed to delete dish");
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      <div className="container">
        <CardListContainer
          activeTab={activeTab}
          restaurants={restaurants}
          chefs={chefs}
          dishes={dishes}
          isCardClicked={isCardClicked}
          handleCardClick={handleCardClick}
        />
        <div className="signOut">
          <SignOutButton></SignOutButton>
        </div>
        <div className="actionsContainer">
          {role === "superAdmin" && (
            <>
              <div className="boxesContainer">
                {activeTab === 0 && (
                  <>
                    <NewRestaurantForm
                      newRestaurant={newRestaurant}
                      allChefs={allChefs}
                      allDishes={allDishes}
                      handleInputChange={handleInputChange}
                      handleNewClick={handleNewClick}
                      setNewRestaurant={setNewRestaurant}
                    />
                    <UpdateRestaurantForm
                      selectedRestaurant={selectedRestaurant}
                      allChefs={allChefs}
                      allDishes={allDishes}
                      allDishes2={allDishes2}
                      handleUpdateClick={handleUpdateClick}
                      setSelectedRestaurant={setSelectedRestaurant}
                      clickedDivId={clickedDivId}
                    />
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    <NewChefForm
                      newChef={newChef}
                      handleInputChange={handleInputChange}
                      handleNewClick={handleNewClick}
                    />
                    <UpdateChefForm
                      selectedChef={selectedChef}
                      handleUpdateClick={handleUpdateClick}
                      setSelectedChef={setSelectedChef}
                    />
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <NewDishForm
                      newDish={newDish}
                      handleInputChange={handleInputChange}
                      handleNewClick={handleNewClick}
                      setNewDish={setNewDish}
                    />
                    <UpdateDishForm
                      selectedDish={selectedDish}
                      icons={icons}
                      handleUpdateClick={handleUpdateClick}
                      setSelectedDish={setSelectedDish}
                      handleInputChange={handleInputChange}
                      newDish={newDish}
                    />
                  </>
                )}
              </div>

              <div className="buttonContainer">
                <DeleteButton
                  activeTab={activeTab}
                  handleDeleteClick={handleDeleteClick}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
