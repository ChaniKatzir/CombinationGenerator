using System.Numerics;

namespace CombinationGenerator.Core.Models;

public class CombinationsPageResult
{
    public BigInteger PageNumber { get; set; }

    public int PageSize { get; set; }

    public BigInteger TotalPages { get; set; }

    public BigInteger TotalPermutations { get; set; }

    public List<CombinationItem> Items { get; set; } = [];

    public bool HasMore { get; set; }

    public BigInteger StartIndex { get; set; }

    public BigInteger EndIndex { get; set; }
}