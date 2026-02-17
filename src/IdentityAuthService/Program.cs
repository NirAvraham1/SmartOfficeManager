using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using IdentityAuthService.Data;
using IdentityAuthService.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. הגדרת בסיס הנתונים (PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. הוספת שירות Health Checks (לניטור תקינות השירות ע"י Docker)
builder.Services.AddHealthChecks();

// 3. רישום ה-Repository (שיפור ארכיטקטורה - Dependency Injection)
builder.Services.AddScoped<IUserRepository, SqlUserRepository>();

// 4. הגדרות אימות JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyStr = jwtSettings["Key"] ?? "YourSuperSecretKeyForSmartOffice2026!";
var key = Encoding.ASCII.GetBytes(keyStr);

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddControllers();

// 5. הגדרות Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 6. הגדרת CORS עבור ה-Frontend
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 7. חוסן מערכת (Resilience): הרצת מיגרציות עם Exponential Backoff
// פותר את הבעיה שה-Backend עולה לפני שה-Postgres מוכן
using (var scope = app.Services.CreateScope()) {
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    int maxRetries = 5;
    int delayMilliseconds = 2000; // זמן המתנה התחלתי של 2 שניות

    for (int i = 1; i <= maxRetries; i++) {
        try {
            var context = services.GetRequiredService<AppDbContext>();
            context.Database.Migrate();
            logger.LogInformation("--> Database migration applied successfully.");
            break; // הצלחה - יוצאים מהלולאה
        } catch (Exception ex) {
            if (i == maxRetries) {
                logger.LogError($"--> Final attempt failed. Database not ready. Error: {ex.Message}");
                throw; // קריסה מבוקרת לאחר 5 ניסיונות
            }
            logger.LogWarning($"--> Attempt {i} failed. Retrying in {delayMilliseconds/1000}s (Exponential Backoff)...");
            Thread.Sleep(delayMilliseconds);
            delayMilliseconds *= 2; // הכפלת זמן ההמתנה בכל ניסיון
        }
    }
}

// 8. הגדרת ה-Middleware Pipeline
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowReact");

// נקודת קצה לבדיקת תקינות
app.MapHealthChecks("/health");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();