namespace CombinationGenerator.Api.Contracts.Responses;

public class ApiResponse<T>
{
    public bool Success { get; set; }

    public int StatusCode { get; set; }

    public string? Message { get; set; }

    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            StatusCode = 200,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> Failure(int statusCode, string message)
    {
        return new ApiResponse<T>
        {
            Success = false,
            StatusCode = statusCode,
            Message = message,
            Data = default
        };
    }
}