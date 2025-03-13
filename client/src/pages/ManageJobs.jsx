import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ManageJobs = () => {

    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const { companyToken, backendUrl } = useContext(AppContext)

    const fetchCompanyJobs = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, { headers: { token: companyToken } })

            if (data.success) {
                setJobs(data.jobsData.reverse())
                // console.log(data.jobsData);
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //change visibility
    const changeVisibility = async (id) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/company/change-visibility`,
                { id },
                { headers: { token: companyToken } }
            )

            console.log(data);

            if (data.success) {
                // toast.success('Visibility Changed')
                fetchCompanyJobs()
            }
            else {
                toast.error('Unable to Change the visibility state')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobs()
        }
    }, [companyToken])


    return (
        <div className='container p-4 max-w-5xl'>
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>#</th>
                            <th className='py-2 px-4 border-b border-gray-200 text-left'>Job Title</th>
                            <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Date</th>
                            <th className='py-2 px-4 border-b border-gray-200 text-left max-sm:hidden'>Location</th>
                            <th className='py-2 px-4 border-b border-gray-200 text-left'>Applicants</th>
                            <th className='py-2 px-4 border-b border-gray-200 text-left'>Visible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job, index) => (
                            <tr key={index} className='text-gray-700'>
                                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{index + 1}</td>
                                <td className='py-2 px-4 border-b border-gray-200'>{job.title}</td>
                                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{job.location}</td>
                                <td className='py-2 px-4 border-b border-gray-200 text-center'>{job.applicants}</td>
                                <td className='py-2 px-4 border-b border-gray-200'>
                                    <input className='scale-125 ml-4' type="checkbox" checked={job.visible} onChange={() => changeVisibility(job._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='flex justify-end mt-4'>
                    <button className='bg-black text-white py-2 px-3 rounded cursor-pointer' onClick={() => navigate('/dashboard/add-job')}>Add New Job</button>
                </div>
            </div>
        </div>
    )
}

export default ManageJobs