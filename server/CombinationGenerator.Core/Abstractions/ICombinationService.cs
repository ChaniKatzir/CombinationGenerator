using CombinationGenerator.Core.Models;

namespace CombinationGenerator.Core.Abstractions;

public interface ICombinationService
{
    StartCombinationResult Start(int n);

    NextCombinationResult GetNext(Guid sessionId);

    CombinationsPageResult GetPage(Guid sessionId, int pageNumber, int pageSize);

    NextCombinationResult ExitBrowse(Guid sessionId);

    void Reset(Guid sessionId);
}