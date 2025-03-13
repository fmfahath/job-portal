import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title: "",
        location: ""
    })

    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    //fetch job data
    const fetchJobs = async () => {
        // setJobs(jobsData)

        // fetching from database
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/company`, { headers: { token: companyToken } })

            if (data.success) {
                setCompanyData(data.company)
                // console.log("data: ", data);

            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchJobs()

        const companyToken = localStorage.getItem('companyToken')
        if (companyToken) {
            setCompanyToken(companyToken)
        }

    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])



    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}