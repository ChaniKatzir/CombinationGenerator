using System.Numerics;

namespace CombinationGenerator.Core.Algorithms;

public static class PermutationByIndexCalculator
{
    public static int[] GetByOneBasedIndex(int n, BigInteger oneBasedIndex)
    {
        if (n <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(n), "n must be positive.");
        }

        var totalPermutations = FactorialCalculator.Calculate(n);

        if (oneBasedIndex < 1 || oneBasedIndex > totalPermutations)
        {
            throw new ArgumentOutOfRangeException(nameof(oneBasedIndex), "Index is outside the valid permutation range.");
        }

        var availableNumbers = Enumerable.Range(1, n).ToList();
        var result = new int[n];

        var zeroBasedIndex = oneBasedIndex - 1;

        for (int position = 0; position < n; position++)
        {
            var remainingPositions = n - position - 1;
            var blockSize = FactorialCalculator.Calculate(remainingPositions);

            var selectedNumberIndex = (int)(zeroBasedIndex / blockSize);

            result[position] = availableNumbers[selectedNumberIndex];

            availableNumbers.RemoveAt(selectedNumberIndex);

            zeroBasedIndex %= blockSize;
        }

        return result;
    }
}