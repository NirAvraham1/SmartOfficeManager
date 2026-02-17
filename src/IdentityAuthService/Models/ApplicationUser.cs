using Microsoft.AspNetCore.Identity;

namespace IdentityAuthService.Models
{
    // המחלקה הזו יורשת את כל השדות של IdentityUser (שם משתמש, סיסמה מוצפנת, אימייל וכו')
    public class ApplicationUser : IdentityUser
    {
        // כאן תוכל להוסיף בעתיד שדות כמו:
        // public string FullName { get; set; }
    }
}