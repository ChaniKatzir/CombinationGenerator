using CombinationGenerator.Core.Models;
using System.Numerics;
namespace CombinationGenerator.Core.Abstractions;

public interface ICombinationSessionStore
{
    void Save(CombinationSession session);

    CombinationSession? Get(Guid sessionId);

    void Delete(Guid sessionId);

    CombinationsPageResult ResizeBrowse(Guid sessionId, int pageSize);
}