import React from 'react';
import QuizMeCard from '@/components/dashboard/QuizMeCard';
import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';

export const metadata = {
    title: "Dashboard | Quiz Engine",
}

const Dashboard = () => {
  return (
    <main className='p-8 mx-auto max-w-7xl'>
        <div className='h-12'></div>
        <div className='flex items-center'>
            <h2 className='mr-2 text-3xl font-bold tracking-tight'>Dashboard</h2>
        </div>
        <div className='grid gap-4 mt-4 md:grid-cols-2'>
            <QuizMeCard />
            <HistoryCard />
        </div>
         <div className='grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7'>
            <HotTopicsCard />
            <RecentActivity />
        </div>
    </main>
  )
}

export default Dashboard