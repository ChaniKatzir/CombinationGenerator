namespace CombinationGenerator.Api.Contracts.Responses;

public class CombinationsPageResponse
{
    public string PageNumber { get; set; }

    public int PageSize { get; set; }

    public string TotalPermutations { get; set; } = string.Empty;

    public List<CombinationItemResponse> Items { get; set; } = [];

    public bool HasMore { get; set; }

    public string? Message { get; set; }

    public string BrowseBaseIndex { get; set; } = string.Empty;

    public string StartIndex { get; set; } = string.Empty;

    public string EndIndex { get; set; } = string.Empty;
}