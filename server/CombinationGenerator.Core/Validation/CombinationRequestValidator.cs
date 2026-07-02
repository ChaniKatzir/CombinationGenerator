using CombinationGenerator.Core.Exceptions;
using System.Numerics;
namespace CombinationGenerator.Core.Validation;

public static class CombinationRequestValidator
{
    public const int MinN = 1;
    public const int MaxN = 20;
    public const int MaxPageSize = 100;

    public static void ValidateN(int n)
    {
        if (n < MinN || n > MaxN)
            throw new BusinessValidationException("n must be between 1 and 20.");
    }

    public static void ValidatePage(BigInteger pageNumber, int pageSize)
    {
        if (pageNumber < BigInteger.One)
            throw new BusinessValidationException("Page number must be greater than 0.");

        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new BusinessValidationException($"Page size must be between 1 and {MaxPageSize}.");
    }
}