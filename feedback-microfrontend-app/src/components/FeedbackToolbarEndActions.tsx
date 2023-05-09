import React from "react";
import EditIcon from "../../public/images/edit.svg";
import HeartIcon from "../../public/images/heart.svg";
import BellIcon from "../../public/images/bell.svg";

type Props = {};

const FeedbackToolbarEndActions: React.FC<Props> = (props) => {
  const handleEditClick = (e: React.KeyboardEvent | React.MouseEvent): void => {
    e.preventDefault();

    console.log("Edit Click:", e);
  };

  const handleHeartClick = (
    e: React.KeyboardEvent | React.MouseEvent
  ): void => {
    e.preventDefault();

    console.log("Heart Click:", e);
  };

  const handleBellClick = (e: React.KeyboardEvent | React.MouseEvent): void => {
    e.preventDefault();

    console.log("Bell Click:", e);
  };

  return (
    <ul className="flex items-center gap-2.5">
      <li>
        <img
          className="h-[24px] cursor-pointer"
          src={EditIcon}
          alt="heart"
          height={18}
          width={18}
          tabIndex={0}
          onClick={(e) => handleEditClick(e)}
          onKeyDown={(e) => e.key === "Enter" && handleEditClick(e)}
        />
      </li>
      <li>
        <img
          className="h-[24px] cursor-pointer"
          src={HeartIcon}
          alt="heart"
          height={24}
          width={24}
          tabIndex={0}
          onClick={(e) => handleHeartClick(e)}
          onKeyDown={(e) => e.key === "Enter" && handleHeartClick(e)}
        />
      </li>
      <li>
        <img
          className="h-[24px] cursor-pointer"
          src={BellIcon}
          alt="bell"
          height={24}
          width={24}
          tabIndex={0}
          onClick={(e) => handleBellClick(e)}
          onKeyDown={(e) => e.key === "Enter" && handleBellClick(e)}
        />
      </li>
    </ul>
  );
};

export default FeedbackToolbarEndActions;
