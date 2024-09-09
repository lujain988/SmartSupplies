using Microsoft.Extensions.Caching.Memory;
using System;

public class OtpService
{
    private readonly IMemoryCache _memoryCache;
    private readonly TimeSpan _otpExpiration = TimeSpan.FromMinutes(5);

    public OtpService(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;
    }
    public string GenerateOtp(string userEmail)
    {
        var random = new Random();
        var otp = random.Next(100000, 999999);
        _memoryCache.Set(userEmail, otp, _otpExpiration);
        var cachotp = _memoryCache.Get(userEmail);
        var cachotp123 = 2;
        return otp.ToString();
    }

    public bool ValidateOtp(string userEmail, string otp)
    {
        var cachotp = _memoryCache.Get(userEmail).ToString();
        if (otp == cachotp)
        {
            return true;
        }
        return false;
    }

    public void ClearOtp(string userEmail)
    {
        _memoryCache.Remove(userEmail);
    }

}
