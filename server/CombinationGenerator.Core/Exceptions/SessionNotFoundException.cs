using System.Net;

namespace CombinationGenerator.Core.Exceptions;

public class SessionNotFoundException : AppException
{
    public SessionNotFoundException(Guid sessionId)
        : base(
            $"Session '{sessionId}' was not found.",
            HttpStatusCode.NotFound)
    {
    }
}