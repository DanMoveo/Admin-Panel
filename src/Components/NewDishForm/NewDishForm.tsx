import React from "react";
import { Dish } from "../../models/Restaurant.interfaces";

interface NewDishFormProps {
  newDish: {
    name: string;
    image: string;
    category: string;
    description: string;
    price: number;
    icons: string[];
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: string
  ) => void;
  handleNewClick: () => void;
  setNewDish: React.Dispatch<React.SetStateAction<Dish>>;
}

const NewDishForm: React.FC<NewDishFormProps> = ({
  newDish,
  handleInputChange,
  handleNewClick,
  setNewDish,
}) => {
  return (
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
            value={newDish.price.toString()}
            onChange={(e) => handleInputChange(e, "dish")}
          />
          <select
            value={newDish.icons}
            onChange={(e) => {
              const selectedIcon = e.target.value;
              const updatedIcons = newDish.icons.includes(selectedIcon)
                ? newDish.icons.filter((icon) => icon !== selectedIcon)
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
  );
};

export default NewDishForm;
