using DrugInventoryTracker.Data;
using DrugInventoryTracker.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200", "https://orange-wave-021cbcc00.1.azurestaticapps.net")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token here"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DrugInventory API v1");
    c.RoutePrefix = string.Empty;
});

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Seed Drugs
    if (!db.Drugs.Any())
    {
        db.Drugs.AddRange(
            new Drug
            {
                Name = "Paracetamol 500mg",
                Category = "Tablet",
                Unit = "Strip",
                Description = "Used for fever and pain relief",
                LowStockThreshold = 50
            },
            new Drug
            {
                Name = "Amoxicillin 250mg",
                Category = "Capsule",
                Unit = "Strip",
                Description = "Antibiotic for bacterial infections",
                LowStockThreshold = 30
            },
            new Drug
            {
                Name = "Cetirizine 10mg",
                Category = "Tablet",
                Unit = "Strip",
                Description = "Used for allergies",
                LowStockThreshold = 40
            },
            new Drug
            {
                Name = "ORS Powder",
                Category = "Sachet",
                Unit = "Packet",
                Description = "Used for dehydration",
                LowStockThreshold = 100
            },
            new Drug
            {
                Name = "Cough Syrup DX",
                Category = "Syrup",
                Unit = "Bottle",
                Description = "Used for cough relief",
                LowStockThreshold = 20
            }
        );

        db.SaveChanges();
    }

    // Seed Suppliers
    if (!db.Suppliers.Any())
    {
        db.Suppliers.AddRange(
            new Supplier
            {
                Name = "Medico Distributors Pvt Ltd",
                Phone = "9876543210",
                ContactEmail = "sales@medico.com",
                Address = "Ahmedabad, Gujarat"
            },
            new Supplier
            {
                Name = "Apollo Pharma Wholesale",
                Phone = "9012345678",
                ContactEmail = "apollo.wholesale@gmail.com",
                Address = "Mumbai, Maharashtra"
            },
            new Supplier
            {
                Name = "Lifecare Medical Supplies",
                Phone = "9988776655",
                ContactEmail = "lifecare.supplies@outlook.com",
                Address = "Bengaluru, Karnataka"
            }
        );

        db.SaveChanges();
    }
}

app.Run();