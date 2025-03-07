import React, { useState } from 'react'
import { assets } from '../assets/assets'

const RecruiterLogin = () => {

    const [state, setState] = useState('Login')
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState(false)
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (state === 'Sign Up' && !isTextDataSubmitted) {
            setIsTextDataSubmitted(true)
        }
    }


    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center backdrop-blur-sm bg-black/30'>
            <form className="relative bg-white p-10 rounded-xl text-slate-500" onSubmit={onSubmitHandler}>
                <h1 className='text-center text-2xl text-neutral-700 font-medium '>Recruiter {state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>
                {state === 'Sign Up' && isTextDataSubmitted ?
                    <>
                        <div className='flex items-center gap-4 my-10'>
                            <label htmlFor="image">
                                <img className='w-16 rounded-full cursor-pointer' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
                            </label>
                            <p>Upload Company <br />Logo</p>
                        </div>
                    </>
                    :
                    <>
                        {state !== 'Login' && (
                            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img src={assets.person_icon} alt="" />
                                <input className='outline-none text-sm' type="text" placeholder='Company Name' required onChange={e => setName(e.target.value)} value={name} />
                            </div>
                        )}
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.email_icon} alt="" />
                            <input className='outline-none text-sm' type="email" placeholder='Email' required onChange={e => setEmail(e.target.value)} value={email} />
                        </div>
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.person_icon} alt="" />
                            <input className='outline-none text-sm' type="password" placeholder='Password' required onChange={e => setPassword(e.target.value)} value={password} />
                        </div>
                    </>
                }

                {state === 'Login' && <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password?</p>}

                <button type='submit' className='bg-blue-600 w-full text-white py-2 mt-4 mb-2 rounded-full cursor-pointer'>
                    {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
                </button>

                {state === 'Login' ?
                    <p className='text-center text-sm mt-2'>Don't have an account? <span onClick={() => setState('Sign Up')} className='text-sm text-blue-600 cursor-pointer'> Sign Up</span></p>
                    :
                    <p className='text-center text-sm mt-2'>Already have an account? <span onClick={() => setState('Login')} className='text-sm text-blue-600 cursor-pointer'> Login</span></p>
                }
            </form>
        </div>
    )
}

export default RecruiterLogin