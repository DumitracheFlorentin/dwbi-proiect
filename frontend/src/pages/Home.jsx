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

const Home = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/inventory/q4-2024-summary'
        )
        const result = await response.json()

        setData(result)
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

  const totalData = data.filter((item) => item.JUDET === null)
  const judetData = data.filter(
    (item) => item.JUDET !== null && item.LOCALITATE === null
  )
  const localitateData = data.filter(
    (item) =>
      item.JUDET !== null && item.LOCALITATE !== null && item.STRADA === null
  )
  const stradaData = data.filter(
    (item) => item.STRADA !== null && item.NR !== null
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
      {/* Total General Transporturi */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold my-4">Total General Transporturi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalData}>
              <XAxis dataKey="UNITATE_DE_MASURA" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} ${props.payload.UNITATE_DE_MASURA}`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transporturi pe Județ */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold my-4">Transporturi per Județ</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={judetData}>
              <XAxis dataKey="JUDET" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} ${props.payload.UNITATE_DE_MASURA}`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transporturi pe Localitate */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold my-4">
            Transporturi per Localitate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={localitateData}>
              <XAxis
                dataKey="LOCALITATE"
                tickFormatter={(tick, index) =>
                  `${tick} (${stradaData[index]?.UNITATE_DE_MASURA || ''})`
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} ${props.payload.UNITATE_DE_MASURA}`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transporturi per Locație (Stradă + Nr) */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold my-4">Transporturi per Locație</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stradaData}>
              <XAxis
                dataKey="STRADA"
                tickFormatter={(tick, index) =>
                  `${tick} (${stradaData[index]?.UNITATE_DE_MASURA || ''})`
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} ${props.payload.UNITATE_DE_MASURA}`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home
