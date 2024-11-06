"use client";

import { useRouter } from 'next/navigation';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pen, PenBox, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen() {
    const { user } = useUser();
    const params = useParams(); 
    const [budgetInfo, setBudgetInfo] = useState();
    const [expenseList, setExpenseList] = useState([]);
    const { replace } = useRouter(); 

    useEffect(() => {
        if (user && params?.id) {
            getBudgetInfo();
            getExpenseList();
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
            getExpenseList();
        } catch (error) {
            console.error("Error fetching budget info:", error);
        }
    };

    const getExpenseList = async () => {
        try {
            const result = await db.select().from(Expenses)
                .where(eq(Expenses.budgetId, params.id))
                .orderBy(desc(Expenses.id));

            setExpenseList(result);
            console.log(result);
        } catch (error) {
            console.error("Error fetching Expense list:", error);
        }
    };

    const deleteBudget = async () => {
        const deleteExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .returning();

        if (deleteExpenseResult) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, params.id))
                .returning();
        }

        toast('Budget deleted!');
        replace('/dashboard/budgets'); 
    };

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                <span className='flex gap-2 items-center'>
                    <ArrowLeft onClick={()=>route.back()} className='cursor-pointer'/>
                    My Expenses</span>
                    <div className='flex gap-2 items-center'>
                    <EditBudget budgetInfo={budgetInfo} refreshData={()=>getBudgetInfo()}/>

                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button className="flex gap-2 bg-red-600 text-white border-2 border-transparent hover:bg-black hover:text-white hover:border-white p-2"> <Trash/> Delete </Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your current budget along with related expenses
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>  
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
                )}
                <AddExpense budgetId={params.id} user={user} refreshData={() => getBudgetInfo()} />
            </div>

            <div className='mt-8'>
                <h2 className='font-bold text-2xl'>Latest Expenses</h2>
                <ExpenseListTable expenseList={expenseList} refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    );
}

export default ExpensesScreen;
