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
using Microsoft.AspNetCore.Identity;
using FoodRegistrationTool.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using FoodRegistrationTool.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace FoodRegistrationTool.Controllers;

// Attribute to specify that this class is an API controller
[ApiController]
// Route attribute to define the base route for this controller
[Route("api/[controller]")]
public class AuthController : Controller
{
    // Dependency injection for SignInManager to handle user sign-in operations
    private readonly SignInManager<IdentityUser> _signInManager;
    // Dependency injection for UserManager to handle user-related operations
    private readonly UserManager<IdentityUser> _userManager;
    // Dependency injection for return URL validation service
    private readonly IReturnUrlProvider _returnUrlProvider;
    // Dependency injection for logging
    private readonly ILogger<AuthController> _logger;

    // Constructor to initialize dependencies
    public AuthController(
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        IReturnUrlProvider returnUrlProvider,
        ILogger<AuthController> logger)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _returnUrlProvider = returnUrlProvider;
        _logger = logger;
    }

    // Endpoint to get user information
    [HttpGet("userinfo")]
    public async Task<IActionResult> GetUserInfo()
    {
        try
        {
            // Authenticate the user using the application scheme
            var authResult = await HttpContext.AuthenticateAsync(IdentityConstants.ApplicationScheme);
            _logger.LogInformation($"Authentication result: {authResult?.Succeeded}");
            
            // If authentication succeeded, update the HttpContext.User
            if (authResult?.Succeeded == true)
            {
                _logger.LogInformation($"Principal Name from auth result: {authResult.Principal?.Identity?.Name}");
                HttpContext.User = authResult.Principal;
            }

            // Log details about the incoming request
            _logger.LogInformation($"Request path: {Request.Path}");
            _logger.LogInformation($"Request method: {Request.Method}");
            _logger.LogInformation($"Request scheme: {Request.Scheme}");

            // Log authentication type and identity name
            _logger.LogInformation($"Auth Type: {User?.Identity?.AuthenticationType}");
            _logger.LogInformation($"Identity Name: {User?.Identity?.Name}");
            
            // Retrieve the user associated with the current context
            var user = await _signInManager.UserManager.GetUserAsync(User);
            _logger.LogInformation($"User from UserManager: {user?.UserName ?? "null"}");
            
            // Log all cookies for debugging purposes
            _logger.LogInformation("Cookies received: " + string.Join(", ", 
                Request.Cookies.Select(c => $"{c.Key}={c.Value}")));

            // Check if the user is authenticated and retrieve the username
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            var userName = User.Identity?.Name;

            // Log detailed information about the authentication status
            _logger.LogInformation($"GetUserInfo called:");
            _logger.LogInformation($"IsAuthenticated: {isAuthenticated}");
            _logger.LogInformation($"UserName: {userName}");
            _logger.LogInformation($"Claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"))}");

            // Log claims for debugging
            foreach (var claim in User.Claims)
            {
                _logger.LogInformation($"Claim: {claim.Type} = {claim.Value}");
            }

            // If authenticated but username is empty, try to retrieve it from UserManager
            if (isAuthenticated && string.IsNullOrEmpty(userName))
            {
                userName = user?.UserName;
                _logger.LogInformation($"Retrieved username from UserManager: {userName}");
            }

            // Prepare the response object with user information
            var response = new
            {
                isAuthenticated = isAuthenticated,
                userName = userName,
                manageUrl = "/Identity/Account/Manage",
                logoutUrl = "/Identity/Account/Logout",
                loginUrl = "/Identity/Account/Login",
                registerUrl = "/Identity/Account/Register"
            };

            // Log the response before returning
            _logger.LogInformation($"Returning response: {System.Text.Json.JsonSerializer.Serialize(response)}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            // Log any exceptions that occur during the process
            _logger.LogError(ex, "Error in GetUserInfo");
            return StatusCode(500, new { error = "Error retrieving user information" });
        }
    }

    // Test endpoint to verify that the AuthController is working
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "Auth controller is working" });
    }

    // Endpoint to log out the user
    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromQuery] string returnUrl) 
    {
        try
        {
            _logger.LogInformation("Attempting to log out");
            // Sign out from both Identity and Cookie authentication
            await _signInManager.SignOutAsync();
            await HttpContext.SignOutAsync("Identity.Application");

            _logger.LogInformation("User logged out successfully");

            // Validate the return URL and redirect if valid
            if (!string.IsNullOrEmpty(returnUrl) && _returnUrlProvider.IsValidReturnUrl(returnUrl))
            {
                return Ok(new { redirectUrl = returnUrl });
            }

            // Default redirect to home if return URL is invalid
            return Ok(new { redirectUrl = "/" });
        }
        catch (Exception ex)
        {
            // Log any exceptions that occur during logout
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { error = "Error during logout", details = ex.Message });
        }
    }
}