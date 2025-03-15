import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'


const ApplyJob = () => {

    const { id } = useParams()
    const [jobData, setJobData] = useState(null)
    const { jobs, backendUrl, userData, userApplications, fetchUsersApplication } = useContext(AppContext)
    const navigate = useNavigate()
    const { getToken } = useAuth()
    const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)

    // get job
    const fetchJob = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)

            if (data.success) {
                setJobData(data.job)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //apply for job
    const applyHandler = async () => {
        try {
            if (!userData) {
                toast.error('Login to apply for jobs')
            }

            if (!userData.resume) {
                navigate('/applications')
                toast.error('Upload resume to apply jobs')
            }

            const token = await getToken()

            const { data } = await axios.post(`${backendUrl}/api/users/apply`,
                { jobId: jobData._id },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                toast.success(data.message)
                await fetchUsersApplication()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //check already applied or not
    const checkAlreadyApplied = () => {
        const hasApplied = userApplications.some(item => item.jobId._id === jobData._id)
        setIsAlreadyApplied(hasApplied)
    }


    useEffect(() => {
        fetchJob()
    }, [id])


    useEffect(() => {
        if (userApplications.length > 0 && jobData) {
            checkAlreadyApplied()
        }
    }, [jobData, userApplications, id])


    return jobData ? (
        <>
            <Navbar />

            <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
                <div className='bg-white text-black rounded-lg w-full'>

                    {/* job title - hero */}
                    <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-600 rounded-xl'>
                        <div className='flex flex-col md:flex-row items-center'>
                            <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border border-gray-200' src={jobData.companyId.image} alt="" />
                            <div className='text-center md:text-left text-neutral-700'>
                                <h1 className='text-2xl sm:text-3xl font-medium'>{jobData.title}</h1>
                                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                                    <span className='flex items-center gap-1.5'>
                                        <img src={assets.suitcase_icon} alt="" />
                                        {jobData.companyId.name}
                                    </span>
                                    <span className='flex items-center gap-1.5'>
                                        <img src={assets.location_icon} alt="" />
                                        {jobData.location}
                                    </span>
                                    <span className='flex items-center gap-1.5'>
                                        <img src={assets.person_icon} alt="" />
                                        {jobData.level}
                                    </span>
                                    <span className='flex items-center gap-1.5'>
                                        <img src={assets.money_icon} alt="" />
                                        CTC: {Number(jobData.salary) / 1000 + "k"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='fl ex flex-col justify-center text-center text-sm max-md:mx-auto max-md:text-center'>
                            <button className={isAlreadyApplied ? 'bg-blue-300 p-2.5 px-10 text-white rounded cursor-not-allowed' : 'bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer'} onClick={applyHandler} disabled={isAlreadyApplied && true}>{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
                            <p className='mt-1 text-gray-600'>Posted {moment(jobData.date).fromNow()}</p>
                        </div>
                    </div>

                    {/* description */}
                    <div className='flex flex-col lg:flex-row justify-between items-start'>
                        <div className='w-full lg:w-2/3'>
                            <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
                            <div className='rich-text' dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
                            <button className={isAlreadyApplied ? 'bg-blue-300 p-2.5 px-10 text-white rounded cursor-not-allowed' : 'bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer'} onClick={applyHandler} disabled={isAlreadyApplied && true}>{isAlreadyApplied ? "Already Applied" : "Apply Now"}</button>
                        </div>

                        {/* right section */}
                        <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
                            <h2>More Jobs from {jobData.companyId.name}</h2>

                            {/* filter and display jobs of the same company exclude current diplayed job */}
                            {/* {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                                .filter(job => true).slice(0, 4)
                                .map((job, index) => (
                                    <JobCard key={index} job={job} />
                                ))} */}

                            {/* filter and display jobs of the same company exclude current diplayed & applied job */}
                            {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                                .filter(job => {
                                    const appliedJobsIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                                    return !appliedJobsIds.has(job._id)
                                })
                                .map((job, index) => {
                                    return <JobCard key={index} job={job} index={index} />
                                })}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    ) :
        (
            <Loading />
        )
}

export default ApplyJob