using CombinationGenerator.Core.Algorithms;
using System.Numerics;

namespace CombinationGenerator.Core.Tests.Algorithms;

public class FactorialCalculatorTests
{
    [Theory]
    [InlineData(0, "1")]
    [InlineData(1, "1")]
    [InlineData(3, "6")]
    [InlineData(5, "120")]
    [InlineData(20, "2432902008176640000")]
    public void Calculate_WithValidInput_ReturnsExpectedResult(int n, string expected)
    {
        var result = FactorialCalculator.Calculate(n);

        Assert.Equal(BigInteger.Parse(expected), result);
    }

    [Fact]
    public void Calculate_WithNegativeInput_ThrowsArgumentOutOfRangeException()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            FactorialCalculator.Calculate(-1));
    }
}