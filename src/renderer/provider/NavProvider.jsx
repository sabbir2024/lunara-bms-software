import { createContext, useContext, useState } from "react";

const NavContext = createContext(null);

export const NavProvider = ({ children }) => {
    const [newCreate, setNewCreate] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleteitem, setDeleteitem] = useState(false);
    const [printing, setPrinting] = useState(false);



    const navInfo = {
        newCreate,
        setNewCreate,
        editing,
        setEditing,
        deleteitem,
        setDeleteitem,
        setPrinting,
        printing
    };

    return <NavContext.Provider value={navInfo}>{children}</NavContext.Provider>;
};

export default NavProvider;
// eslint-disable-next-line react-refresh/only-export-components
export const useNav = () => useContext(NavContext);
