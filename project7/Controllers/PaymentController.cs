using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {

        private readonly MyDbContext _db;
        public PaymentController(MyDbContext db)
        {
            _db = db;
        }
        [HttpPost("AddToPaymentTableByOrderId/{id}")]
        public ActionResult AddToPaymentTable(int id, [FromBody] PaymentsDTO paymentsDTO)
        {

            var order = _db.Orders.Find(id);
            var payments = new Payment
            {
                OrderId = id,
                PaymentDate = DateTime.Now,
                PaymentMethod = "Paypal",
                PaymentAmount =  paymentsDTO.PaymentAmount,
                TransactionId = "M123",
                PaymentStatus = "Completed"
            };
            _db.Payments.Add(payments);
            _db.SaveChanges();
            return Ok();
        }
    }
}
