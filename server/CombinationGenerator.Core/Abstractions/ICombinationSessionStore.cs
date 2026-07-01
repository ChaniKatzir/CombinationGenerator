using CombinationGenerator.Core.Models;

namespace CombinationGenerator.Core.Abstractions;

public interface ICombinationSessionStore
{
    void Save(CombinationSession session);

    CombinationSession? Get(Guid sessionId);

    void Delete(Guid sessionId);
}