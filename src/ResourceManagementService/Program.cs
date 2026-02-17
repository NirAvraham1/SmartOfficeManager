using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt; // נדרש לניקוי מפת ה-Claims

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

// 2. הוספת שירות Health Checks (ניטור תקינות עבור Docker)
builder.Services.AddHealthChecks();

builder.Services.AddControllers();

// 3. MongoDB Configuration with Resilience (Exponential Backoff)
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");
var mongoClient = new MongoClient(mongoSettings["ConnectionString"]);
var database = mongoClient.GetDatabase(mongoSettings["DatabaseName"]);

// בדיקת חיבור ל-MongoDB בזמן עליית השירות
int maxRetries = 5;
int delay = 2000;
for (int i = 1; i <= maxRetries; i++)
{
    try
    {
        // ניסיון ביצוע פקודה פשוטה כדי לוודא שה-DB זמין
        database.RunCommand((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
        Console.WriteLine("--> Connected to MongoDB successfully.");
        break;
    }
    catch (Exception ex)
    {
        if (i == maxRetries) throw;
        Console.WriteLine($"--> Attempt {i} failed: MongoDB not ready. Retrying in {delay/1000}s...");
        Thread.Sleep(delay);
        delay *= 2; // Exponential Backoff
    }
}

builder.Services.AddSingleton(database);
builder.Services.AddScoped<IAssetRepository, MongoAssetRepository>();

// 4. JWT Authentication Setup
// חשוב: מניעת שינוי שמות ה-Claims (כדי ש-Role יעבוד כמו שצריך)
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
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// 5. Middleware Pipeline
app.UseRouting();

app.UseCors("CorsPolicy"); 

// חשיפת נקודת קצה לבדיקת תקינות
app.MapHealthChecks("/health");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();