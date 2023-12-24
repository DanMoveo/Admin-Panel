import React from "react";
import { Restaurant } from "../../models/Restaurant.interfaces";

interface NewRestaurantFormProps {
  newRestaurant: {
    image: string;
    name: string;
    chefId: {
      id: string;
    };
    rate: number;
    dishes: string[];
  };
  allChefs: { id: string; name: string }[];
  allDishes: { id: string; name: string }[];
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: string
  ) => void;
  handleNewClick: () => void;
  setNewRestaurant: React.Dispatch<React.SetStateAction<Restaurant>>;
}

const NewRestaurantForm: React.FC<NewRestaurantFormProps> = ({
  newRestaurant,
  allChefs,
  allDishes,
  setNewRestaurant,
  handleInputChange,
  handleNewClick,
}) => {
  return (
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
                if (newRestaurant.dishes.includes(selectedDishId)) {
                  setNewRestaurant((prevRestaurant) => ({
                    ...prevRestaurant,
                    dishes: prevRestaurant.dishes.filter(
                      (id) => id !== selectedDishId
                    ),
                  }));
                } else {
                  setNewRestaurant((prevRestaurant) => ({
                    ...prevRestaurant,
                    dishes: [...prevRestaurant.dishes, selectedDishId],
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
    </>
  );
};

export default NewRestaurantForm;
