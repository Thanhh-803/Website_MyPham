using System;
using System.Collections.Generic;

namespace UserService.Model
{
    public partial class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string TypeUser { get; set; } = null!;
        public string Email { get; set; } = null;
        public string Phone { get; set; } = null;
    }
}
