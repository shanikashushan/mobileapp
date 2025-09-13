import React, { createContext, useState, useContext } from "react";

//สร้าง context
const AuthContext = createContext();

//สร้าง provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState(null);

    //สร้าง function สำหรับ login
    const login = (email, password) => {
    setUser(email);
    setPassword(password);
    console. log( "context login =>", user, password);
};

return (
    <AuthContext.Provider value={{ user, password, login}}>
        {children}  
    </AuthContext.Provider>
    );

};


export const useAuth = () => {
return useContext(AuthContext);
};