import express from 'express'
import inventoryController from '../controllers/inventory.controller.js'

const router = express.Router()

router.get(
  '/comparison-quantities-october',
  inventoryController.getComparisonQuantitiesOctober
)
router.get('/q4-2024-food-drinks', inventoryController.getQ4FoodDrinksSummary)
router.get('/top-localities-2024', inventoryController.getTopLocalities2024)
router.get('/top-products-driver', inventoryController.getTopProductsDriver)
router.get('/q4-2024-summary', inventoryController.getQ4Summary)

export default router
