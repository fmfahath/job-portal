import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='container px-4 2xl:p-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20'>
            <img className='max-md:w-30' width={160} src={assets.logo} alt="" />
            <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>All right reserved. Copyright @job-portal</p>
            <div className='flex gap-2.5'>
                <img className='w-12 max-sm:w-8 cursor-pointer' src={assets.facebook_icon} alt="" />
                <img className='w-12 max-sm:w-8 cursor-pointer' src={assets.twitter_icon} alt="" />
                <img className='w-12 max-sm:w-8 cursor-pointer' src={assets.instagram_icon} alt="" />
            </div>
        </div>
    )
}

export default Footer