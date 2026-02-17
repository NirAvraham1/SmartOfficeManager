using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using ResourceManagementService.Models;

namespace ResourceManagementService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetRepository _repository;

        public AssetsController(IAssetRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssets([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (items, totalCount) = await _repository.GetPagedAsync(page, pageSize);
    
            return Ok(new {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAsset([FromBody] Asset asset)
        {
            await _repository.AddAsync(asset);
            return Ok(asset);
        }
    }
}
