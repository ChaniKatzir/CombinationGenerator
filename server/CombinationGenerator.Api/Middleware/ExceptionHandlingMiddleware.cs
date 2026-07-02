using System.Net;
using System.Text.Json;
using CombinationGenerator.Api.Contracts.Responses;
using CombinationGenerator.Core.Exceptions;

namespace CombinationGenerator.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (BusinessValidationException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.BadRequest,
                ex.Message);
        }
        catch (SessionNotFoundException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.NotFound,
                ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unhandled exception while processing request {Method} {Path}.",
                context.Request.Method,
                context.Request.Path);

            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.InternalServerError,
                "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorResponseAsync(
        HttpContext context,
        HttpStatusCode statusCode,
        string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.Failure(
            (int)statusCode,
            message);

        var json = JsonSerializer.Serialize(response);

        await context.Response.WriteAsync(json);
    }
}