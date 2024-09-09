using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_configuration["MailSettings:DisplayName"], _configuration["MailSettings:FromEmail"]));
        email.To.Add(new MailboxAddress(toEmail, toEmail));
        email.Subject = subject;

        var builder = new BodyBuilder { HtmlBody = body };
        email.Body = builder.ToMessageBody();

        using var smtpClient = new SmtpClient();

        try
        {
            await smtpClient.ConnectAsync(_configuration["MailSettings:SmtpHost"], int.Parse(_configuration["MailSettings:SmtpPort"]), MailKit.Security.SecureSocketOptions.StartTls);

            await smtpClient.AuthenticateAsync(_configuration["MailSettings:SmtpUser"], _configuration["MailSettings:SmtpPass"]);

            await smtpClient.SendAsync(email);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to send email.", ex);
        }
        finally
        {
            await smtpClient.DisconnectAsync(true);
        }
    }

    public async Task SendOtpEmailAsync(string toEmail, string otp)
    {
        string subject = "Your OTP Code";
        string body = $"<p>Your OTP code is: <strong>{otp}</strong></p>";

        await SendEmailAsync(toEmail, subject, body);
    }
}
