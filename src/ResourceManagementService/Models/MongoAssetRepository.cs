using MongoDB.Driver;
using ResourceManagementService.Models;

public class MongoAssetRepository : IAssetRepository
{
    private readonly IMongoCollection<Asset> _assets;

    public MongoAssetRepository(IMongoDatabase database)
    {
        _assets = database.GetCollection<Asset>("Assets");
    }

    public async Task<(IEnumerable<Asset> Items, long TotalCount)> GetPagedAsync(int page, int pageSize)
    {
        var count = await _assets.CountDocumentsAsync(_ => true);

        var items = await _assets.Find(_ => true)
                                 .Skip((page - 1) * pageSize) 
                                 .Limit(pageSize)             
                                 .ToListAsync();

        return (items, count);
    }

    public async Task AddAsync(Asset asset)
    {
        await _assets.InsertOneAsync(asset);
    }
}