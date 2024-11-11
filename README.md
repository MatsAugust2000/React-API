# itpe3200
Hjemmeeksamen i ITPE320 - Webapplikasjoner

NB!
Etter å ha lagt til nye klasser under Controller og Models-mappene, utfør følgende kommandoer i terminalen for å unngå feilmeldinger under build og for å holde migrations og DB oppdatert:

dotnet ef migrations add FoodRegistryDbExpanded + tall

dotnet ef database update

TODO: 
Build -
ProductController.cs(196,55): warning CS8604: Possible null reference argument for parameter 'products' in -
    'ProductsViewModel.ProductsViewModel(IEnumerable<Product> products, string? currentViewName)'.
ProductController.cs(203,55): warning CS8604: Possible null reference argument for parameter 'products'.
ProductController.cs(372,38): lacks await. ***
AuthController.cs(57,36): warning CS8601: Possible null reference assignment.
AuthController.cs(67,70): warning CS8604: Possible null reference argument for parameter 'principal' in -
    'Task<IdentityUser?> UserManager<IdentityUser>.GetUserAsync(ClaimsPrincipal principal)'.
ProductController.cs(145,38): lacks await. ***
Program.cs(63,29): warning ASP0000: Calling 'BuildServiceProvider' from application code results in an additional-
    copy of singleton services being created. Consider alternatives such as dependency injecting services as- parameters to 'Configure'. (https://aka.ms/AA5k895)
