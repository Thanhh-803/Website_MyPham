using CartService.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CartService.Model;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Chỉ cần khai báo builder một lần thôi
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = Directory.GetCurrentDirectory(),
    EnvironmentName = Environments.Development
});

// Load file cấu hình appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Frontend của bạn
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Cấu hình Authentication với JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])); // Lấy JWT Secret Key từ cấu hình

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Đảm bảo lấy giá trị từ cấu hình
            ValidAudience = builder.Configuration["Jwt:Audience"], // Đảm bảo lấy giá trị từ cấu hình
            IssuerSigningKey = key // Gán key vào IssuerSigningKey
        };
    });


// Phân quyền theo role
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
    options.AddPolicy("UserOrAdmin", policy =>
    {
        policy.RequireRole("User", "Admin");
    });
});

// Kết nối database
builder.Services.AddDbContext<CartDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.OAuthClientId("swagger-ui-client-id");
        c.OAuthClientSecret("swagger-ui-client-secret");
        c.OAuthUsePkce();
    });
}

// Cấu hình CORS trước khi Routing
app.UseCors(MyAllowSpecificOrigins);

// Đảm bảo UseRouting được gọi trước Authentication và Authorization
app.UseRouting();

// Cấu hình Authentication và Authorization
app.UseAuthentication();  // Đảm bảo Authentication phải được gọi trước Authorization
app.UseAuthorization();

// Cấu hình HTTPS redirection (nếu cần)
app.UseHttpsRedirection();

// Đảm bảo Mapping controllers ở cuối cùng
app.MapControllers();

app.Run();
