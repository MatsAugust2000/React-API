import API_URL from '../apiConfig';
import '../css/ProductForm.css';

interface NutritionValues {
    calories: number;
    saturatedFat: number;
    sugar: number;
    salt: number;
    fibre: number;
    protein: number;
    fruitOrVeg: number;
  }
  
  export const calculateNutriScore = async (
    category: string,
    nutritionInput: string
  ): Promise<string> => {
    // Parse nutrition input string (format: "calories:100,saturatedFat:2,...")
    const nutritionValues = nutritionInput.split(",");
    
    if (!category) {
      throw new Error("Pick a Category");
    }
  
    const values: NutritionValues = {
      calories: parseInt(nutritionValues[0].split(":")[1]) || 0,
      saturatedFat: parseFloat(nutritionValues[1].split(":")[1]) || 0,
      sugar: parseFloat(nutritionValues[2].split(":")[1]) || 0,
      salt: parseFloat(nutritionValues[3].split(":")[1]) || 0,
      fibre: parseFloat(nutritionValues[4].split(":")[1]) || 0,
      protein: parseFloat(nutritionValues[5].split(":")[1]) || 0,
      fruitOrVeg: parseInt(nutritionValues[6].split(":")[1]) || 0
    };
  
    try {
      const response = await fetch(`${API_URL}/api/productapi/calculatescore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          ...values
        })
      });
  
      if (!response.ok) {
        throw new Error("Error calculating nutrition score");
      }
  
      return await response.text();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };