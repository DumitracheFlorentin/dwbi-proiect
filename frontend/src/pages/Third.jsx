import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'

const Third = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/inventory/top-localities-2024'
        )
        const result = await response.json()

        // Gruparea datelor pe unitate de măsură
        const groupedData = {}
        result.forEach((item) => {
          if (!groupedData[item.UNITATE_DE_MASURA]) {
            groupedData[item.UNITATE_DE_MASURA] = []
          }
          groupedData[item.UNITATE_DE_MASURA].push(item)
        })

        setData(groupedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
      {Object.keys(data).map((unit, index) => (
        <Card key={index}>
          <CardContent>
            <h2 className="text-xl font-bold my-4">Top Localități - {unit}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data[unit]}>
                <XAxis dataKey="LOCALITATE" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="CANTITATE_TOTALA" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Third
