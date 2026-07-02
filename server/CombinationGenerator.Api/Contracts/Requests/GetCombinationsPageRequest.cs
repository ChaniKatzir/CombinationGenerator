using System.Numerics;

namespace CombinationGenerator.Api.Contracts.Requests;

public class GetCombinationsPageRequest
{
    public Guid SessionId { get; set; }

    public string PageNumber { get; set; } = "1";

    public int PageSize { get; set; } = 10;
}