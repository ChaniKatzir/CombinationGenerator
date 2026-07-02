using CombinationGenerator.Core.Models;
using System.Numerics;
namespace CombinationGenerator.Core.Abstractions;

public interface ICombinationService
{
    StartCombinationResult Start(int n);

    NextCombinationResult GetNext(Guid sessionId);

    CombinationsPageResult GetPage(Guid sessionId, BigInteger pageNumber, int pageSize);

    NextCombinationResult ExitBrowse(Guid sessionId);

    void Reset(Guid sessionId);
}