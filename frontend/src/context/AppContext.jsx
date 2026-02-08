import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'â‚¹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    const [profileDashboard, setProfileDashboard] = useState(null)

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Update theme in localStorage and DOM
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev)
    }

    // Getting Doctors using API
    const getDoctosData = async () => {
        if (!token) {
            setDoctors([])
            return
        }

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list', { headers: { token } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const [profileRes, dashboardRes] = await Promise.all([
                axios.get(backendUrl + '/api/user/get-profile', { headers: { token } }),
                axios.get(backendUrl + '/api/user/profile-dashboard', { headers: { token } })
            ])

            if (profileRes.data.success) {
                setUserData(profileRes.data.userData)
            } else {
                toast.error(profileRes.data.message)
            }

            if (dashboardRes.data.success) {
                setProfileDashboard(dashboardRes.data.data)
            } else {
                toast.error(dashboardRes.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [token])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        profileDashboard,
        isDarkMode, toggleTheme
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
