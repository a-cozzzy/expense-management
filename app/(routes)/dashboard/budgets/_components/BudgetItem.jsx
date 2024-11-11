import Link from 'next/link'
import React, { useState } from 'react'

function BudgetItem({ budget }) {
  const [isFull, setIsFull] = useState(false);

  const calculateProgressPercent = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return Math.min(perc, 100).toFixed(2);  // Ensure progress never goes beyond 100%
  };

  const handleProgressCheck = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    if (perc >= 100) {
      setIsFull(true);  // Set to true when the budget is fully spent
    }
  };

  React.useEffect(() => {
    handleProgressCheck();
  }, [budget.totalSpend]);  // Check when totalSpend changes

  return (
    <Link href={'/dashboard/expenses/' + budget?.id}>
      <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <h2 className='text-2xl p-2 bg-slate-100 rounded-full'>{budget?.icon}</h2>

            <div>
              <h2 className='font-bold'>{budget?.name}</h2>
              <h2 className='text-sm text-gray-500'>{budget?.totalItem} Item</h2>
            </div>
          </div>
          <h2 className='font-bold text-primary text-lg '>Rs.{budget?.amount}</h2>
        </div>

        <div className='mt-5'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-xs text-slate-400 '>{budget?.totalSpend ? budget.totalSpend : 0} Spend</h2>
            <h2 className='text-xs text-slate-400 '>{budget?.amount - budget?.totalSpend} Remaining</h2>
          </div>
          <div className='w-full bg-slate-300 h-2 rounded-full'>
            <div className='bg-primary h-2 rounded-full'
              style={{
                width: `${calculateProgressPercent()}%`
              }}
            >
            </div>
          </div>

          {isFull && (
            <div className="mt-3 text-xs text-red-500">
              <p className='text-xl mb-5'>Budget fully spent!</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
