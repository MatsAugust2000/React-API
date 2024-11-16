import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Product } from '../types/product';
import { calculateNutriScore } from '../nutritionJs/nutritionService';
import '../css/ProductForm.css';
import '../css/NutriScore.css';
// import API_URL from '../apiConfig';

interface ProductFormProps {
  onProductChanged: (newProduct: Product) => void;
  productId?: number;
  isUpdate?: boolean;
  initialData?: Product;
}


const ProductForm: React.FC<ProductFormProps> = ({
    onProductChanged, 
    productId,
    isUpdate = false,
    initialData}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || '');
  const [category, setCategory] = useState('');//<string>(initialData?.category || '');
  const [nutrition, setNutrition] = useState('');//<string>(initialData?.nutrition || '');
  const [nutriScore, setNutriScore] = useState<string>(initialData?.nutriScore || '');
  const [producerId, setProducerId] = useState<number>(initialData?.producerId || 0);
  //const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // This will navigate back one step in the history
  };

  const [nutritionValues, setNutritionValues] = useState({
    calories: '',
    saturatedFat: '',
    sugar: '',
    salt: '',
    fibre: '',
    protein: '',
    fruitOrVeg: ''
  });

  // Handle both category and nutrition changes
  useEffect(() => {
    const calculateScore = async () => {
      if (category && nutrition) {
        try {
          const score = await calculateNutriScore(category, nutrition);
          setNutriScore(score);
        } catch (error) {
          console.error('Failed to calculate nutri-score:', error);
          setNutriScore('Error calculating score');
        }
      }
    };

    calculateScore();
  }, [category, nutrition]);

  // Handle nutrition input changes
  const handleNutritionChange = (field: string, value: string) => {
    //setNutritionValues(prev => ({
      //...prev,
    const newValues = {
      ...nutritionValues,
      [field]: value
    };//));
    setNutritionValues(newValues);
    // Combine values into nutrition string format
    const nutritionString = `Calories: ${newValues.calories}kcal, SaturatedFat: ${newValues.saturatedFat}g, Sugar: ${newValues.sugar}g, Salt: ${newValues.salt}mg, Fibre: ${newValues.fibre}g, Protein: ${newValues.protein}g, FruitOrVeg: ${newValues.fruitOrVeg}%`;//nutritionValues.calories}kcal,saturatedFat:${nutritionValues.saturatedFat}g,sugar:${nutritionValues.sugar}g,salt:${nutritionValues.salt}mg,fibre:${nutritionValues.fibre}g,protein:${nutritionValues.protein}g,fruitOrVeg:${nutritionValues.fruitOrVeg}%`;
    setNutrition(nutritionString);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const product: Product = { productId, name, category, nutrition, nutriScore, price, description, imageUrl, producerId };
    onProductChanged(product); // Call the passed function with the product data
  };

  
  // Helper function to get the CSS class for a score
  const getScoreClass = (score: string) => {
    const letter = score.toLowerCase();
    return `nutri-score score-${letter}`;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='formProducerId'>
        <Form.Label>Producer Id</Form.Label>
        <Form.Control
          type='number'
          placeholder='Enter producers id'
          value={producerId}
          onChange={(e) => setProducerId(Number(e.target.value))}
          required
        ></Form.Control>
      </Form.Group>
      <Form.Group controlId="formProductName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          pattern="[0-9a-zA-ZæøåÆØÅ. \-]{2,20}" // Regular expression pattern
          title="The Name must be numbers or letters and between 2 to 20 characters."
        />       
      </Form.Group>
      
      <Form.Group controlId="formProductCategory">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >       
          <option value="">Select Category</option>
          <option value="SolidFood">Solid Food</option>
          <option value="Beverage">Beverage</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formProductNutrition">
        <Form.Label>Nutrition Values</Form.Label>
        <div className="nutrition-inputs">
          <Form.Group controlId="calories">
            <Form.Label>Calories (kcal)</Form.Label>
            <Form.Control
              type="number"
              value={nutritionValues.calories}
              onChange={(e) => handleNutritionChange('calories', e.target.value)}
              placeholder="Enter calories"
            />
          </Form.Group>

          <Form.Group controlId="saturatedFat">
            <Form.Label>Saturated Fat (g)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={nutritionValues.saturatedFat}
              onChange={(e) => handleNutritionChange('saturatedFat', e.target.value)}
              placeholder="Enter saturated fat"
            />
          </Form.Group>

          <Form.Group controlId="sugar">
            <Form.Label>Sugar (g)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={nutritionValues.sugar}
              onChange={(e) => handleNutritionChange('sugar', e.target.value)}
              placeholder="Enter sugar"
            />
          </Form.Group>

          <Form.Group controlId="salt">
            <Form.Label>Salt (mg)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={nutritionValues.salt}
              onChange={(e) => handleNutritionChange('salt', e.target.value)}
              placeholder="Enter salt"
            />
          </Form.Group>

          <Form.Group controlId="fibre">
            <Form.Label>Fibre (g)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={nutritionValues.fibre}
              onChange={(e) => handleNutritionChange('fibre', e.target.value)}
              placeholder="Enter fibre"
            />
          </Form.Group>

          <Form.Group controlId="protein">
            <Form.Label>Protein (g)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={nutritionValues.protein}
              onChange={(e) => handleNutritionChange('protein', e.target.value)}
              placeholder="Enter protein"
            />
          </Form.Group>

          <Form.Group controlId="fruitOrVeg">
            <Form.Label>Fruit/Veg (%)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="100"
              value={nutritionValues.fruitOrVeg}
              onChange={(e) => handleNutritionChange('fruitOrVeg', e.target.value)}
              placeholder="Enter fruit/veg percentage"
            />
          </Form.Group>
        </div>
      </Form.Group>

      <Form.Group controlId="formProductNutriScore">
        <Form.Label>NutriScore</Form.Label>
        <div className='nutri-score-container'>
          {nutriScore && (
            <span className={getScoreClass(nutriScore)}>
              <a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC9421047/' target="_blank" title="Nutri-Score Article" style={{ textDecoration: 'none', color: 'white'}}>{nutriScore}</a>
            </span>
          )}      
          <Form.Control
            type="hidden"
            value={nutriScore}
            readOnly
          />           
        </div>
      </Form.Group>
      <br></br>
      <Form.Group controlId="formProductPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min="0.01"
          step="0.01"
        />
      </Form.Group>

      <Form.Group controlId="formProductDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formProductImageUrl">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </Form.Group>
          <br></br>
      <Button variant="secondary" type="submit">{isUpdate ? 'Update Product' : 'Create Product'}</Button>
      <Button variant="primary" onClick={onCancel} className="ms-2">Cancel</Button>
    </Form>
  );
};

export default ProductForm;