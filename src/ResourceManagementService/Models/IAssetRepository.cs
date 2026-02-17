using ResourceManagementService.Models;

public interface IAssetRepository
{
    Task<(IEnumerable<Asset> Items, long TotalCount)> GetPagedAsync(int page, int pageSize);
    Task AddAsync(Asset asset);
}