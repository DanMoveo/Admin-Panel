import React from "react";

interface NewChefFormProps {
  newChef: {
    name: string;
    image: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  handleNewClick: () => void;
}

const NewChefForm: React.FC<NewChefFormProps> = ({
  newChef,
  handleInputChange,
  handleNewClick,
}) => {
  return (
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
  );
};

export default NewChefForm;
