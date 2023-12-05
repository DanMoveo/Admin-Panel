import "./HomePage.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../../Components/Tabs/Tabs";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Define types

type Restaurant = {
  id: string;
  image: string;
  name: string;
  chefId: Chef;
  rate: number;
};

type Chef = {
  id: string;
  name: string;
  image: string;
};

type Dishes = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icons: string[];
};

function HomePage() {
  // State variables
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [dishes, setDishes] = useState<Dishes[]>([]);
  const tabs: string[] = ["Restaurants", "Chefs", "Dishes"];
  const { type } = useParams<{ type?: string }>();
  const initialActiveTab = type ? tabs.indexOf(type) : 0;
  const [activeTab, setActiveTab] = useState<number>(initialActiveTab);
  const [allChefs, setAllChefs] = useState<Chef[]>([]);

  const [clickedDivId, setClickedDivId] = useState<string | null>(null);

  const [newRestaurant, setNewRestaurant] = useState<Restaurant>({
    id: "",
    image: "",
    name: "",
    chefId: {
      id: "",
      name: "",
      image: "",
    },
    rate: 0,
  });

  const [newChef, setNewChef] = useState<Chef>({
    id: "",
    name: "",
    image: "",
  });

  const [selectedRestaurant, setselectedRestaurant] = useState<Restaurant>({
    id: "",
    image: "",
    name: "",
    chefId: {
      id: "",
      name: "",
      image: "",
    },
    rate: 0,
  });

  const [selectedChef, setSelectedChef] = useState<Chef>({
    id: "",
    name: "",
    image: "",
  });

  const [selectedDish, setSelectedDish] = useState<Dishes>({
    id: "",
    image: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    icons: [],
  });

  // Fetch data and handle tab changes
  useEffect(() => {
    async function fetchChefs() {
      try {
        const response = await axios.get<Chef[]>(`${API_BASE_URL}/chefs/`);
        setAllChefs(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchChefs();
    fetchData(activeTab);
  }, [activeTab]);

  async function fetchData(tabIndex: number) {
    try {
      let response;
      switch (tabIndex) {
        case 0: // Restaurants
          response = await axios.get<Restaurant[]>(
            `${API_BASE_URL}/restaurants/`
          );
          setRestaurants(response.data);
          break;
        case 1: // Chefs
          response = await axios.get<Chef[]>(`${API_BASE_URL}/chefs/`);
          setChefs(response.data);
          console.log(response.data)
          break;
        case 2: // Dishes
          response = await axios.get<Dishes[]>(`${API_BASE_URL}/dishes/`);
          setDishes(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Event handlers
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  function handleCardClick(item: Restaurant | Chef | Dishes) {
    setClickedDivId(item.id);
    if ("chefId" in item) {
      // It's a restaurant
      setselectedRestaurant(item);
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
      switch (activeTab) {
        case 0: // Restaurants
          if (
            !newRestaurant.image ||
            !newRestaurant.name ||
            !newRestaurant.chefId.id ||
            !newRestaurant.rate
          ) {
            alert("Please fill in all required fields.");
            return;
          }

          const restaurantData = {
            image: newRestaurant.image,
            name: newRestaurant.name,
            chefId: newRestaurant.chefId.id,
            rate: newRestaurant.rate,
          };

          const token = localStorage.getItem("token") as string;
          console.log(token);
          const restaurantResponse = await fetch(
            "http://localhost:5000/admins/restaurants",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(restaurantData),
            }
          );

          if (restaurantResponse.ok) {
            // Restaurant created successfully
            alert("Restaurant created successfully");
          } else {
            // Handle error response
            alert("Failed to create restaurant");
          }

          break;
        case 1: // Chefs
          if (!newChef.name) {
            alert("Please fill in all required fields.");
            return;
          }
          // const chefResponse = await axios.post(`${API_BASE_URL}/chefs/`, {
          //   name: newChef.name,
          // });
          // console.log("Response from server (Chef):", chefResponse.data);
          // break;

          const chefData = { name: newChef.name, image: newChef.image };
          const token2 = localStorage.getItem("token") as string;
          console.log(token2);
          const chefResponse = await fetch(
            "http://localhost:5000/admins/chefs",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token2}`,
              },
              body: JSON.stringify(chefData),
            }
          );
          console.log(chefResponse);

          if (chefResponse.ok) {
            // Chef created successfully
            alert("Restaurant created successfully");
          } else {
            // Handle error response
            alert("Failed to create chef");
          }

          break;

        case 2: // Dishes
          // Implement logic to send a POST request to create a new dish
          break;
        default:
          break;
      }

      // After the POST request is successful, you can fetch updated data if needed
      fetchData(activeTab);
    } catch (error) {
      console.error(error);
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputType: string
  ) => {
    const { name, value } = event.target;
    if (inputType === "chef") {
      // Handle chef input changes
      setNewChef((prevChef) => ({
        ...prevChef,
        [name]: value,
      }));

      console.log(newChef);
    } else {
      // Handle other input changes
      setNewRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        [name]: value,
      }));
    }
  };

  async function handleUpdateClick(isChef: boolean, isDish: boolean) {
    try {
      let selectedId = clickedDivId;

      if (isChef) {
        // Update chef
        if (!selectedChef.name ||
          !selectedChef.image
          ) {
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
          !selectedDish.category
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        await axios.put(`${API_BASE_URL}/dishes/dish?id=${selectedId}`, {
          image: selectedDish.image,
          name: selectedDish.name,
          description: selectedDish.description,
          price: selectedDish.price,
          category: selectedDish.category,
          icons: selectedDish.icons,
        });
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
        };

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
          // Restaurant created successfully
          alert("Restaurant update successfully");
        } else {
          // Handle error response
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
          console.log(token);
          const restaurantResponse = await fetch(
            `${API_BASE_URL}/admins/restaurants/${clickedDivId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (restaurantResponse.ok) {
            // Restaurant deleted successfully
            alert("Restaurant deleted successfully");
          } else {
            // Handle error response
            alert("Failed to deleted restaurant");
          }

          setselectedRestaurant({
            id: "",
            image: "",
            name: "",
            chefId: {
              id: "",
              name: "",
              image: "",
            },
            rate: 0,
          });
          fetchData(activeTab);
          break;
        case 1: // Chefs
          if (!clickedDivId) {
            console.error("No chef selected for deletion.");
            return;
          }

          const token1 = localStorage.getItem("token");
          console.log(token1);
          const chefResponse = await fetch(
            `${API_BASE_URL}/admins/chefs/${clickedDivId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token1}`,
              },
            }
          );

          if (chefResponse.ok) {
            //  Chef deleted successfully
            alert("Restaurant deleted successfully");
          } else {
            // Handle error response
            alert("Failed to deleted chef");
          }

          setSelectedChef({
            id: "",
            name: "",
            image: "",
          });
          fetchData(activeTab);
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
                <div
                  key={restaurant.id}
                  className={`cardContainer ${
                    isCardClicked(restaurant.id, false, false) ? "clicked" : ""
                  }`}
                  onClick={() => handleCardClick(restaurant)}
                >
                  <span className="cardText">image: {restaurant.image}</span>
                  <span className="cardText">name: {restaurant.name}</span>
                  <span className="cardText">
                    chef:{" "}
                    {restaurant.chefId
                      ? restaurant.chefId.name
                      : "Unknown Chef"}
                  </span>
                  <span className="cardText">rate: {restaurant.rate}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 1 && (
            <div>
              {chefs.map((chef) => (
                <div
                  key={chef.id}
                  className={`cardContainer ${
                    isCardClicked(chef.id, true, false) ? "clicked" : ""
                  }`}
                  onClick={() => handleCardClick(chef)}
                >
                  <span className="cardText">name: {chef.name}</span>
                  <span className="cardText">image: {chef.image}</span>

                </div>
              ))}
            </div>
          )}
          {activeTab === 2 && (
            <div>
              {dishes.map((dish) => (
                <div
                  key={dish.id}
                  className={`cardContainer ${
                    isCardClicked(dish.id, false, true) ? "clicked" : ""
                  }`}
                  onClick={() => handleCardClick(dish)}
                >
                  <span className="cardText">name: {dish.name}</span>
                  <span className="cardText">category: {dish.category}</span>
                  <span className="cardText">
                    description: {dish.description}
                  </span>
                  <span className="cardText">icons: {dish.icons}</span>
                  <span className="cardText">image: {dish.image}</span>
                  <span className="cardText">price: {dish.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="actionsContainer">
          <div className="boxesContainer">
            {activeTab === 0 && (
              <>
                <div className="actionContainer">
                  <span className="actionTitel">NEW</span>
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

                  <button onClick={() => handleNewClick()}>New</button>
                </div>

                <div className="actionContainer">
                  <span className="actionTitel">Update</span>
                  <input
                    type="text"
                    name="image"
                    placeholder="Image"
                    value={selectedRestaurant?.image || ""}
                    onChange={(e) =>
                      setselectedRestaurant({
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
                      setselectedRestaurant({
                        ...selectedRestaurant,
                        name: e.target.value,
                      })
                    }
                  />
                  <select
                    name="chefId"
                    value={selectedRestaurant.chefId.id}
                    onChange={(e) =>
                      setselectedRestaurant((prevRestaurant) => ({
                        ...prevRestaurant,
                        chefId: {
                          ...prevRestaurant.chefId,
                          id: e.target.value,
                          name:
                            allChefs.find((chef) => chef.id === e.target.value)
                              ?.name || "",
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
                      setselectedRestaurant((prevRestaurant) => ({
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

                  <button onClick={() => handleUpdateClick(false, false)}>
                    Update
                  </button>
                </div>
              </>
            )}

            {activeTab === 1 && (
              <>
                <div className="actionContainer">
                  <span className="actionTitel">NEW</span>
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
                  <button onClick={() => handleNewClick()}>New</button>
                </div>
                <div className="actionContainer">
                  <span className="actionTitel">Update</span>
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
                  <button onClick={() => handleUpdateClick(true, false)}>
                    Update
                  </button>
                </div>
              </>
            )}

            {activeTab === 2 && (
              <>
                <div className="actionContainer">
                  <span className="actionTitel">NEW</span>
                  <input type="text" name="category" placeholder="category" />
                  <input
                    type="text"
                    name="description"
                    placeholder="description"
                  />
                  <input type="text" name="price" placeholder="price" />
                  <input type="text" name="image" placeholder="Image" />
                  <input type="text" name="name" placeholder="Name" />
                  <input type="text" name="chefId" placeholder="Chef ID" />
                  <input type="number" name="rate" placeholder="Rate" />
                  <button onClick={() => handleNewClick()}>New</button>
                </div>
                <div className="actionContainer">
                  <span className="actionTitel">Update</span>
                  <input
                    type="text"
                    name="category"
                    placeholder="category"
                    value={selectedDish?.category || ""}
                    onChange={(e) =>
                      setSelectedDish({
                        ...selectedDish,
                        category: e.target.value,
                      })
                    }
                  />
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
                  <input type="text" name="chefId" placeholder="Chef ID" />
                  <input type="number" name="rate" placeholder="Rate" />
                  <button onClick={() => handleUpdateClick(false, true)}>
                    Update
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="deleteButton" onClick={() => handleDeleteClick()}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
