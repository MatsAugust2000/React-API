using Microsoft.EntityFrameworkCore;
using FoodRegistrationTool.Models;

namespace FoodRegistrationTool.DAL;

// For debugging. Initializes the DB with test-data.
public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        ProductDbContext context = serviceScope.ServiceProvider.GetRequiredService<ProductDbContext>();
        // Deletes existing DB
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        if (!context.Products.Any())
        {
            var products = new List<Product>
            {
                new Product
                {
                    Name = "Pizza",
                    Price = 150,
                    Category = "SolidFood",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "D",
                    Description = "Delicious Italian dish with a thin crust topped with tomato sauce, cheese, and various toppings.",
                    ImageUrl = "/images/pizza.jpg",
                    ProducerId = '1'
                },
                new Product
                {
                    Name = "Fried Chicken Leg",
                    Price = 20,
                    Category = "SolidFood",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "C",
                    Description = "Crispy and succulent chicken leg that is deep-fried to perfection, often served as a popular fast food item.",
                    ImageUrl = "/images/chickenleg.jpg",
                    ProducerId = '1'
                },
                new Product
                {
                    Name = "French Fries",
                    Price = 50,
                    Category = "SolidFood",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "E",
                    Description = "Crispy, golden-brown potato slices seasoned with salt and often served as a popular side dish or snack.",
                    ImageUrl = "/images/frenchfries.jpg",
                    ProducerId = '1'

                },
                new Product
                {
                    Name = "Grilled Ribs",
                    Price = 250,
                    Category = "SolidFood",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "C",
                    Description = "Tender and flavorful ribs grilled to perfection, usually served with barbecue sauce.",
                    ImageUrl = "/images/ribs.jpg",
                    ProducerId = '1'

                },
                new Product
                {
                    Name = "Tacos",
                    Price = 150,
                    Category = "SolidFood",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "D",
                    Description = "Tortillas filled with various ingredients such as seasoned meat, vegetables, and salsa, folded into a delicious handheld meal.",
                    ImageUrl = "/images/tacos.jpg",
                    ProducerId = '1'

                },
                new Product
                {
                    Name = "Fish and Chips",
                    Price = 180,
                    Category = "SolidFood",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "B",
                    Description = "Classic British dish featuring battered and deep-fried fish served with thick-cut fried potatoes.",
                    ImageUrl = "/images/fishandchips.jpg",
                    ProducerId = '1'

                },
                new Product
                {
                    Name = "Cider",
                    Price = 50,
                    Category = "Beverage",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "C",
                    Description = "Refreshing alcoholic beverage made from fermented apple juice, available in various flavors.",
                    ImageUrl = "/images/cider.jpg",
                    ProducerId = '1'

                },
                new Product
                {
                    Name = "Coke",
                    Price = 30,
                    Category = "Beverage",
                    Nutrition = "Calories: 100kcal, SaturatedFat: 10g, Sugar: 10g, Salt: 100mg, Fibre: g, Protein: g, FruitOrVeg: %",
                    NutriScore = "D",
                    Description = "Popular carbonated soft drink known for its sweet and refreshing taste.",
                    ImageUrl = "/images/coke.jpg",
                    ProducerId = '1'
                },
            };
            context.AddRange(products);
            context.SaveChanges();
        }
    }
}
