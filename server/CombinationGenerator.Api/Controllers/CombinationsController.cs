using Microsoft.AspNetCore.Mvc;

namespace CombinationGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CombinationsController : ControllerBase
{
    [HttpPost("start")]
    public IActionResult Start([FromBody] StartCombinationSessionRequest request)
    {
        return Ok(new
        {
            success = true,
            statusCode = 200,
            message = "Session started successfully",
            data = new
            {
                sessionId = Guid.NewGuid(),
                n = request.N,
                totalPermutations = "6"
            }
        });
    }

    [HttpPost("next")]
    public IActionResult GetNext([FromBody] SessionRequest request)
    {
        return Ok(new
        {
            success = true,
            statusCode = 200,
            message = "Next combination returned successfully",
            data = new
            {
                index = "1",
                values = new[] { 1, 2, 3 },
                hasMore = true
            }
        });
    }

    [HttpPost("browse/start")]
    public IActionResult StartBrowse([FromBody] SessionRequest request)
    {
        return Ok(new
        {
            success = true,
            statusCode = 200,
            message = "Browse mode started",
            data = true
        });
    }

    [HttpPost("browse/page")]
    public IActionResult GetPage([FromBody] GetCombinationsPageRequest request)
    {
        return Ok(new
        {
            success = true,
            statusCode = 200,
            message = "Page returned successfully",
            data = new
            {
                pageNumber = request.PageNumber,
                pageSize = request.PageSize,
                items = new[]
                {
                    new { index = "1", values = new[] { 1, 2, 3 } },
                    new { index = "2", values = new[] { 1, 3, 2 } }
                }
            }
        });
    }

    [HttpPost("browse/exit")]
    public IActionResult ExitBrowse([FromBody] SessionRequest request)
    {
        return Ok(new
        {
            success = true,
            statusCode = 200,
            message = "Browse mode exited",
            data = new
            {
                index = "2",
                values = new[] { 1, 3, 2 },
                hasMore = true
            }
        });
    }

    [HttpPost("reset")]
    public IActionResult Reset([FromBody] SessionRequest request)
    {
        return Ok(new
        {
            success = true,
            statusCode = 200,
            message = "Session reset successfully",
            data = true
        });
    }
}

public class StartCombinationSessionRequest
{
    public int N { get; set; }
}

public class SessionRequest
{
    public Guid SessionId { get; set; }
}

public class GetCombinationsPageRequest
{
    public Guid SessionId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}