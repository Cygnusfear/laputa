import React from "react";

import "@/styles/layout.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout h-screen min-h-screen text-white antialiased">
      {children}
    </div>
  );
};

export default RootLayout;
