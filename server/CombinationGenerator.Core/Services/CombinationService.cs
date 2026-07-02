using System.Numerics;
using CombinationGenerator.Core.Abstractions;
using CombinationGenerator.Core.Algorithms;
using CombinationGenerator.Core.Models;
using CombinationGenerator.Core.Validation;
using CombinationGenerator.Core.Exceptions;

namespace CombinationGenerator.Core.Services;

public class CombinationService : ICombinationService
{
    private readonly ICombinationSessionStore _sessionStore;

    public CombinationService(ICombinationSessionStore sessionStore)
    {
        _sessionStore = sessionStore;
    }

    public StartCombinationResult Start(int n)
    {
        CombinationRequestValidator.ValidateN(n);

        var session = new CombinationSession
        {
            N = n
        };

        _sessionStore.Save(session);

        return new StartCombinationResult
        {
            SessionId = session.SessionId,
            N = n,
            TotalPermutations = FactorialCalculator.Calculate(n)
        };
    }

    public NextCombinationResult GetNext(Guid sessionId)
    {
        var session = GetSessionOrThrow(sessionId);
        var total = FactorialCalculator.Calculate(session.N);

        if (session.CurrentIndex >= total)
        {
            return new NextCombinationResult
            {
                Index = session.CurrentIndex,
                HasMore = false,
                Message = "No more combinations."
            };
        }

        var nextIndex = session.CurrentIndex + BigInteger.One;
        var values = PermutationByIndexCalculator.GetByOneBasedIndex(session.N, nextIndex);

        session.CurrentIndex = nextIndex;
        session.BrowseBaseIndex = null;
        session.LastBrowseStartIndex = null;
        _sessionStore.Save(session);

        return new NextCombinationResult
        {
            Index = nextIndex,
            Values = values,
            HasMore = nextIndex < total
        };
    }

    public CombinationsPageResult GetPage(Guid sessionId, BigInteger pageNumber, int pageSize)
    {
        CombinationRequestValidator.ValidatePage(pageNumber, pageSize);

        var session = GetSessionOrThrow(sessionId);
        var total = FactorialCalculator.Calculate(session.N);

        session.BrowseBaseIndex ??= session.CurrentIndex;

        var remaining = total - session.BrowseBaseIndex.Value;
        var lastPage = (remaining + pageSize - 1) / pageSize;

        if (pageNumber > lastPage)
            throw new BusinessValidationException("Page number is outside the available range.");

        var startIndex =
            session.BrowseBaseIndex.Value
            + BigInteger.One
            + ((pageNumber - BigInteger.One) * pageSize);

        var items = new List<CombinationItem>();

        for (var i = 0; i < pageSize; i++)
        {
            var index = startIndex + i;

            if (index > total)
                break;

            items.Add(new CombinationItem
            {
                Index = index,
                Values = PermutationByIndexCalculator.GetByOneBasedIndex(session.N, index)
            });
        }

        if (items.Count > 0)
            session.CurrentIndex = items[^1].Index;

        session.LastBrowseStartIndex =items.Count > 0? items[0].Index: null;

        _sessionStore.Save(session);

        return new CombinationsPageResult
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPermutations = total,
            BrowseBaseIndex = session.BrowseBaseIndex.Value,
            StartIndex = items.Count > 0 ? items[0].Index : BigInteger.Zero,
            EndIndex = items.Count > 0 ? items[^1].Index : BigInteger.Zero,
            Items = items,
            HasMore = items.Count > 0 && items[^1].Index < total
        };
    }

    public NextCombinationResult ExitBrowse(Guid sessionId)
    {
        var session = GetSessionOrThrow(sessionId);
        var total = FactorialCalculator.Calculate(session.N);

        session.BrowseBaseIndex = null;
        session.LastBrowseStartIndex = null;
        _sessionStore.Save(session);

        var values = session.CurrentIndex > 0
            ? PermutationByIndexCalculator.GetByOneBasedIndex(session.N, session.CurrentIndex)
            : [];

        _sessionStore.Save(session);

        return new NextCombinationResult
        {
            Index = session.CurrentIndex,
            Values = values,
            HasMore = session.CurrentIndex < total
        };
    }

    public CombinationsPageResult ResizeBrowse(Guid sessionId, int pageSize)
    {
        CombinationRequestValidator.ValidatePage(BigInteger.One, pageSize);

        var session = GetSessionOrThrow(sessionId);

        if (session.LastBrowseStartIndex is null || session.BrowseBaseIndex is null)
        {
            throw new BusinessValidationException("Browse mode has not been started.");
        }

        var offset = session.LastBrowseStartIndex.Value - session.BrowseBaseIndex.Value;

        var targetPage = (offset / pageSize) + BigInteger.One;


        return GetPage(sessionId, targetPage, pageSize);
    }
    public void Reset(Guid sessionId)
    {
        _sessionStore.Delete(sessionId);
    }

    private CombinationSession GetSessionOrThrow(Guid sessionId)
    {
        return _sessionStore.Get(sessionId)
            ?? throw new SessionNotFoundException(sessionId);
    }

   
}