using System.Numerics;

namespace CombinationGenerator.Core.Models;

public class CombinationsPageResult
{
    public int PageNumber { get; set; }

    public int PageSize { get; set; }

    public BigInteger TotalPermutations { get; set; }

    public List<CombinationItem> Items { get; set; } = [];

    public bool HasMore { get; set; }

    public string? Message { get; set; }
}