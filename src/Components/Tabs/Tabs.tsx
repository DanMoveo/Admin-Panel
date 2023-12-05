// Tabs.tsx

import React from "react";
import "./Tabs.scss";

interface TabsProps {
  tabs: string[];
  activeTab: number;
  onTabClick: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <ul className="tabList">
      {tabs.map((tab, index) => (
        <li
          key={index}
          className={`tabItem ${index === activeTab ? "active" : ""}`}
          onClick={() => onTabClick(index)}
        >
          {tab}
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
