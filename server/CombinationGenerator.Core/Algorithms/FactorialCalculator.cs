using System.Numerics;

namespace CombinationGenerator.Core.Algorithms;

public static class FactorialCalculator
{
    public static BigInteger Calculate(int n)
    {
        if (n < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(n), "n must be non-negative.");
        }

        BigInteger result = BigInteger.One;

        for (int i = 2; i <= n; i++)
        {
            result *= i;
        }

        return result;
    }
}