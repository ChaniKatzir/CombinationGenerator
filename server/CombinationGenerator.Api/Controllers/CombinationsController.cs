using CombinationGenerator.Api.Contracts.Requests;
using CombinationGenerator.Api.Contracts.Responses;
using CombinationGenerator.Api.Mapping;
using CombinationGenerator.Core.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace CombinationGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CombinationsController : ControllerBase
{
    private readonly ICombinationService _combinationService;

    public CombinationsController(ICombinationService combinationService)
    {
        _combinationService = combinationService;
    }

    [HttpPost("start")]
    public ActionResult<ApiResponse<StartCombinationSessionResponse>> Start(
        [FromBody] StartCombinationSessionRequest request)
    {
        var result = _combinationService.Start(request.N);
        var response = CombinationResponseMapper.ToResponse(result);

        return Ok(ApiResponse<StartCombinationSessionResponse>.Ok(
            response,
            "Session started successfully."));
    }

    [HttpPost("next")]
    public ActionResult<ApiResponse<NextCombinationResponse>> GetNext(
        [FromBody] SessionRequest request)
    {
        var result = _combinationService.GetNext(request.SessionId);
        var response = CombinationResponseMapper.ToResponse(result);

        return Ok(ApiResponse<NextCombinationResponse>.Ok(response));
    }

    [HttpPost("browse/page")]
    public ActionResult<ApiResponse<CombinationsPageResponse>> GetPage(
        [FromBody] GetCombinationsPageRequest request)
    {
        var result = _combinationService.GetPage(
            request.SessionId,
            request.PageNumber,
            request.PageSize);

        var response = CombinationResponseMapper.ToResponse(result);

        return Ok(ApiResponse<CombinationsPageResponse>.Ok(response));
    }

    [HttpPost("browse/exit")]
    public ActionResult<ApiResponse<NextCombinationResponse>> ExitBrowse(
        [FromBody] SessionRequest request)
    {
        var result = _combinationService.ExitBrowse(request.SessionId);
        var response = CombinationResponseMapper.ToResponse(result);

        return Ok(ApiResponse<NextCombinationResponse>.Ok(response));
    }

    [HttpPost("reset")]
    public ActionResult<ApiResponse<bool>> Reset([FromBody] SessionRequest request)
    {
        _combinationService.Reset(request.SessionId);

        return Ok(ApiResponse<bool>.Ok(true, "Session reset successfully."));
    }
}