using System.Numerics;

namespace CombinationGenerator.Core.Models;

public class CombinationItem
{
    public BigInteger Index { get; set; }

    public int[] Values { get; set; } = [];
}