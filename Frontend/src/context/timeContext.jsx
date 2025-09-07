import { createContext, useContext, useEffect , useState  } from "react";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const TimeContextProvider = ({ children }) => {
    const [timeEntries, setTimeEntries] = useState([]);

    const fetchTimeEntries = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/timelist`);
            setTimeEntries(response.data.response);
        } catch (error) {
            console.error("Error fetching time entries:", error);
        }
    };

    

    const timeDelete = async (id) => {

        try {
            if (!id) {
                return toast.error("Id undefine. reload page");
            }
            const response = await axios.delete(`${backendUrl}/api/timedelete`, { data: { id } });
            if (response.data.success) {
                setTimeEntries(prev => prev.filter(entry => entry._id !== id));
                toast.success("Successfully Deleted");
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete entry");
        }
    };

    useEffect(() => {
        fetchTimeEntries();
    }, [])

    const value = { timeEntries, setTimeEntries, fetchTimeEntries, timeDelete , axios , toast};
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

}

export const useTimeContext = () => {
    return useContext(AppContext);
}