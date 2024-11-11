import { UserButton, useUser } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
    const { user } = useUser();
    return (
        <div className='p-5 shadow-sm border-b flex justify-between'>
            <div>
            <h2 className="font-bold text-3xl">Hi, {user?.fullName} ✌️</h2>
            </div>
            <div>
                <UserButton/>
            </div>
        </div>
    )
}

export default DashboardHeader