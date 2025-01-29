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

const Fourth = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/inventory/top-products-driver'
        )
        const result = await response.json()

        // Gruparea datelor pe tip
        const groupedData = {}
        result.forEach((item) => {
          if (!groupedData[item.TIP]) {
            groupedData[item.TIP] = []
          }
          groupedData[item.TIP].push(item)
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
      {Object.keys(data).map((tip, index) => (
        <Card key={index}>
          <CardContent>
            <h2 className="text-xl font-bold mb-4">
              Top Produse Transportate - {tip}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data[tip]}>
                <XAxis dataKey="NUME_PRODUS" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TOTAL_CANTITATE" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Fourth
