// "use client";

// import { UserButton, useUser } from '@clerk/nextjs';
// import React, { useEffect, useState } from 'react';
// import CardInfo from './_components/CardInfo';
// import { db } from '@/utils/dbConfig';
// import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
// import { Budgets, Expenses } from '@/utils/schema';
// import BarChartDashboard from './_components/BarChartDashboard';
// import BudgetItem from './budgets/_components/BudgetItem';
// import ExpenseListTable from './expenses/_components/ExpenseListTable';

// function Dashboard() {
//   const { user } = useUser();
//   const [budgetList, setBudgetList] = useState([]);

//   const [loading, setLoading] = useState(true); // Track loading state
//   const [error, setError] = useState(null); // Track errors
//   const [expensesList, setExpensesList] = useState([]);

//   useEffect(() => {
//     if (user) {
//       // Call getBudgetList once when the user is available
//       getBudgetList();
//     }
//   }, [user]); // Re-fetch when user changes

//   // Fetch budget list
//   const getBudgetList = async () => {
//     setLoading(true); // Set loading to true before fetching data
//     try {
//       const result = await db.select({
//         ...getTableColumns(Budgets),
//         totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
//         totalItem: sql`count(${Expenses.id})`.mapWith(Number),
//       })
//         .from(Budgets)
//         .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
//         .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // Assuming this field exists
//         .groupBy(Budgets.id)
//         .orderBy(desc(Budgets.id));

//       setBudgetList(result);
//       getAllExpenses();
//     } catch (error) {
//       setError("Error fetching budget list.");
//       console.error("Error fetching budget list:", error);
//     } finally {
//       setLoading(false); // Set loading to false after fetching
//     }
//   };

//   // Fetch all expenses
//   const getAllExpenses = async () => {
//     try {
//       const result = await db.select({
//         id: Expenses.id,
//         name: Expenses.name,
//         amount: Expenses.amount,
//         createdAt: Expenses.createdAt
//       })
//         .from(Budgets)
//         .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId)) // This is fine if you're expecting to pull all Expenses, even those with no Budget.
//         .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // Ensure `user` is available
//         .orderBy(desc(Expenses.id));

//       console.log('Fetched Expenses:', result);
//       setExpensesList(result);

//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//     }
//   };

//   // Show loading state
//   if (loading) {
//     return <div>Loading your budget data...</div>;
//   }

//   // Show error message
//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="p-5">
//       <h2 className="font-bold text-3xl">Hi, {user?.fullName} ✌️</h2>
//       <p className="text-gray-500">Here's what's happening with your money. Let's manage your expenses.</p>

//       <CardInfo budgetList={budgetList} />

//       <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
//         <div className="md:col-span-2">
//           <BarChartDashboard budgetList={budgetList} />

//           <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetList()} />
//         </div>
//         <div className="grid gap-5">
//           <h2 className="font-bold text-lg">Latest Budgets</h2>
//           {budgetList.map((budget, index) => (
//             <BudgetItem budget={budget} key={index} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;








"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (user) {
      // Call getBudgetList once when the user is available
      getBudgetList();
    }
  }, [user]); // Re-fetch when user changes

  // Fetch budget list
  const getBudgetList = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // Assuming this field exists
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result); // Save budget data
      getAllExpenses(); // Fetch expenses after the budgets are fetched
    } catch (error) {
      setError("Error fetching budget list.");
      console.error("Error fetching budget list:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch all expenses
  const getAllExpenses = async () => {
    try {
      const result = await db.select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt
      })
        .from(Expenses)  // Querying Expenses directly instead of Budgets
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id)) // Corrected join order for fetching expenses
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // Ensure `user` is available
        .orderBy(desc(Expenses.id));

      console.log('Fetched Expenses:', result); // Log the fetched data
      setExpensesList(result); // Set expenses data

    } catch (error) {
      setError("Error fetching expenses.");
      console.error("Error fetching expenses:", error);
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading your budget data...</div>;
  }

  // Show error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl">Hi, {user?.fullName} ✌️</h2>
      <p className="text-gray-500">Here's what's happening with your money. Let's manage your expenses.</p>

      <CardInfo budgetList={budgetList} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetList()} />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
