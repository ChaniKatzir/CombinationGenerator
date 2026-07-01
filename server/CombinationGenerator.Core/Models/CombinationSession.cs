using System.Numerics;

namespace CombinationGenerator.Core.Models;

public class CombinationSession
{
    public Guid SessionId { get; init; } = Guid.NewGuid();

    public int N { get; init; }

    public BigInteger CurrentIndex { get; set; } = BigInteger.Zero;

    public BigInteger? BrowseBaseIndex { get; set; }

    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    public DateTime LastAccessedAtUtc { get; set; } = DateTime.UtcNow;
}