import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Applications = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [resume, setResume] = useState(null)
    const { backendUrl, fetchUserData, userData } = useContext(AppContext)
    const { user } = useUser()
    const { getToken } = useAuth()



    //upload resume
    const uploadResume = async () => {
        try {

            if (!resume) {
                return toast.error("Please Upload resume")
            }
            const formData = new FormData()
            formData.append('resume', resume)

            const token = await getToken()

            const { data } = await axios.post(`${backendUrl}/api/users//update-resume`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                toast.success(data.message)
                await fetchUserData()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

        setIsEdit(false)
        setResume(null)
    }


    return (
        <>
            <Navbar />
            <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10' >
                <h2 className='text-xl font-semibold'>Your Resume</h2>
                <div className='flex gap-2 mb-6 mt-3'>
                    {
                        isEdit || userData && userData.resume === "" ?
                            <>
                                <label className='flex items-center' htmlFor="uploadResume">
                                    <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : "Select Resume"}</p>
                                    <input id='uploadResume' onChange={e => setResume(e.target.files[0])} type="file" accept="application/pdf" hidden />
                                    <img src={assets.profile_upload_icon} alt="" />
                                </label>
                                <button className='bg-green-100 border border-green-400 rounded-lg px-4 py-2 cursor-pointer' onClick={uploadResume}>Save</button>
                            </>
                            :
                            <div className='flex gap-2'>
                                <a href="" className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg cursor-pointer'>
                                    Resume
                                </a>
                                <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer'>
                                    Edit
                                </button>
                            </div>
                    }
                </div>
                <h2 className='text-xl font-semibold mb-4 mt-10'>Job Applied</h2>
                <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
                    <thead>
                        <tr>
                            <th className='py-3 px-4 border-b border-gray-300 text-left'>Company</th>
                            <th className='py-3 px-4 border-b border-gray-300 text-left'>Job Title</th>
                            <th className='py-3 px-4 border-b border-gray-300 text-left max-sm:hidden'>Location</th>
                            <th className='py-3 px-4 border-b border-gray-300 text-left max-sm:hidden'>Applied Date</th>
                            <th className='py-3 px-4 border-b border-gray-300 text-left'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobsApplied.map((job, index) => true ? (
                            <tr key={index}>
                                <td className='py-3 px-4 flex items-center gap-2 border-b border-gray-300'>
                                    <img className='w-8 h-8' src={job.logo} alt="" />
                                    {job.company}
                                </td>
                                <td className='py-2 px-4 border-b border-gray-300'>
                                    {job.title}
                                </td>
                                <td className='py-2 px-4 border-b border-gray-300 max-sm:hidden'>
                                    {job.location}
                                </td>
                                <td className='py-2 px-4 border-b border-gray-300 max-sm:hidden'>
                                    {/* {moment(job.date).format('ll')} */}
                                    {job.date}
                                </td>
                                <td className='py-2 px-4 border-b border-gray-300'>
                                    <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5`}>{job.status}</span>
                                </td>
                            </tr>
                        ) : (null))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    )
}

export default Applications