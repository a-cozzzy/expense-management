"use client";
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { db } from '@/utils/dbConfig';
import { Expenses, Budgets } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';

const ExpensesPage = () => {
  const { user } = useUser();
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noExpenses, setNoExpenses] = useState(false);
  

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getAllExpenses();
    }
  }, []);

  const getAllExpenses = async () => {
    setLoading(true);
    console.log("Fetching expenses for user:", user?.primaryEmailAddress?.emailAddress);

    try {
      const result = await db.select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId
      })
      .from(Expenses)
      .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));

      console.log("Query result:", result);

      if (result && Array.isArray(result) && result.length > 0) {
        setExpenseList(result);
        setNoExpenses(false);
      } else {
        console.log("No expenses found or invalid result:", result);
        setExpenseList([]);
        setNoExpenses(true);
      }
    } catch (error) {
      setError("Error fetching expenses.");
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading your expenses...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <ExpenseListTable expenseList={expenseList} refreshData={getAllExpenses} />
      {noExpenses && <div>No expenses found for this user.</div>}
    </div>
  );
};

export default ExpensesPage;