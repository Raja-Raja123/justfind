import React from "react";

import SearchHeader from "@/components/search/SearchHeader";
import Footer from "@/components/layout/Footer";
import SideButtons from "@/components/layout/SideButton";



const layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SearchHeader />

      <main className="flex-1">
        {/* SideButtons shown across this route segment */}
        <SideButtons />

      
        {children}
      </main>

     
    </div>
  );
};

export default layout;
