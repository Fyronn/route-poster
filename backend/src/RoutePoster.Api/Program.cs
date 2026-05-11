using Microsoft.EntityFrameworkCore;
using RoutePoster.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});

// Repositories
builder.Services.AddScoped(typeof(RoutePoster.Domain.Interfaces.IGenericRepository<>), typeof(RoutePoster.Infrastructure.Repositories.GenericRepository<>));
builder.Services.AddScoped<RoutePoster.Domain.Interfaces.IClientRepository, RoutePoster.Infrastructure.Repositories.ClientRepository>();
builder.Services.AddScoped<RoutePoster.Domain.Interfaces.IEmployeeRepository, RoutePoster.Infrastructure.Repositories.EmployeeRepository>();
builder.Services.AddScoped<RoutePoster.Domain.Interfaces.IStopRequestRepository, RoutePoster.Infrastructure.Repositories.StopRequestRepository>();
builder.Services.AddScoped<RoutePoster.Domain.Interfaces.IRouteRequestRepository, RoutePoster.Infrastructure.Repositories.RouteRequestRepository>();
builder.Services.AddScoped<RoutePoster.Domain.Interfaces.ITripRepository, RoutePoster.Infrastructure.Repositories.TripRepository>();
builder.Services.AddScoped<RoutePoster.Domain.Interfaces.IVehicleRepository, RoutePoster.Infrastructure.Repositories.VehicleRepository>();

// Services
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.IClientService, RoutePoster.Application.Services.ClientService>();
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.IEmployeeService, RoutePoster.Application.Services.EmployeeService>();
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.IStopRequestService, RoutePoster.Application.Services.StopRequestService>();
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.IRouteRequestService, RoutePoster.Application.Services.RouteRequestService>();
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.ITripService, RoutePoster.Application.Services.TripService>();
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.IVehicleService, RoutePoster.Application.Services.VehicleService>();
builder.Services.AddScoped<RoutePoster.Application.Services.Interfaces.IDriverService, RoutePoster.Application.Services.DriverService>();

builder.WebHost.UseUrls("http://0.0.0.0:5000");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
