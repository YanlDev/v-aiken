import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <StatusBar />
    </div>
  );
};

export default Layout;
