using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; 

namespace IdentityAuthService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;

        [NotMapped] 
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [JsonPropertyName("role")]
        public string Role { get; set; } = "Member"; 
    }
}