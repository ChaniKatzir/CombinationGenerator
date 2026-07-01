namespace CombinationGenerator.Api.Contracts.Responses;

public class CombinationItemResponse
{
    public string Index { get; set; } = string.Empty;

    public int[] Values { get; set; } = [];
}