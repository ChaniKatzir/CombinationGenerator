using CombinationGenerator.Core.Algorithms;
using Xunit;

namespace CombinationGenerator.Core.Tests.Algorithms;

public class PermutationByIndexCalculatorTests
{
    [Fact]
    public void GetByOneBasedIndex_WhenNIs3_ReturnsExpectedPermutations()
    {
        Assert.Equal([1, 2, 3], PermutationByIndexCalculator.GetByOneBasedIndex(3, 1));
        Assert.Equal([1, 3, 2], PermutationByIndexCalculator.GetByOneBasedIndex(3, 2));
        Assert.Equal([2, 1, 3], PermutationByIndexCalculator.GetByOneBasedIndex(3, 3));
        Assert.Equal([2, 3, 1], PermutationByIndexCalculator.GetByOneBasedIndex(3, 4));
        Assert.Equal([3, 1, 2], PermutationByIndexCalculator.GetByOneBasedIndex(3, 5));
        Assert.Equal([3, 2, 1], PermutationByIndexCalculator.GetByOneBasedIndex(3, 6));
    }
}