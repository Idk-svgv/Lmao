import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  Backpack, 
  Mountain, 
  Users, 
  Crown, 
  BookOpen, 
  Target, 
  Trophy 
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/character", icon: User, label: "Character" },
    { path: "/inventory", icon: Backpack, label: "Inventory" },
    { path: "/dungeons", icon: Mountain, label: "Dungeons" },
    { path: "/shadow-army", icon: Crown, label: "Shadow Army" },
    { path: "/guild", icon: Users, label: "Guild" },
    { path: "/story", icon: BookOpen, label: "Story" },
    { path: "/quests", icon: Target, label: "Quests" },
    { path: "/rankings", icon: Trophy, label: "Rankings" }
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-400">Solo Leveling</h1>
        <p className="text-gray-400 text-sm mt-1">Shadow Monarch</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors ${
                isActive ? "bg-purple-600 text-white border-r-2 border-purple-400" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;