import inventoryService from '../services/inventory.service.js'

const getQ4Summary = async (req, res) => {
  try {
    const result = await inventoryService.getQ4Summary()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea datelor', error })
  }
}

const getQ4FoodDrinksSummary = async (req, res) => {
  try {
    const result = await inventoryService.getQ4FoodDrinksSummary()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea datelor', error })
  }
}

const getTopLocalities2024 = async (req, res) => {
  try {
    const result = await inventoryService.getTopLocalities2024()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea datelor', error })
  }
}

const getTopProductsDriver = async (req, res) => {
  try {
    const result = await inventoryService.getTopProductsDriver()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea datelor', error })
  }
}

const getComparisonQuantitiesOctober = async (req, res) => {
  try {
    const result = await inventoryService.getComparisonQuantitiesOctober()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea datelor', error })
  }
}

export default {
  getComparisonQuantitiesOctober,
  getQ4FoodDrinksSummary,
  getTopLocalities2024,
  getTopProductsDriver,
  getQ4Summary,
}
