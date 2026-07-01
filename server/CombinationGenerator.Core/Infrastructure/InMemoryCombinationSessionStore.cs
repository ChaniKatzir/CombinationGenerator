using System.Collections.Concurrent;
using CombinationGenerator.Core.Abstractions;
using CombinationGenerator.Core.Models;

namespace CombinationGenerator.Core.Infrastructure;

public class InMemoryCombinationSessionStore : ICombinationSessionStore
{
    private readonly ConcurrentDictionary<Guid, CombinationSession> _sessions = new();

    public void Save(CombinationSession session)
    {
        session.LastAccessedAtUtc = DateTime.UtcNow;
        _sessions[session.SessionId] = session;
    }

    public CombinationSession? Get(Guid sessionId)
    {
        if (_sessions.TryGetValue(sessionId, out var session))
        {
            session.LastAccessedAtUtc = DateTime.UtcNow;
            return session;
        }

        return null;
    }

    public void Delete(Guid sessionId)
    {
        _sessions.TryRemove(sessionId, out _);
    }
}