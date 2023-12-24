// CardListContainer.tsx

import React from "react";
import { Restaurant, Chef, Dish } from "../../models/Restaurant.interfaces";
import Card from "../Card/Card";
import "./CardList.scss";

interface CardListContainerProps {
  activeTab: number;
  restaurants: Restaurant[];
  chefs: Chef[];
  dishes: Dish[];
  isCardClicked: (id: string, isChef: boolean, isDish: boolean) => boolean;
  handleCardClick: (item: Restaurant | Chef | Dish) => void;
}

const CardListContainer: React.FC<CardListContainerProps> = ({
  activeTab,
  restaurants,
  chefs,
  dishes,
  isCardClicked,
  handleCardClick,
}) => {
  return (
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
  );
};

export default CardListContainer;
