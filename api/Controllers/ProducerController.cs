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
public class ProducerAPIController : Controller 
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<ProducerController> _logger;

    public ProducerAPIController(IProductRepository productRepository, ILogger<ProducerController> logger)
    {
        _productRepository = productRepository;
        _logger = logger;

    }

    [HttpGet("producerlist")]
    public async Task<IActionResult> ProducerList()
    {
        var producers = await _productRepository.GetAllProducers();
        if (producers == null)
        {
            _logger.LogError("[ProducerAPIController] Producer list not found while executing _productRepository.GetAll()");
            return NotFound("Producer list not found");
        }        
        var producerDtos = producers.Select(producer => new ProducerDto 
        {
            ProducerId = producer.ProducerId,
            Name = producer.Name,
            Address = producer.Address

        });
        return Ok(producerDtos);
    }

    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] ProducerDto producerDto)
    {
        if (producerDto == null)
        {
            return BadRequest("Prod cannot be null");
        }
        var newProducer = new Producer
        {
            Name = producerDto.Name,
            Address = producerDto.Address
        };        
        bool returnOk = await _productRepository.CreateProducer(newProducer);
        if (returnOk)
            return CreatedAtAction(nameof(ProducerList), new { id = newProducer.ProducerId }, newProducer);

        _logger.LogWarning("[ProducerAPIController] Producer creation failed {@producer}", newProducer);
        return StatusCode(500, "Internal server error");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProducer(int id)
    {
        var producer = await _productRepository.GetProducerById(id);
        if (producer == null)
        {
            _logger.LogError("[ProducerAPIController] Producer not found for the ProducerId {ProducerId:0000}", id);
            return NotFound("Producer not found for the ProducerId");
        }
        return Ok(producer);
    }


    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProducerDto producerDto)
    {
        if (producerDto == null)
        {
            return BadRequest("Producer data cannot be null");
        }
        // Find the producer in the database
        var existingProducer = await _productRepository.GetProducerById(id);
        if (existingProducer == null)
        {
            return NotFound("Prod not found");
        }
        // Update the producer properties
        existingProducer.Name = producerDto.Name;
        existingProducer.Address = producerDto.Address;

        // Save the changes
        bool updateSuccessful = await _productRepository.UpdateProducer(existingProducer);
        if (updateSuccessful)
        {
            return Ok(existingProducer); // Return the updated prod
        }

        _logger.LogWarning("[PorudctAPIController] Prodyuct update failed {@producer}", existingProducer);
        return StatusCode(500, "Internal server error");
    }

    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _productRepository.DeleteProducer(id);
        if (!returnOk)
        {
            _logger.LogError("[ProducerAPIController] Prod deletion failed for the ProducerId {ProducerId:0000}", id);
            return BadRequest("Prd deletion failed");
        }
        return NoContent(); // 200 Ok is commonly used when the server returns a response body with additional information about the result of the request. For a DELETE operation, there's generally no need to return additional data, making 204 NoContent a better fit.
    }  


}




public class ProducerController : Controller
{
    private readonly IProductRepository _productRepository;

    public ProducerController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    // Table view
    public async Task<IActionResult> Table()
    {
        var producers = await _productRepository.GetAllProducers();
        return View(producers);
    }

    // Create Producer
    [HttpGet]
    [Authorize]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(Producer producer)
    {
        if (ModelState.IsValid)
        {
            // Save producer in DB
            await _productRepository.CreateProducer(producer);
            return RedirectToAction(nameof(Table));
        }
        return View(producer);
    }

    // Update Producer
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Update(int id)
    {
        var producer = await _productRepository.GetProducerById(id);
        if (producer == null)
        {
            return NotFound();
        }
        return View(producer);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Update(Producer producer)
    {
        if (ModelState.IsValid)
        {
            await _productRepository.UpdateProducer(producer);
            return RedirectToAction(nameof(Table));
        }
        return View(producer);
    }

    // Delete Producer
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var producer = await _productRepository.GetProducerById(id);
        if (producer == null)
        {
            return NotFound();
        }
        return View(producer);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        await _productRepository.DeleteProducer(id);
        return RedirectToAction(nameof(Table));
    }
}