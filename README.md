# itpe3200
Hjemmeeksamen i ITPE320 - Webapplikasjoner

Launch app:
API (ASP.NET) - f5 (debug) alternatively - dotnet build api/api.csproj
Frontend (React) - npm start (in React directory)

Info:
The auth is provided by .NET scaffolding and cookies. So the browser may remember the user and may log in with said user automatically even in a new session where the DB is deleted.
 Clear cookies for the browser for complete removal of user. 

For dokumentering:
Fått til authentication og authorization med .NET scaffolding som API, sammen med Cookie-policy for å kunne kommunisere med klienten (React). På API-nivå er det lagt til ny mappe Services med fil ReturnUrlProvider.cs, denne ble lagd for å kunne returnere fra API-nivå tilbake til klienten (api = localhost:5194, klient = localhost:3000). I Controllers er AuthController.cs lagt til for å kunne håndtere requests for authentication mellom api og klient. I Areas er AccountController.cs ny for å håndtere Register, Login og Logout, det var enklere å gjøre det slik enn på hver eneste fil for disse operasjonene i Areas. 
I frontenden er AuthContext og Service lagt under Shared for å håndtere POST og GET requests mellom klient og API. 
Mer senere ...
