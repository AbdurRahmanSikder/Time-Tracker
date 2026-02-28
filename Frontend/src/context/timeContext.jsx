import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const TimeContextProvider = ({ children }) => {
    const [timeEntries, setTimeEntries] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);
    const { user } = useAuth(); // Need to trigger fetch only when user exists

    const fetchMonths = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/months`);
            if (response.data.success) {
                const fetchedMonths = response.data.response;
                setMonths(fetchedMonths);
                // Auto-select the most recent month if available and nothing is selected
                if (fetchedMonths.length > 0 && !selectedMonth) {
                    setSelectedMonth(fetchedMonths[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching months:", error);
        }
    };

    const fetchTimeEntries = async (monthId) => {
        if (!monthId) return; // Don't fetch if no month is selected
        try {
            const response = await axios.get(`${backendUrl}/api/timelist?monthId=${monthId}`);
            if (response.data.success) {
                setTimeEntries(response.data.response);
            }
        } catch (error) {
            console.error("Error fetching time entries:", error);
        }
    };

    const timeDelete = async (id) => {
        try {
            if (!id) {
                return toast.error("Id undefined. reload page");
            }
            const response = await axios.delete(`${backendUrl}/api/timedelete`, { data: { id } });
            if (response.data.success) {
                setTimeEntries(prev => prev.filter(entry => entry.id !== id));
                toast.success("Successfully Deleted");
                // Re-fetch months in case this was the last entry of a month
                fetchMonths();
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete entry");
        }
    };

    const timeUpdate = async (id, updatedData) => {
        try {
            const response = await axios.put(`${backendUrl}/api/update`, { id, ...updatedData });
            if (response.data.success) {
                // If they changed the date to a different month, they will disappear from the current view.
                // Re-fetch to get the true current list and any new month dropdown updates.
                fetchMonths();
                if (selectedMonth) {
                    fetchTimeEntries(selectedMonth.id);
                }
                toast.success("Successfully Updated");
                setEditingEntry(null);
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update entry");
        }
    };

    useEffect(() => {
        if (user) {
            fetchMonths();
        } else {
            setTimeEntries([]); // Clear when logged out
            setMonths([]);
            setSelectedMonth(null);
        }
    }, [user]);

    // Fetch entries when the selected month changes
    useEffect(() => {
        if (selectedMonth) {
            fetchTimeEntries(selectedMonth.id);
        }
    }, [selectedMonth]);

    const value = { timeEntries, setTimeEntries, fetchTimeEntries, timeDelete, timeUpdate, editingEntry, setEditingEntry, axios, toast, months, selectedMonth, setSelectedMonth, fetchMonths };
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

}

export const useTimeContext = () => {
    return useContext(AppContext);
}