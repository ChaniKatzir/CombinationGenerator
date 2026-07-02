using CombinationGenerator.Core.Exceptions;
using CombinationGenerator.Core.Validation;
using System.Numerics;

namespace CombinationGenerator.Core.Tests.Validation;

public class CombinationRequestValidatorTests
{
    [Theory]
    [InlineData(1)]
    [InlineData(10)]
    [InlineData(20)]
    public void ValidateN_WithValidN_DoesNotThrow(int n)
    {
        CombinationRequestValidator.ValidateN(n);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(21)]
    public void ValidateN_WithInvalidN_ThrowsBusinessValidationException(int n)
    {
        Assert.Throws<BusinessValidationException>(() =>
            CombinationRequestValidator.ValidateN(n));
    }

    [Fact]
    public void ValidatePage_WithValidPage_DoesNotThrow()
    {
        CombinationRequestValidator.ValidatePage(BigInteger.One, 10);
    }

    [Fact]
    public void ValidatePage_WithZeroPageNumber_ThrowsBusinessValidationException()
    {
        Assert.Throws<BusinessValidationException>(() =>
            CombinationRequestValidator.ValidatePage(BigInteger.Zero, 10));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(101)]
    public void ValidatePage_WithInvalidPageSize_ThrowsBusinessValidationException(int pageSize)
    {
        Assert.Throws<BusinessValidationException>(() =>
            CombinationRequestValidator.ValidatePage(BigInteger.One, pageSize));
    }
}