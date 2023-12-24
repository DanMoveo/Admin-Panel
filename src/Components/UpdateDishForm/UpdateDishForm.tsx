import React from "react";
import { Dish } from "../../models/Restaurant.interfaces";

interface UpdateDishFormProps {
  selectedDish: Dish;
  icons: string[];
  handleUpdateClick: (param1: boolean, param2: boolean) => void;
  setSelectedDish: React.Dispatch<React.SetStateAction<Dish>>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: string
  ) => void;
  newDish: Dish;
}

const UpdateDishForm: React.FC<UpdateDishFormProps> = ({
  selectedDish,
  icons,
  handleUpdateClick,
  setSelectedDish,
  handleInputChange,
  newDish,
}) => {
  return (
    <>
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
                const updatedIcons = selectedDish.icons.includes(selectedIcon)
                  ? selectedDish.icons.filter((icon) => icon !== selectedIcon)
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
        <button onClick={() => handleUpdateClick(false, true)}>Update</button>
      </div>
    </>
  );
};

export default UpdateDishForm;
