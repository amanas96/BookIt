import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const SearchContext = createContext({
    searchTerm: "",
    setSearchTerm: () => { },
});
export const useSearch = () => useContext(SearchContext);
export const SearchProvider = ({ children, }) => {
    const [searchTerm, setSearchTerm] = useState("");
    return (_jsx(SearchContext.Provider, { value: { searchTerm, setSearchTerm }, children: children }));
};
