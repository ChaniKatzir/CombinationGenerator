using CombinationGenerator.Core.Abstractions;
using CombinationGenerator.Core.Exceptions;
using CombinationGenerator.Core.Infrastructure;
using CombinationGenerator.Core.Services;

namespace CombinationGenerator.Core.Tests.Services;

public class CombinationServiceTests
{
    private static CombinationService CreateService()
    {
        ICombinationSessionStore store = new InMemoryCombinationSessionStore();
        return new CombinationService(store);
    }

    [Fact]
    public void Start_WithValidN_CreatesSessionAndReturnsTotalPermutations()
    {
        var service = CreateService();

        var result = service.Start(3);

        Assert.NotEqual(Guid.Empty, result.SessionId);
        Assert.Equal(3, result.N);
        Assert.Equal("6", result.TotalPermutations.ToString());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(21)]
    public void Start_WithInvalidN_ThrowsBusinessValidationException(int n)
    {
        var service = CreateService();

        Assert.Throws<BusinessValidationException>(() =>
            service.Start(n));
    }

    [Fact]
    public void GetNext_FirstCall_ReturnsFirstPermutation()
    {
        var service = CreateService();
        var start = service.Start(3);

        var result = service.GetNext(start.SessionId);

        Assert.Equal("1", result.Index.ToString());
        Assert.Equal([1, 2, 3], result.Values);
        Assert.True(result.HasMore);
    }

    [Fact]
    public void GetNext_MultipleCalls_ReturnsSequentialPermutations()
    {
        var service = CreateService();
        var start = service.Start(3);

        var first = service.GetNext(start.SessionId);
        var second = service.GetNext(start.SessionId);
        var third = service.GetNext(start.SessionId);

        Assert.Equal([1, 2, 3], first.Values);
        Assert.Equal([1, 3, 2], second.Values);
        Assert.Equal([2, 1, 3], third.Values);
    }

    [Fact]
    public void GetNext_WhenSessionDoesNotExist_ThrowsSessionNotFoundException()
    {
        var service = CreateService();

        Assert.Throws<SessionNotFoundException>(() =>
            service.GetNext(Guid.NewGuid()));
    }

    [Fact]
    public void GetPage_FirstBrowsePage_StartsAfterCurrentIndex()
    {
        var service = CreateService();
        var start = service.Start(3);

        service.GetNext(start.SessionId); // index 1

        var page = service.GetPage(start.SessionId, 1, 2);

        Assert.Equal("1", page.PageNumber.ToString());
        Assert.Equal(2, page.PageSize);
        Assert.Equal(2, page.Items.Count);
        Assert.Equal("2", page.Items[0].Index.ToString());
        Assert.Equal([1, 3, 2], page.Items[0].Values);
        Assert.Equal("3", page.Items[1].Index.ToString());
        Assert.Equal([2, 1, 3], page.Items[1].Values);
    }

    [Fact]
    public void GetPage_SecondPage_ReturnsNextItemsRelativeToBrowseStart()
    {
        var service = CreateService();
        var start = service.Start(3);

        service.GetNext(start.SessionId); // CurrentIndex = 1

        var page = service.GetPage(start.SessionId, 2, 2);

        Assert.Equal("2", page.PageNumber.ToString());
        Assert.Equal("4", page.Items[0].Index.ToString());
        Assert.Equal([2, 3, 1], page.Items[0].Values);
    }

    [Fact]
    public void ExitBrowse_ReturnsLastDisplayedBrowseCombination()
    {
        var service = CreateService();
        var start = service.Start(3);

        service.GetNext(start.SessionId);
        service.GetPage(start.SessionId, 1, 2); // last displayed index = 3

        var result = service.ExitBrowse(start.SessionId);

        Assert.Equal("3", result.Index.ToString());
        Assert.Equal([2, 1, 3], result.Values);
    }

    [Fact]
    public void Reset_RemovesSession()
    {
        var service = CreateService();
        var start = service.Start(3);

        service.Reset(start.SessionId);

        Assert.Throws<SessionNotFoundException>(() =>
            service.GetNext(start.SessionId));
    }

    [Fact]
    public void ResizeBrowse_WithExistingBrowseState_ReturnsPageContainingPreviousStartIndex()
    {
        var service = CreateService();
        var start = service.Start(4);

        service.GetPage(start.SessionId, 2, 5);

        var resized = service.ResizeBrowse(start.SessionId, 10);

        Assert.Equal(10, resized.PageSize);
        Assert.NotEmpty(resized.Items);
    }

    [Fact]
    public void ResizeBrowse_WithoutBrowseState_ThrowsBusinessValidationException()
    {
        var service = CreateService();
        var start = service.Start(4);

        Assert.Throws<BusinessValidationException>(() =>
            service.ResizeBrowse(start.SessionId, 10));
    }
}