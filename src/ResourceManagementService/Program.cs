using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// 1. CORS Configuration
builder.Services.AddCors(opt => {
    opt.AddPolicy("CorsPolicy", policy => {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173")
              .AllowCredentials(); 
    });
});

// 2. Health Checks
builder.Services.AddHealthChecks();

builder.Services.AddControllers();

// 3. MongoDB Configuration with Resilience
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");
var mongoClient = new MongoClient(mongoSettings["ConnectionString"]);
var database = mongoClient.GetDatabase(mongoSettings["DatabaseName"]);

int maxRetries = 5;
int delay = 2000;
for (int i = 1; i <= maxRetries; i++)
{
    try
    {
        database.RunCommand((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
        Console.WriteLine("--> Connected to MongoDB successfully.");
        break;
    }
    catch (Exception)
    {
        if (i == maxRetries) throw;
        Console.WriteLine($"--> Attempt {i} failed: MongoDB not ready. Retrying...");
        Thread.Sleep(delay);
        delay *= 2;
    }
}

builder.Services.AddSingleton(database);
builder.Services.AddScoped<IAssetRepository, MongoAssetRepository>();

// 4. JWT Authentication Setup (מעודכן ל-Cookies)
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "YourSuperSecretKeyForSmartOffice2026!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["jwt"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// 5. Middleware Pipeline
app.UseRouting();

app.UseCors("CorsPolicy"); 

app.MapHealthChecks("/health");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();