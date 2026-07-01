namespace CombinationGenerator.Core.Exceptions;

public class BusinessValidationException : Exception
{
    public BusinessValidationException(string message)
        : base(message)
    {
    }
}