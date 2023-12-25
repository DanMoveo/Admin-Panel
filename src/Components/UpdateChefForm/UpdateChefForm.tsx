import React from "react";
import { Chef } from "../../models/Restaurant.interfaces";

interface UpdateChefFormProps {
  selectedChef: Chef;
  handleUpdateClick: (param1: boolean, param2: boolean) => void;
  setSelectedChef: React.Dispatch<React.SetStateAction<Chef>>;
}

const UpdateChefForm: React.FC<UpdateChefFormProps> = ({
  selectedChef,
  handleUpdateClick,
  setSelectedChef,
}) => {
  return (
    <>
      <div className="actionContainer">
        <span className="actionTitel">Update the select chef</span>
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
        <button onClick={() => handleUpdateClick(true, false)}>Update</button>
      </div>
    </>
  );
};

export default UpdateChefForm;
