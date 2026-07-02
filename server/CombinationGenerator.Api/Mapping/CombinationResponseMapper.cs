using CombinationGenerator.Api.Contracts.Responses;
using CombinationGenerator.Core.Models;

namespace CombinationGenerator.Api.Mapping;

public static class CombinationResponseMapper
{
    public static StartCombinationSessionResponse ToResponse(StartCombinationResult result)
    {
        return new StartCombinationSessionResponse
        {
            SessionId = result.SessionId,
            N = result.N,
            TotalPermutations = result.TotalPermutations.ToString()
        };
    }

    public static NextCombinationResponse ToResponse(NextCombinationResult result)
    {
        return new NextCombinationResponse
        {
            Index = result.Index.ToString(),
            Values = result.Values,
            HasMore = result.HasMore,
            Message = result.Message
        };
    }

    public static CombinationsPageResponse ToResponse(CombinationsPageResult result)
    {
        return new CombinationsPageResponse
        {
            PageNumber = result.PageNumber.ToString(),
            PageSize = result.PageSize,
            TotalPermutations = result.TotalPermutations.ToString(),
            HasMore = result.HasMore,
            Items = result.Items.Select(item => new CombinationItemResponse
            {
                Index = item.Index.ToString(),
                Values = item.Values
            }).ToList(),
            BrowseBaseIndex = result.BrowseBaseIndex.ToString(),
            StartIndex = result.StartIndex.ToString(),
            EndIndex = result.EndIndex.ToString(),
        };
    }
}