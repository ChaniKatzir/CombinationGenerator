using System.Numerics;

namespace CombinationGenerator.Core.Models;

public class NextCombinationResult
{
    public BigInteger Index { get; set; }

    public int[] Values { get; set; } = [];

    public bool HasMore { get; set; }

    public string? Message { get; set; }
}