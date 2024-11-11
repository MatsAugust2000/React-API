using System;
using System.Collections.Generic;
using System.Linq;

namespace FoodRegistrationTool.Services;

public interface IReturnUrlProvider
{
    bool IsValidReturnUrl(string returnUrl);
}

public class ReturnUrlProvider : IReturnUrlProvider
{
    private readonly HashSet<string> _allowedHosts;
    private readonly bool _isDevelopment;

    public ReturnUrlProvider(IEnumerable<string> allowedUrls, bool isDevelopment = true)
    {
        _allowedHosts = new HashSet<string>(
            allowedUrls.Select(url => new Uri(url).Authority), 
            StringComparer.OrdinalIgnoreCase
        );
        _isDevelopment = isDevelopment;
    }

    public bool IsValidReturnUrl(string returnUrl)
    {
        if (string.IsNullOrEmpty(returnUrl)) return false;
        
        try
        {
            var uri = new Uri(returnUrl);
            
            // In development, allow any localhost URL
            if (_isDevelopment && uri.Authority.StartsWith("localhost"))
            {
                return true;
            }
            
            return _allowedHosts.Contains(uri.Authority);
        }
        catch
        {
            return false;
        }
    }
}