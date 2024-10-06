using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly MyDbContext _db;
        private readonly EmailService _emailService;
        private readonly OtpService _otpService;

        public PasswordResetController(MyDbContext db, EmailService emailService, OtpService otpService)
        {
            _db = db;
            _emailService = emailService;
            _otpService = otpService;
        }

        [HttpPost("request-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromForm] RequestPasswordResetDto dto)
        {
            var user = await GetUserByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            var otp = _otpService.GenerateOtp(user.Email);
            await _emailService.SendOtpEmailAsync(user.Email, otp);
            return Ok("OTP sent to email.");
        }

        private Task<User> GetUserByEmailAsync(string email)
        {
           var user = _db.Users.FirstOrDefault(x => x.Email == email);
            return Task.FromResult(user);
        }


        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            var user = await GetUserByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            if (_otpService.ValidateOtp(dto.Email, dto.Otp))
            {
                _otpService.ClearOtp(dto.Email);

                return Ok("OTP verified, you can now reset your password.");
            }
            return BadRequest("Invalid OTP.");
        }
    }
}
