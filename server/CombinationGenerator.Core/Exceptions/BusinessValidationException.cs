using System.Net;

namespace CombinationGenerator.Core.Exceptions;

public class BusinessValidationException : AppException
{
    public BusinessValidationException(string message)
        : base(message, HttpStatusCode.BadRequest)
    {
    }
}