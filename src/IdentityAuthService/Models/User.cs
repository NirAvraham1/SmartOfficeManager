using System.ComponentModel.DataAnnotations;

namespace IdentityAuthService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        // תפקיד המשתמש: Admin או Member כפי שנדרש במטלה
        public string Role { get; set; } = "Member"; 
    }
}