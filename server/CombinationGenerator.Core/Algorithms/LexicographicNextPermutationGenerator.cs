namespace CombinationGenerator.Core.Algorithms;

public static class LexicographicNextPermutationGenerator
{
    public static int[] GetNext(int[] current)
    {
        var result = current.ToArray();

        var i = result.Length - 2;

        while (i >= 0 && result[i] >= result[i + 1])
            i--;

        if (i < 0)
            return [];

        var j = result.Length - 1;

        while (result[j] <= result[i])
            j--;

        (result[i], result[j]) = (result[j], result[i]);

        Array.Reverse(result, i + 1, result.Length - i - 1);

        return result;
    }
}