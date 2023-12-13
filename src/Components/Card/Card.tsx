import React from "react";
import "./Card.scss";

interface CardProps {
  data: any;
  isChef?: boolean;
  isDish?: boolean;
  isRestaurant?: boolean;
  isClicked: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  data,
  isChef = false,
  isDish = false,
  isRestaurant = false,
  isClicked,
  onClick,
}) => {
  const renderText = (label: string, value: any) => (
    <span key={label} className="cardText">
      {label}: {value}
    </span>
  );

  const chefLabels = ["name", "image"];
  const dishLabels = [
    "name",
    "image",
    "category",
    "description",
    "icons",
    "price",
  ];
  const restaurantLabels = ["name", "image", "chef", "rate"];

  const labelsToRender = isChef
    ? chefLabels
    : isDish
    ? dishLabels
    : isRestaurant
    ? restaurantLabels
    : ["name", "image"];

  return (
    <div
      className={`cardContainer ${isClicked ? "clicked" : ""}`}
      onClick={onClick}
    >
      {labelsToRender.map((label) =>
        renderText(
          label,
          (isDish || isRestaurant) && label === "chef"
            ? data.chefId
              ? data.chefId.name
              : "Unknown Chef"
            : data[label]
        )
      )}
    </div>
  );
};

export default Card;
