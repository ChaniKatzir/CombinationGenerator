using System.Numerics;
using CombinationGenerator.Core.Models;

namespace CombinationGenerator.Core.Abstractions;

public interface ICombinationService
{
    StartCombinationResult Start(int n);

    NextCombinationResult GetNext(Guid sessionId);

    CombinationsPageResult GetPage(Guid sessionId, BigInteger pageNumber, int pageSize);

    CombinationsPageResult ResizeBrowse(Guid sessionId, int pageSize);

    NextCombinationResult ExitBrowse(Guid sessionId);

    void Reset(Guid sessionId);
}