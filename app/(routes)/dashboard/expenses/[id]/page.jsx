"use client";

import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema'; // Make sure both tables are imported
import { useUser } from '@clerk/nextjs';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';  // Import the hook to access params in Next.js
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';

function ExpensesScreen() {
    const { user } = useUser();
    const params = useParams(); // Use the useParams hook to access route parameters
    const [budgetInfo, setBudgetInfo] = useState();

    useEffect(() => {
        if (user && params?.id) {
            getBudgetInfo();
        }
    }, [user, params]);

    const getBudgetInfo = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number),
            }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id, params.id))
            .groupBy(Budgets.id);

            setBudgetInfo(result[0]);
        } catch (error) {
            console.error("Error fetching budget info:", error);
        }
    };

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold'>My Expenses</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                )}
                <AddExpense budgetId={params.id}
                user={user}
                refreshData={()=>getBudgetInfo()}
                />
            </div>
        </div>
    );
}

export default ExpensesScreen;
