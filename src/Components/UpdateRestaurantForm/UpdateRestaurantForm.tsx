import React from "react";
import { Chef, Dish, Restaurant2 } from "../../models/Restaurant.interfaces";

interface UpdateRestaurantFormProps {
  selectedRestaurant: Restaurant2;
  allChefs: Chef[];
  allDishes: Dish[];
  allDishes2: Dish[];
  handleUpdateClick: (param1: boolean, param2: boolean) => void;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<Restaurant2>>;
  clickedDivId: string | null;
  selectedDishesValues: string[];
  setSelectedDishesValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const UpdateRestaurantForm: React.FC<UpdateRestaurantFormProps> = ({
  selectedRestaurant,
  allChefs,
  allDishes,
  handleUpdateClick,
  setSelectedRestaurant,
  clickedDivId,
  allDishes2,
  selectedDishesValues,
  setSelectedDishesValues,
}) => {
  return (
    <>
      <div className="actionContainer">
        <span className="actionTitle">Update the selected restaurant</span>
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
              value={[
                ...selectedRestaurant.dishes.map((dish) => dish._id),
                ...selectedDishesValues,
              ]}
              onChange={(e) => {
                const newValue = e.target.value;
                if (selectedDishesValues.includes(newValue)) {
                  setSelectedDishesValues((prevValues) =>
                    prevValues.filter((value) => value !== newValue)
                  );
                } else {
                  setSelectedDishesValues((prevValues) => [
                    ...prevValues,
                    newValue,
                  ]);
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
            {clickedDivId && <span>Dishes of the restaurant:</span>}
            {clickedDivId && (
              <select className="custom-select" id="dishesSelect" multiple>
                {allDishes2.map((dish, index) => (
                  <option key={index} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button onClick={() => handleUpdateClick(false, false)}>Update</button>
      </div>
    </>
  );
};

export default UpdateRestaurantForm;
