import React from "react";
import { Routes } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ChatRoutes } from "./ChatRoutes";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {PublicRoutes}
      {ChatRoutes}
    </Routes>
  );
};
