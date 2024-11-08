using FoodRegistrationTool.Models;

namespace FoodRegistrationTool.DAL;

public interface IProductRepository
{
    Task<IEnumerable<Product>?> GetAll();
    Task<Product?> GetProductById(int id);
    Task<bool> Create(Product product);
    Task<bool> Update(Product product);
    Task<bool> Delete(int id);
}