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

const Second = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/inventory/q4-2024-food-drinks'
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

  // Filtrare date pentru fiecare categorie
  const firmaCategorieData = data
    .filter((item) => item.NUME !== null && item.TIP !== null)
    .map((item) => ({
      ...item,
      numeTip: `${item.NUME} - ${item.TIP}`,
    }))
  const firmaData = data.filter(
    (item) => item.NUME !== null && item.TIP === null
  )
  const categorieData = data.filter(
    (item) => item.NUME === null && item.TIP !== null
  )
  const totalData = data.filter(
    (item) => item.NUME === null && item.TIP === null
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
      {/* Transporturi pe firmă și tip categorie */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">
            Transporturi per Firmă și Tip Categorie
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={firmaCategorieData}>
              <XAxis dataKey="numeTip" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transporturi pe firmă indiferent de categorie */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">
            Transporturi per Firmă (Toate Categoriile)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={firmaData}>
              <XAxis dataKey="NUME" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transporturi per tip categorie indiferent de firmă */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">
            Transporturi per Tip Categorie (Indiferent de Firmă)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorieData}>
              <XAxis dataKey="TIP" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Total general transporturi */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Total General Transporturi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalData}>
              <XAxis dataKey="TIP" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="CANTITATE_TOTALA" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Second
