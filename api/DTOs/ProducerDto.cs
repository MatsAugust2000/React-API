using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodRegistrationTool.DTOs 
{
    public class ProducerDto
    {
        public int ProducerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        // Navigation property
        //public virtual List<ProductDto>? Products { get; set; }
    }
}

