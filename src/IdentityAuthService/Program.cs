using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using IdentityAuthService.Data;
using IdentityAuthService.Models;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHealthChecks();

builder.Services.AddScoped<IUserRepository, SqlUserRepository>();

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    int maxRetries = 5;
    int delayMilliseconds = 2000; 

    for (int i = 1; i <= maxRetries; i++) {
        try {
            var context = services.GetRequiredService<AppDbContext>();
            context.Database.Migrate();
            logger.LogInformation("--> Database migration applied successfully.");
            break; 
        } catch (Exception ex) {
            if (i == maxRetries) {
                logger.LogError($"--> Final attempt failed. Database not ready. Error: {ex.Message}");
                throw;
            }
            logger.LogWarning($"--> Attempt {i} failed. Retrying in {delayMilliseconds/1000}s (Exponential Backoff)...");
            Thread.Sleep(delayMilliseconds);
            delayMilliseconds *= 2; 
        }
    }
}

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Identity API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowReact");

app.MapHealthChecks("/health");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();