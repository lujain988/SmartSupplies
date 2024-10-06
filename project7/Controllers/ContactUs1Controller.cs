using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project7.DTOs;
using project7.Models;
using System.Net.Mail;
using System.Net;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactUs1Controller : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;

        public ContactUs1Controller(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }





        [HttpGet]
        public IActionResult getAllContact()
        {
            return Ok(_context.ContactUs.OrderByDescending(c => c.Id).ToList());
        }






        // GET: api/ContactUs/5
        // Admin can view a specific contact form
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactUsDTO>> GetContactForm(int id)
        {
            var contactForm = await _context.ContactUs.FindAsync(id);

            if (contactForm == null)
            {
                return NotFound();
            }

            var contactUsDto = new ContactUsDTO
            {
                Name = contactForm.Name,
                PhoneNumber = contactForm.PhoneNumber,
                Subject = contactForm.Subject,
                Email = contactForm.Email,
                Message = contactForm.Message
            };




            return Ok(contactUsDto);
        }

        // POST: api/ContactUs
        // User can submit a contact form
        [HttpPost]
        public IActionResult PostContactForm([FromForm] ContactUsDTO contactUsDto)
        {
            if (contactUsDto == null)
            {
                return BadRequest("Contact form data is required.");
            }
         

            var contactForm = new ContactU
            {
                Name = contactUsDto.Name,
                PhoneNumber = contactUsDto.PhoneNumber,
                Subject = contactUsDto.Subject,
                Email = contactUsDto.Email,
                Message = contactUsDto.Message,
                CreatedAt = DateTime.Now,
           

            };

            _context.ContactUs.Add(contactForm);
            _context.SaveChanges();

            //await SendEmailAsync(contactForm.Email, "Contact Form Received", "Thank you for reaching out to us!");

            return Ok(contactForm);
        }

        // POST: api/ContactUs/reply/5
        // Admin can reply to a contact form and send an email
        [HttpPost("reply/{id}")]
        public async Task<IActionResult> ReplyToContactForm(int id, [FromForm] ContactUsReplyDto replyDto)
        {
            var contactForm = await _context.ContactUs.FindAsync(id);

            contactForm.ReplyMessage = replyDto.Subject += replyDto.ReplyMessage;
            contactForm.CreatedAt = DateTime.Now;

            _context.Entry(contactForm).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            ContactUs1Controller.SendEmailAsync(replyDto.Email, replyDto.Subject, replyDto.ReplyMessage);


            return Ok(replyDto);
        }


        // DELETE: api/ContactUs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactForm(int id)
        {
            var contactForm = await _context.ContactUs.FindAsync(id);

            if (contactForm == null)
            {
                return NotFound("Contact form not found.");
            }

            _context.ContactUs.Remove(contactForm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper method to send an email using SendGrid

        private static void SendEmailAsync(string toAddress, string subject, string body)
        {
            try
            {
                // Set up the sender and receiver email addresses
                string fromAddress = "techlearnhub.contact@gmail.com";

                // Set up the Gmail SMTP client with the app password
                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("techlearnhub.contact@gmail.com", "lyrlogeztsxclank"), // Use your app password here
                    EnableSsl = true
                };

                // Create a MailMessage object
                MailMessage mailMessage = new MailMessage(fromAddress, toAddress, subject, body);

                // Send the email
                smtpClient.Send(mailMessage);
                Console.WriteLine("Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to send email. Error: " + ex.Message);
            }
        }






        private bool ContactFormExists(int id)
        {
            return _context.ContactUs.Any(e => e.Id == id);
        }
    }
}
