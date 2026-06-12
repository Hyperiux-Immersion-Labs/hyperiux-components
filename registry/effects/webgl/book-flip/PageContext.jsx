'use client'
import { createContext, useContext, useState } from"react";

const PageContext = createContext();

export const PageProvider = ({ children }) => {
 const [page, setPage] = useState(0);

 return (
 <PageContext.Provider value={{ page, setPage }}>
 {children}
 </PageContext.Provider>
 );
};

export const usePage = () => {
 const context = useContext(PageContext);
 if (!context) {
 throw new Error("usePage must be used within PageProvider");
 }
 return context;
};
