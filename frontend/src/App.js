import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Character from "./pages/Character";
import Inventory from "./pages/Inventory";
import Dungeons from "./pages/Dungeons";
import ShadowArmy from "./pages/ShadowArmy";
import Guild from "./pages/Guild";
import Story from "./pages/Story";
import Quests from "./pages/Quests";
import Rankings from "./pages/Rankings";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App bg-gray-900 min-h-screen">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="character" element={<Character />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="dungeons" element={<Dungeons />} />
              <Route path="shadow-army" element={<ShadowArmy />} />
              <Route path="guild" element={<Guild />} />
              <Route path="story" element={<Story />} />
              <Route path="quests" element={<Quests />} />
              <Route path="rankings" element={<Rankings />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;