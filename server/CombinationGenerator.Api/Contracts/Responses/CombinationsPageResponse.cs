namespace CombinationGenerator.Api.Contracts.Responses;

public class CombinationsPageResponse
{
    public int PageNumber { get; set; }

    public int PageSize { get; set; }

    public string TotalPermutations { get; set; } = string.Empty;

    public List<CombinationItemResponse> Items { get; set; } = [];

    public bool HasMore { get; set; }

    public string? Message { get; set; }
}