namespace CombinationGenerator.Core.Exceptions;

public class SessionNotFoundException : Exception
{
    public SessionNotFoundException(Guid sessionId)
        : base($"Session '{sessionId}' was not found.")
    {
    }
}