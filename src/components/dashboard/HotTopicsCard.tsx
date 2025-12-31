import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Car } from 'lucide-react'

const HotTopicsCard = () => {
  return (
    <Card className='col-span-4'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold flex items-center gap-2'>
            Hot Topics
            </CardTitle>
            <CardDescription>
                Click on a topic to start a quiz on it.
            </CardDescription>
        </CardHeader>
        <CardContent className='pl-2'>
            Word Cloud
        </CardContent>
    </Card>
  )
}

export default HotTopicsCard