using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using FoodRegistrationTool.Services;

namespace FoodRegistrationTool.Areas.Identity;

[Area("Identity")]
public class AccountController : Controller
{
private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<AccountController> _logger;
    private readonly IReturnUrlProvider _returnUrlProvider;

    public AccountController(
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        ILogger<AccountController> logger,
        IReturnUrlProvider returnUrlProvider)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _logger = logger;
        _returnUrlProvider = returnUrlProvider;
    }

    [HttpPost]
    public async Task<IActionResult> Register(string email, string password, string returnUrl)// = null)
    {
        try
        {
            //returnUrl ??= Url.Content("~/");

            var user = new IdentityUser { UserName = email, Email = email };
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                _logger.LogInformation("User created a new account with password (accountcontroller).");
                await _signInManager.SignInAsync(user, isPersistent: false);
                
                /*
                if (Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                */

                // If returnUrl is external (like your React app)
                if (!string.IsNullOrEmpty(returnUrl) && _returnUrlProvider.IsValidReturnUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                
                return LocalRedirect("~/");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            // If we got this far, something failed
            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { error = "Registration failed", details = ex.Message });
        }
    }

[HttpPost]
    public async Task<IActionResult> Logout(string returnUrl)//= null)
    {
        _logger.LogInformation("Attempting to log out.");

        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out.");

        if (!string.IsNullOrEmpty(returnUrl) && _returnUrlProvider.IsValidReturnUrl(returnUrl))
        {
            return Redirect(returnUrl);
        }

        return LocalRedirect("~/");
    }
}