using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private MyDbContext _db;
        private TokenGenerator _tokenGenerator;
        public UserController(MyDbContext db, TokenGenerator tokenGenerator)
        {
            _db = db;
            _tokenGenerator = tokenGenerator;
        }


        [HttpPost("Register")]
        public IActionResult AddUser([FromForm] UserRegisterRequestDTO addUser)
        {
            byte[] hash, salt;
            PasswordHasher.CreatePasswordHash(addUser.Password, out hash, out salt);
            var newuser = new User()
            {
                Email = addUser.Email,
                Username = addUser.Username,
                PasswordSalt = salt,
                PasswordHash = hash

            };
            _db.Users.Add(newuser);
            _db.SaveChanges();
            return Ok(newuser);
        }


        [HttpPost("Login")]
        public IActionResult Login([FromForm] UserLoginRequestDTO user)
        {
            var dbuser = _db.Users.FirstOrDefault(u => u.Email == user.Email);
            if (dbuser == null || !PasswordHasher.VerifyPasswordHash(user.Password, dbuser.PasswordHash, dbuser.PasswordSalt))
            {
                return BadRequest("Login Unauthorized!");
            }
            var roles = dbuser.Role.Split(" ").ToList();
            var token = _tokenGenerator.GenerateToken(dbuser.Email, roles);

            return Ok(new { Token = token, UserId = dbuser.Id, userRole = dbuser.Role });
        }


        [HttpGet("GetUserById/{id}")]
        public IActionResult GetUserById(int id)
        {
            var User = _db.Users.Find(id);
            if (User == null)
            {
                return BadRequest();
            }
            return Ok(User);
        }


        [HttpPut("{id}")]
        public IActionResult editUser(int id, [FromForm] UserPutDTO edit)
        {
            var user = _db.Users.Find(id);
            if (user == null)
            {
                return BadRequest();
            }

            user.Email = edit.Email;
            user.Username = edit.Username;

            _db.Users.Update(user);
            _db.SaveChanges();
            return Ok(user);
        }

        [HttpPut]
        public IActionResult ResetPassword([FromBody] resetPasswordDTO newpass)
        {
            var user = _db.Users.Where(u => u.Email == newpass.Email).FirstOrDefault();
            if (user == null)
            {
                return BadRequest();
            }
            byte[] newHash, newSalt;
            PasswordHasher.CreatePasswordHash(newpass.Password, out newHash, out newSalt);
            user.PasswordHash = newHash;
            user.PasswordSalt = newSalt;
            _db.Users.Update(user);
            _db.SaveChanges();
            return Ok(user);
        }
    }
}
