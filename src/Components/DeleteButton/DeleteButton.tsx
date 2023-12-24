import React from "react";
import "./DeleteButton.scss";

interface DeleteButtonProps {
  activeTab: number;
  handleDeleteClick: (activeTab: number) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  activeTab,
  handleDeleteClick,
}) => {
  return (
    <button
      className="deleteButton"
      onClick={() => handleDeleteClick(activeTab)}
    >
      Delete
    </button>
  );
};

export default DeleteButton;
