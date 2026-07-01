using System.Numerics;

namespace CombinationGenerator.Core.Models;

public class StartCombinationResult
{
    public Guid SessionId { get; set; }

    public int N { get; set; }

    public BigInteger TotalPermutations { get; set; }
}