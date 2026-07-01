namespace CombinationGenerator.Api.Contracts.Responses;

public class StartCombinationSessionResponse
{
    public Guid SessionId { get; set; }

    public int N { get; set; }

    public string TotalPermutations { get; set; } = string.Empty;
}