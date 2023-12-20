import "./HomePage.scss";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tabs from "../../Components/Tabs/Tabs";
import axios from "axios";
import Card from "../../Components/Card/Card";
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

  async function fetchData(tabIndex: number) {
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
  }

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  async function handleCardClick(item: Restaurant | Chef | Dish) {
    setClickedDivId(item.id);
    if ("chefId" in item) {
      // It's a restaurant
      setSelectedRestaurant(item);
      const response2 = await axios.get<Restaurant>(
        `${API_BASE_URL}/restaurants/restaurant/${item.id}`
      );
      const parsedRes = JSON.parse(JSON.stringify(response2.data.dishes));
      setAllDishes2(parsedRes);
    } else if ("icons" in item) {
      // It's a dish
      setSelectedDish(item);
    } else {
      // It's a chef
      setSelectedChef(item);
    }
  }

  function isCardClicked(id: string, isChef: boolean, isDish: boolean) {
    if (isChef) {
      return id === clickedDivId;
    } else if (isDish) {
      return id === clickedDivId;
    } else {
      return id === clickedDivId;
    }
  }

  async function handleNewClick() {
    try {
      const validateFields = (fields: any[]) => {
        if (fields.some((field) => !field)) {
          alert("Please fill in all required fields.");
          return true;
        }
        return false;
      };

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
          console.log(restaurantData);
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
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    inputType: string
  ) => {
    const { name, value } = event.target;

    switch (inputType) {
      case "chef":
        // Handle chef input changes
        setNewChef((prevChef) => ({
          ...prevChef,
          [name]: value,
        }));
        break;
      case "dish":
        // Handle dish input changes
        setNewDish((prevDish) => ({
          ...prevDish,
          [name]: value,
        }));
        break;
      default:
        // Handle other input changes
        setNewRestaurant((prevRestaurant) => ({
          ...prevRestaurant,
          [name]: value,
        }));
        break;
    }
  };

  async function handleUpdateClick(isChef: boolean, isDish: boolean) {
    try {
      if (isChef) {
        // Update chef
        if (!selectedChef.name || !selectedChef.image) {
          alert("Please fill in all required fields.");
          return;
        }

        const token = localStorage.getItem("token");
        console.log(token);

        const updatedChefData = {
          name: selectedChef.name,
          image: selectedChef.image,
        };
        console.log(updatedChefData);

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
  }

  async function handleDeleteClick() {
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
          // Implement logic to send a DELETE request to delete a dish
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />

      <div className="container">
        <div className="listContainer">
          {activeTab === 0 && (
            <div>
              {restaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  data={restaurant}
                  isRestaurant
                  isClicked={isCardClicked(restaurant.id, false, false)}
                  onClick={() => handleCardClick(restaurant)}
                />
              ))}
            </div>
          )}
          {activeTab === 1 && (
            <div>
              {chefs.map((chef) => (
                <Card
                  key={chef.id}
                  data={chef}
                  isChef
                  isClicked={isCardClicked(chef.id, true, false)}
                  onClick={() => handleCardClick(chef)}
                />
              ))}
            </div>
          )}
          {activeTab === 2 && (
            <div>
              {dishes.map((dish) => (
                <Card
                  key={dish.id}
                  data={dish}
                  isDish
                  isClicked={isCardClicked(dish.id, false, true)}
                  onClick={() => handleCardClick(dish)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="signOut">
          <SignOutButton></SignOutButton>
        </div>
        <div className="actionsContainer">
          {role === "superAdmin" && (
            <>
              <div className="boxesContainer">
                {activeTab === 0 && (
                  <>
                    <div className="actionContainer">
                      <span className="actionTitel">Add new restaurant</span>
                      <div className="newRestaurant">
                        <div className="textFieldsRestaurant">
                          <input
                            type="text"
                            name="image"
                            placeholder="Image"
                            value={newRestaurant.image}
                            onChange={(e) => handleInputChange(e, "restaurant")}
                          />
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newRestaurant.name}
                            onChange={(e) => handleInputChange(e, "restaurant")}
                          />
                          <select
                            name="chefId"
                            value={newRestaurant.chefId.id}
                            onChange={(e) =>
                              setNewRestaurant((prevRestaurant) => ({
                                ...prevRestaurant,
                                chefId: {
                                  ...prevRestaurant.chefId,
                                  id: e.target.value,
                                },
                              }))
                            }
                          >
                            {newRestaurant.chefId.id ? null : (
                              <option value="">Select a Chef</option>
                            )}

                            {allChefs.map((chef) => (
                              <option key={chef.id} value={chef.id}>
                                {chef.name}
                              </option>
                            ))}
                          </select>

                          <select
                            name="rate"
                            value={newRestaurant.rate}
                            onChange={(e) =>
                              setNewRestaurant((prevRestaurant) => ({
                                ...prevRestaurant,
                                rate: parseInt(e.target.value),
                              }))
                            }
                          >
                            {newRestaurant.rate ? null : (
                              <option value="">Select a Rate</option>
                            )}
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                        <div className="dishesChoosen">
                          <span>Dishes:</span>
                          <select
                            className="custom-select"
                            name="dishId"
                            value={newRestaurant.dishes}
                            onChange={(e) => {
                              const selectedDishId = e.target.value;
                              if (
                                newRestaurant.dishes.includes(selectedDishId)
                              ) {
                                setNewRestaurant((prevRestaurant) => ({
                                  ...prevRestaurant,
                                  dishes: prevRestaurant.dishes.filter(
                                    (id) => id !== selectedDishId
                                  ),
                                }));
                              } else {
                                setNewRestaurant((prevRestaurant) => ({
                                  ...prevRestaurant,
                                  dishes: [
                                    ...prevRestaurant.dishes,
                                    selectedDishId,
                                  ],
                                }));
                              }
                            }}
                            multiple
                          >
                            {allDishes.map((dish) => (
                              <option key={dish.id} value={dish.id}>
                                {dish.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button onClick={() => handleNewClick()}>New</button>
                    </div>

                    <div className="actionContainer">
                      <span className="actionTitel">Update</span>
                      <div className="newRestaurant">
                        <div className="textFieldsRestaurant">
                          <input
                            type="text"
                            name="image"
                            placeholder="Image"
                            value={selectedRestaurant?.image || ""}
                            onChange={(e) =>
                              setSelectedRestaurant({
                                ...selectedRestaurant,
                                image: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={selectedRestaurant?.name || ""}
                            onChange={(e) =>
                              setSelectedRestaurant({
                                ...selectedRestaurant,
                                name: e.target.value,
                              })
                            }
                          />
                          <select
                            name="chefId"
                            value={selectedRestaurant.chefId.id}
                            onChange={(e) =>
                              setSelectedRestaurant((prevRestaurant) => ({
                                ...prevRestaurant,
                                chefId: {
                                  ...prevRestaurant.chefId,
                                  id: e.target.value,
                                  name:
                                    allChefs.find(
                                      (chef) => chef.id === e.target.value
                                    )?.name || "",
                                },
                              }))
                            }
                          >
                            <option value="">Select a Chef</option>
                            {allChefs.map((chef) => (
                              <option key={chef.id} value={chef.id}>
                                {chef.name}
                              </option>
                            ))}
                          </select>

                          <select
                            name="rate"
                            value={selectedRestaurant.rate.toString()}
                            onChange={(e) =>
                              setSelectedRestaurant((prevRestaurant) => ({
                                ...prevRestaurant,
                                rate: parseInt(e.target.value),
                              }))
                            }
                          >
                            {selectedRestaurant.rate ? null : (
                              <option value="">Select a Rate</option>
                            )}
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                        <div className="dishesChoosen">
                          <span>All dishes:</span>
                          <select
                            className="custom-select"
                            name="dishes"
                            value={selectedRestaurant.dishes}
                            onChange={(e) => {
                              const selectedDishId = e.target.value;
                              if (
                                selectedRestaurant.dishes.includes(
                                  selectedDishId
                                )
                              ) {
                                setSelectedRestaurant((prevRestaurant) => ({
                                  ...prevRestaurant,
                                  dishes: prevRestaurant.dishes.filter(
                                    (id) => id !== selectedDishId
                                  ),
                                }));
                              } else {
                                setSelectedRestaurant((prevRestaurant) => ({
                                  ...prevRestaurant,
                                  dishes: [
                                    ...prevRestaurant.dishes,
                                    selectedDishId,
                                  ],
                                }));
                              }
                            }}
                            multiple
                          >
                            {allDishes.map((dish) => (
                              <option key={dish.id} value={dish.id}>
                                {dish.name}
                              </option>
                            ))}
                          </select>
                          {clickedDivId && (
                            <span>Dishes of the restaurant:</span>
                          )}
                          {clickedDivId && (
                            <select
                              className="custom-select"
                              id="dishesSelect"
                              multiple
                            >
                              {allDishes2.map((dish) => (
                                <option key={dish.id} value={dish.id}>
                                  {dish.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleUpdateClick(false, false)}>
                        Update
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 1 && (
                  <>
                    <div className="actionContainer">
                      <div className="newRestaurant">
                        <div className="textFieldsRestaurant">
                          <span className="actionTitel">Add new chef</span>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newChef.name}
                            onChange={(e) => handleInputChange(e, "chef")}
                          />
                          <input
                            type="text"
                            name="image"
                            placeholder="Image"
                            value={newChef.image}
                            onChange={(e) => handleInputChange(e, "chef")}
                          />
                        </div>
                      </div>
                      <button onClick={() => handleNewClick()}>New</button>
                    </div>

                    <div className="actionContainer">
                      <span className="actionTitel">Update</span>
                      <div className="newRestaurant">
                        <div className="textFieldsRestaurant">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={selectedChef?.name || ""}
                            onChange={(e) =>
                              setSelectedChef({
                                ...selectedChef,
                                name: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            name="image"
                            placeholder="Image"
                            value={selectedChef?.image || ""}
                            onChange={(e) =>
                              setSelectedChef({
                                ...selectedChef,
                                image: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <button onClick={() => handleUpdateClick(true, false)}>
                        Update
                      </button>
                    </div>
                  </>
                )}

                {activeTab === 2 && (
                  <>
                    <div className="actionContainer">
                      <span className="actionTitel">Add new dish</span>
                      <div className="newRestaurant">
                        <div className="textFieldsRestaurant">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newDish.name}
                            onChange={(e) => handleInputChange(e, "dish")}
                          />
                          <input
                            type="text"
                            name="image"
                            placeholder="Image"
                            value={newDish.image}
                            onChange={(e) => handleInputChange(e, "dish")}
                          />
                          <select
                            name="category"
                            key="category"
                            placeholder="Image"
                            value={newDish.category}
                            onChange={(e) => handleInputChange(e, "dish")}
                          >
                            <option value="" disabled hidden>
                              {newDish.category ? "" : "Select a category"}
                            </option>{" "}
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                          </select>
                          <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newDish.description}
                            onChange={(e) => handleInputChange(e, "dish")}
                          />
                          <input
                            type="text"
                            name="price"
                            placeholder="Price"
                            value={newDish.price || ""}
                            onChange={(e) => handleInputChange(e, "dish")}
                          />
                          <select
                            value={newDish.icons}
                            onChange={(e) => {
                              const selectedIcon = e.target.value;
                              const updatedIcons = newDish.icons.includes(
                                selectedIcon
                              )
                                ? newDish.icons.filter(
                                    (icon) => icon !== selectedIcon
                                  )
                                : [...newDish.icons, selectedIcon];

                              setNewDish((prevDish) => ({
                                ...prevDish,
                                icons: updatedIcons,
                              }));
                            }}
                            multiple
                          >
                            <option value="spicy">Spicy</option>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                          </select>
                        </div>
                      </div>

                      <button onClick={() => handleNewClick()}>New</button>
                    </div>
                    <div className="actionContainer">
                      <span className="actionTitel">Update</span>
                      <div className="newRestaurant">
                        <div className="textFieldsRestaurant">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={selectedDish?.name || ""}
                            onChange={(e) =>
                              setSelectedDish({
                                ...selectedDish,
                                name: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            name="image"
                            placeholder="Image"
                            value={selectedDish?.image || ""}
                            onChange={(e) =>
                              setSelectedDish({
                                ...selectedDish,
                                description: e.target.value,
                              })
                            }
                          />
                          <select
                            name="category"
                            placeholder="Image"
                            value={selectedDish.category}
                            onChange={(e) => handleInputChange(e, "dish")}
                          >
                            <option value="" disabled hidden>
                              {newDish.category ? "" : "Select a category"}
                            </option>{" "}
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                          </select>
                          <input
                            type="text"
                            name="description"
                            placeholder="description"
                            value={selectedDish?.description || ""}
                            onChange={(e) =>
                              setSelectedDish({
                                ...selectedDish,
                                description: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            name="price"
                            placeholder="price"
                            value={selectedDish?.price || ""}
                            onChange={(e) =>
                              setSelectedDish({
                                ...selectedDish,
                                price: parseFloat(e.target.value),
                              })
                            }
                          />
                          <select
                            value={selectedDish.icons}
                            onChange={(e) => {
                              const selectedIcon = e.target.value;
                              const updatedIcons = selectedDish.icons.includes(
                                selectedIcon
                              )
                                ? selectedDish.icons.filter(
                                    (icon) => icon !== selectedIcon
                                  )
                                : [...selectedDish.icons, selectedIcon];

                              setSelectedDish((prevDish) => ({
                                ...prevDish,
                                icons: updatedIcons,
                              }));
                            }}
                            multiple
                          >
                            {icons.map((icon) => (
                              <option
                                key={icon}
                                value={icon}
                                selected={selectedDish.icons.includes(icon)}
                              >
                                {icon.charAt(0).toUpperCase() + icon.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button onClick={() => handleUpdateClick(false, true)}>
                        Update
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="buttonContainer">
                <button
                  className="deleteButton"
                  onClick={() => handleDeleteClick()}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
