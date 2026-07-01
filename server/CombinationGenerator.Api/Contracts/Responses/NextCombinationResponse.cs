namespace CombinationGenerator.Api.Contracts.Responses;

public class NextCombinationResponse
{
    public string Index { get; set; } = string.Empty;

    public int[] Values { get; set; } = [];

    public bool HasMore { get; set; }

    public string? Message { get; set; }
}