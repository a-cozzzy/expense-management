'use client'
import React, { useEffect, useState } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { eq } from 'drizzle-orm'

function DashboardLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            user&&checkUserBudgets();
        }
    }, [user]);

    const checkUserBudgets = async () => {
        try {
            const result = await db.select()
                .from(Budgets)
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

            if (result?.length === 0) {
                router.replace('/dashboard/budgets');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch budgets');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <div className='fixed md:w-64 hidden md:block'>
                <SideNav />
            </div>
            <div className='md:ml-64'>
                <DashboardHeader />
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
