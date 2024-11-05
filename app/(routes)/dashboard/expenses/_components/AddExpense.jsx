import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import React, { useState } from 'react'
import { toast } from 'sonner';

function AddExpense({budgetId, user, refreshData}) {

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addNewExpense = async () => {
        const result = await db.insert(Expenses).values({
            name: name,
            amount: parseInt(amount, 10),  // Convert amount to integer
            budgetId: budgetId,
            createdAt: user?.primaryEmailAddress?.emailAddress
        }).returning({ insertedId: Budgets.id });

        console.log(result);
        if (result) {
            refreshData()
            toast('New Expense Added!');
        }
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input
                    id="expenseName"
                    placeholder="e.g. Bedroom Decor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    required
                />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input
                    id="expenseAmount"
                    placeholder="e.g. 1000"
                    value={amount}  // Corrected value
                    onChange={(e) => setAmount(e.target.value)}  // Corrected onChange
                    maxLength={50}
                    required
                />
            </div>
            <Button
                disabled={!(name && amount)}
                onClick={addNewExpense}
                className='mt-3'
            >
                Add New Expense
            </Button>
        </div>
    );
}

export default AddExpense;
