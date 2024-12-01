using System;
using System.Collections.Generic;
using System.Linq;

namespace FoodRegistrationTool.Services;

// Interface defining the contract for return URL validation
public interface IReturnUrlProvider
{
    // Method to check if a given return URL is valid
    bool IsValidReturnUrl(string returnUrl);
}

// Implementation of the IReturnUrlProvider interface
public class ReturnUrlProvider : IReturnUrlProvider
{
    // A HashSet to store allowed hosts for return URLs
    private readonly HashSet<string> _allowedHosts;

    // A boolean flag to indicate if the application is in development mode
    private readonly bool _isDevelopment;

    // Constructor that initializes the allowed hosts and development mode flag
    public ReturnUrlProvider(IEnumerable<string> allowedUrls, bool isDevelopment = true)
    {
        // Populate the HashSet with the authority (host) of each allowed URL
        _allowedHosts = new HashSet<string>(
            allowedUrls.Select(url => new Uri(url).Authority), // Extract the authority (host) from each URL
            StringComparer.OrdinalIgnoreCase // Use case-insensitive comparison for host names
        );

        // Set the development mode flag
        _isDevelopment = isDevelopment;
    }

    // Method to validate a return URL
    public bool IsValidReturnUrl(string returnUrl)
    {
        // Check if the return URL is null or empty
        if (string.IsNullOrEmpty(returnUrl)) return false;
        
        try
        {
            // Attempt to create a Uri object from the return URL
            var uri = new Uri(returnUrl);
            
            // If in development mode, allow any localhost URL
            if (_isDevelopment && uri.Authority.StartsWith("localhost"))
            {
                return true; // Valid return URL in development mode
            }
            
            // Check if the authority (host) of the return URL is in the allowed hosts
            return _allowedHosts.Contains(uri.Authority);
        }
        catch
        {
            // If an exception occurs (e.g., invalid URL format), return false
            return false;
        }
    }
}