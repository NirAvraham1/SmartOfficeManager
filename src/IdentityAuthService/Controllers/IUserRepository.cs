using IdentityAuthService.Models;

namespace IdentityAuthService.Data
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task AddAsync(User user);
        Task<bool> UserExistsAsync(string username);
    }
}