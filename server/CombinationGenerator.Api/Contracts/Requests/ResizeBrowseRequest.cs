namespace CombinationGenerator.Api.Contracts.Requests;

public class ResizeBrowseRequest
{
    public Guid SessionId { get; set; }

    public int PageSize { get; set; }
}