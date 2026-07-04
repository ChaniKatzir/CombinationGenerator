using CombinationGenerator.Core.Algorithms;

namespace CombinationGenerator.Core.Tests.Algorithms;

public class LexicographicNextPermutationGeneratorTests
{
    [Fact]
    public void GetNext_FromFirstPermutation_ReturnsSecondPermutation()
    {
        var result = LexicographicNextPermutationGenerator.GetNext([1, 2, 3]);

        Assert.Equal([1, 3, 2], result);
    }

    [Fact]
    public void GetNext_FromMiddlePermutation_ReturnsNextPermutation()
    {
        var result = LexicographicNextPermutationGenerator.GetNext([2, 1, 3]);

        Assert.Equal([2, 3, 1], result);
    }

    [Fact]
    public void GetNext_FromLastPermutation_ReturnsEmptyArray()
    {
        var result = LexicographicNextPermutationGenerator.GetNext([3, 2, 1]);

        Assert.Empty(result);
    }
}