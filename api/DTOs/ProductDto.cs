using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodRegistrationTool.DTOs
{
    public class ProductDto
    {
        public int ProductId { get; set; }

        [Required]
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be numbers or letters and between 2 to 20 characters.")]
        [Display(Name = "Product name")]
        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Nutrition { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "The Price must be greater than 0.")]
        public decimal Price { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        public string? NutriScore { get; set; }

        // Doesn't put class in DB
        [NotMapped]
        [Display(Name = "Upload Image")]
        public IFormFile? ImageFile { get; set; }

        public string? ImageUrl { get; set; }
    }
}