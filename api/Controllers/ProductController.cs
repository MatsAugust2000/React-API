using FoodRegistrationTool.Models;
using Microsoft.AspNetCore.Mvc;
using FoodRegistrationTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using FoodRegistrationTool.DAL;
using FoodRegistrationTool.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace FoodRegistrationTool.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("CorsPolicy")]
public class ProductAPIController : Controller 
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<ProductController> _logger;

    // For image upload and viewing
    private readonly IWebHostEnvironment _hostEnvironment;

    public ProductAPIController(IProductRepository productRepository, IWebHostEnvironment hostEnvironment, ILogger<ProductController> logger)
    {
        _productRepository = productRepository;
        _hostEnvironment = hostEnvironment;
        _logger = logger;

    }

    [HttpGet("productlist")]
    public async Task<IActionResult> ProductList()
    {
        var products = await _productRepository.GetAll();
        if (products == null)
        {
            _logger.LogError("[ProductAPIController] Product list not found while executing _productRepository.GetAll()");
            return NotFound("Product list not found");
        }        
        var productDtos = products.Select(product => new ProductDto 
        {
            ProductId = product.ProductId,
            Name = product.Name,
            Category = product.Category,
            Nutrition = product.Nutrition,
            Price = product.Price,
            Description = product.Description,
            NutriScore = product.NutriScore,
            ImageUrl = product.ImageUrl,
            ProducerId = product.ProducerId,

        });
        return Ok(productDtos);
    }

    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] ProductDto productDto)
    {
        if (productDto == null)
        {
            return BadRequest("Prod cannot be null");
        }
        var newProduct = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            Description = productDto.Description,
            ImageUrl = productDto.ImageUrl,
            Category = productDto.Category,
            Nutrition = productDto.Nutrition,
            NutriScore = productDto.NutriScore,
            ProducerId = productDto.ProducerId
        };        
        bool returnOk = await _productRepository.Create(newProduct);
        if (returnOk)
            return CreatedAtAction(nameof(ProductList), new { id = newProduct.ProductId }, newProduct);

        _logger.LogWarning("[ProductAPIController] Product creation failed {@product}", newProduct);
        return StatusCode(500, "Internal server error");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productRepository.GetProductById(id);
        if (product == null)
        {
            _logger.LogError("[ProductAPIController] Product not found for the ProductId {ProductId:0000}", id);
            return NotFound("Product not found for the ProductId");
        }
        return Ok(product);
    }

    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductDto productDto)
    {
        if (productDto == null)
        {
            return BadRequest("Product data cannot be null");
        }
        // Find the product in the database
        var existingProduct = await _productRepository.GetProductById(id);
        if (existingProduct == null)
        {
            return NotFound("Prod not found");
        }
        // Update the product properties
        existingProduct.Name = productDto.Name;
        existingProduct.Price = productDto.Price;
        existingProduct.Description = productDto.Description;
        existingProduct.ImageUrl = productDto.ImageUrl;
        existingProduct.Category = productDto.Category;
        existingProduct.Nutrition = productDto.Nutrition;
        existingProduct.NutriScore = productDto.NutriScore;
        existingProduct.ProducerId = productDto.ProducerId;
        // Save the changes
        bool updateSuccessful = await _productRepository.Update(existingProduct);
        if (updateSuccessful)
        {
            return Ok(existingProduct); // Return the updated prod
        }

        _logger.LogWarning("[PorudctAPIController] Prodyuct update failed {@product}", existingProduct);
        return StatusCode(500, "Internal server error");
    }

    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _productRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[ProductAPIController] Prod deletion failed for the ProductId {ProductId:0000}", id);
            return BadRequest("Prd deletion failed");
        }
        return NoContent(); // 200 Ok is commonly used when the server returns a response body with additional information about the result of the request. For a DELETE operation, there's generally no need to return additional data, making 204 NoContent a better fit.
    }    



    [HttpPost("calculatescore")]
    public async Task<IActionResult> CalculateNutritionScore([FromBody] NutritionCalculationRequest request)
    {
        try 
        {
            var score = CalculateNutrition.CalculateScore(request.Category, request.Calories, 
                request.SaturatedFat, request.Sugar, request.Salt, 
                request.Fibre, request.Protein, request.FruitOrVeg);
            
            return Ok(score);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating nutrition score");
            return BadRequest("Error calculating nutrition score");
        }
    }

    public class NutritionCalculationRequest
    {
        public string Category { get; set; } = string.Empty;
        public double Calories { get; set; }
        public double SaturatedFat { get; set; }
        public double Sugar { get; set; }
        public double Salt { get; set; }
        public double Fibre { get; set; }
        public double Protein { get; set; }
        public double FruitOrVeg { get; set; }
    }

}

[Authorize(AuthenticationSchemes = "Identity.Application")]
public class ProductController : Controller 
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<ProductController> _logger;

    // For image upload and viewing
    private readonly IWebHostEnvironment _hostEnvironment;

    public ProductController(IProductRepository productRepository, IWebHostEnvironment hostEnvironment, ILogger<ProductController> logger)
    {
        _productRepository = productRepository;
        _hostEnvironment = hostEnvironment;
        _logger = logger;

    }

    public async Task<IActionResult> Table()
    {
        var products = await _productRepository.GetAll();
        if (products == null)
        {
            _logger.LogError("[ProductController] Product list not found while executing _productRepository.GetAll()");
            return NotFound("Product list not found");
        }
        var productsViewModel = new ProductsViewModel(products, "Table");
        return View(productsViewModel);
    }

    public async Task<IActionResult> Grid()
    {
        var products = await _productRepository.GetAll();
        if (products == null)
        {
            _logger.LogError("[ProductController] Product list not found while executing _productRepository.GetAll()");
            return NotFound("Product list not found");
        }
        var productsViewModel = new ProductsViewModel(products, "Grid");
        return View(productsViewModel);
    }

    public async Task<IActionResult> Details(int id)
    {
        var product = await _productRepository.GetProductById(id);
        if (product == null)
        {
            _logger.LogError("[ProductController] Product not found for the ProductId {ProductId:0000}", id);
            return BadRequest("Product not found.");
        }
        return View(product);
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("ProductId,Name,Category,Nutrition,NutriScore,Price,Description, ProducerId")] ProductCreateViewModel productCreateViewModel)
    {
        // Må legge inn Logger her
        if (ModelState.IsValid)
        {
            // Getting producer by Id
            var producer = await _productRepository.GetProducerById(productCreateViewModel.ProducerId);

            // Checking producer exists
            
            if (producer == null)
            {
                return BadRequest("Producer not found.");
            }
            
            
            // Creating Product object
            var product = new Product
            {
                Name = productCreateViewModel.Name,
                Category = productCreateViewModel.Category,
                Nutrition = productCreateViewModel.Nutrition,
                Price = productCreateViewModel.Price,
                Description = productCreateViewModel.Description,
                NutriScore = productCreateViewModel.NutriScore,
                ProducerId = productCreateViewModel.ProducerId,
                Producer = producer // Sett produsenten til produktet
            };
            
            // Handle Image Upload
            var imageFile = Request.Form.Files.FirstOrDefault();
            if (imageFile != null)
            {
                string wwwRootPath = _hostEnvironment.WebRootPath;
                string fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
                string extension = Path.GetExtension(imageFile.FileName);
                fileName = fileName + DateTime.Now.ToString("yymmssfff") + extension;
                string path = Path.Combine(wwwRootPath, "images/clientImages", fileName);
                //Console.WriteLine($"Attempting to save file to: {path}");
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }
                product.ImageUrl = "/images/clientImages/" + fileName;
                //Console.Write($"Set url to: {product.ImageUrl}");

            }
            else
            {
                Console.Write($"No img found, url: {product.ImageUrl}, imgfile: {product.ImageFile}");
            }

            // Save product to DB
            await _productRepository.Create(product);
            return RedirectToAction(nameof(Table));
        }
        return View(productCreateViewModel);
    }

    [HttpGet]
    public async Task<IActionResult> Update(int id)
    {
        var product = await _productRepository.GetProductById(id);
        if (product == null)
        {
            _logger.LogError("[ProductController] not found when updating prodId {ProductId:0000}", id);
            return BadRequest("Product not found");
        }
        return View(product);
    }
    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Update(int id, [Bind("ProductId,Name,Category,Nutrition,NutriScore,Price,Description")] Product product)
    {
        
        if (id != product.ProductId)
        {
            return NotFound();
        }
        
        if (ModelState.IsValid)
        {
            
            try 
            {
                // Handle Image Upload
                var imageFile = Request.Form.Files.FirstOrDefault();
                if (imageFile != null)
                {
                    string wwwRootPath = _hostEnvironment.WebRootPath;
                    string fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
                    string extension = Path.GetExtension(imageFile.FileName);
                    fileName = fileName + DateTime.Now.ToString("yymmssfff") + extension;
                    string path = Path.Combine(wwwRootPath + "/images/clientImages", fileName);
                    using (var fileStream = new FileStream(path, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }
                    product.ImageUrl = "/images/clientImages/" + fileName;
                
                // Delete old image
                    var oldImagePath = Path.Combine(wwwRootPath, "images/clientImages", product.ImageUrl);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                bool returnOk = await _productRepository.Update(product);
                if (returnOk)
                    return RedirectToAction(nameof(Table));

            }
            
            catch (DbUpdateConcurrencyException)
            {
                if (product == null)
                {
                    return NotFound();
                }
                else throw;
            }
            
            return RedirectToAction(nameof(Table));
            /*
            bool returnOk = await _productRepository.Update(product);
            if (returnOk)
                return RedirectToAction(nameof(Table));
                */
        }
        _logger.LogWarning("[ProductController] update failed {@product}", product);
        return View(product);
    }


    [HttpGet]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _productRepository.GetProductById(id);
        if (product == null)
        {
            _logger.LogError("[ProductController] not found for Id {ProductId:0000}", id);
            return BadRequest("Prod not found for id");
        }
        return View(product);
    }
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _productRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[ProductController] deletion failed for id {ProductId:0000}", id);
            return BadRequest("Prod deletion failed");
        }
        return RedirectToAction(nameof(Table));
    }

    
    [HttpPost]
    public async Task<IActionResult> CalculateNutritionScore(string category, int calories, double saturatedFat, double sugar, double salt, double fibre, double protein, int fruitOrVeg)
    {
        var score = await Task.Run(() =>
            CalculateNutrition.CalculateScore(category, calories, saturatedFat, sugar, salt, fibre, protein, fruitOrVeg)
        );
        return Json(score);
    }

    // Hvis ikke benytter DB
    /*
    public List<Product> GetProducts()
    {
        var products = new List<Product>();
        var product1 = new Product
        {
            ProductId = 1,
            Name = "Banana",
            Category = "Fruit",
            Price = 30,
            Description = "Yellow fruit.",
            ImageUrl = "/images/banana.jpg"
        };

        var product2 = new Product
        {
            ProductId = 2,
            Name = "Coke",
            Category = "Beverage",
            Price = 20,
            Description = "The original coke.",
            ImageUrl = "/images/coke.jpg"
        };

        var product3 = new Product
        {
            ProductId = 3,
            Name = "Baguette",
            Category = "Pastry",
            Price = 30,
            Description = "French bread.",
            ImageUrl = "/images/baguette.png"
        };

        products.Add(product1);
        products.Add(product2);
        products.Add(product3);
        return products;

    }
    */

}