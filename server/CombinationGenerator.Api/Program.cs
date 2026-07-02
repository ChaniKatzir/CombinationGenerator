using CombinationGenerator.Core.Abstractions;
using CombinationGenerator.Core.Infrastructure;
using CombinationGenerator.Core.Services;
using CombinationGenerator.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

const string AngularClientCorsPolicy = "AngularClient";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(AngularClientCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<ICombinationSessionStore, InMemoryCombinationSessionStore>();
builder.Services.AddScoped<ICombinationService, CombinationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors(AngularClientCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();