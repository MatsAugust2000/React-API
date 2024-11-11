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

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IReturnUrlProvider _returnUrlProvider;
    private readonly ILogger<AuthController> _logger;


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

    [HttpGet("userinfo")]
    public async Task<IActionResult> GetUserInfo()
    {
        try
        {
            var authResult = await HttpContext.AuthenticateAsync(IdentityConstants.ApplicationScheme);
            _logger.LogInformation($"Authentication result: {authResult?.Succeeded}");
            
            if (authResult?.Succeeded == true)
            {
                _logger.LogInformation($"Principal Name from auth result: {authResult.Principal?.Identity?.Name}");
                // Update the User property with the authenticated principal
                HttpContext.User = authResult.Principal;
            }
            // Log incoming request details
            _logger.LogInformation($"Request path: {Request.Path}");
            _logger.LogInformation($"Request method: {Request.Method}");
            _logger.LogInformation($"Request scheme: {Request.Scheme}");

            _logger.LogInformation($"Auth Type: {User?.Identity?.AuthenticationType}");
            _logger.LogInformation($"Identity Name: {User?.Identity?.Name}");
            
            var user = await _signInManager.UserManager.GetUserAsync(User);
            _logger.LogInformation($"User from UserManager: {user?.UserName ?? "null"}");
            
            // Log all cookies for debugging
            _logger.LogInformation("Cookies received: " + string.Join(", ", 
                Request.Cookies.Select(c => $"{c.Key}={c.Value}")));

            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            var userName = User.Identity?.Name;

            // Add more detailed logging
            _logger.LogInformation($"GetUserInfo called:");
            _logger.LogInformation($"IsAuthenticated: {isAuthenticated}");
            _logger.LogInformation($"UserName: {userName}");
            _logger.LogInformation($"Claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"))}");

            // Log claims for debugging
            foreach (var claim in User.Claims)
            {
                _logger.LogInformation($"Claim: {claim.Type} = {claim.Value}");
            }

            if (isAuthenticated && string.IsNullOrEmpty(userName))
            {
                // Try to get the user directly from SignInManager
                //var user = await _signInManager.UserManager.GetUserAsync(User);
                userName = user?.UserName;
                _logger.LogInformation($"Retrieved username from UserManager: {userName}");
            }

            var response = new
            {
                isAuthenticated = isAuthenticated,
                userName = userName,
                manageUrl = "/Identity/Account/Manage",
                logoutUrl = "/Identity/Account/Logout",
                loginUrl = "/Identity/Account/Login",
                registerUrl = "/Identity/Account/Register"
            };

            _logger.LogInformation($"Returning response: {System.Text.Json.JsonSerializer.Serialize(response)}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetUserInfo");
            return StatusCode(500, new { error = "Error retrieving user information" });
        }
        /*
        return Ok(new
        {
            
            isAuthenticated = _signInManager.IsSignedIn(User),
            userName = User.Identity?.Name,
            manageUrl = "/Identity/Account/Manage",
            logoutUrl = "/Identity/Account/Logout",
            loginUrl = "/Identity/Account/Login",
            registerUrl = "/Identity/Account/Register"
        });
        */
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "Auth controller is working" });
    }

    [Authorize(AuthenticationSchemes = "Identity.Application")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromQuery] string returnUrl)// = null) 
    {
        try
        {
            _logger.LogInformation("Attempting to log out");
            // Sign out from both Identity and Cookie authentication
            await _signInManager.SignOutAsync();
            await HttpContext.SignOutAsync("Identity.Application");

            _logger.LogInformation("User logged out successfully");

            if (!string.IsNullOrEmpty(returnUrl) && _returnUrlProvider.IsValidReturnUrl(returnUrl))
            {
                return Ok(new { redirectUrl = returnUrl });
            }

            return Ok(new { redirectUrl = "/" });

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { error = "Error during logout", details = ex.Message });
        }
    }
        
}