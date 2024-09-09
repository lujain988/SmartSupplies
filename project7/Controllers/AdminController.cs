using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project7.DTOs;
using project7.Models;

namespace project7.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly MyDbContext _db;
        public AdminController(MyDbContext db)
        {
            _db = db;
        }


        [HttpPut("ChangOrderStatus/{id}")]
        public IActionResult ChangOrderStatus(int id, [FromBody] OrderstatusDTO orderstatusDTO)
        {
            var order = _db.Orders.FirstOrDefault(c => c.Id == id);
            if (order == null)
            { return NotFound(); }
            order.Status = orderstatusDTO.Status;
            _db.Orders.Update(order);
            _db.SaveChanges();

            return Ok(order);
        }
        [HttpGet("GetAllVouchers")]
        public IActionResult GetAllVauchers()
        {
            var vouchers = _db.Vouchers.ToList();

            return Ok(vouchers);
        }
        [HttpPost("Addnewvoucher")]
        public IActionResult AddNewVoucher([FromForm] VoucherDTO voucherDTO)
        {
            var voucher = new Voucher
            {
                Code = voucherDTO.Code,
                DiscountAmount = voucherDTO.DiscountAmount,
                ExpirationDate = voucherDTO.ExpirationDate,
                IsActive = voucherDTO.IsActive,

            };
            _db.Vouchers.Add(voucher);
            _db.SaveChanges();
            return Ok();
        }
        [HttpPut("UpdateVoucher/{id}")]
        public IActionResult UpdateVoucher(int id, [FromForm] VoucherDTO voucherDTO)
        {
            var voucher = _db.Vouchers.FirstOrDefault(x => x.Id == id);
            if (voucher == null)
            {
                return NotFound();
            }


            voucher.Code = voucherDTO.Code ?? voucher.Code;
            voucher.DiscountAmount = Convert.ToDecimal(voucherDTO.DiscountAmount);
            voucher.ExpirationDate = voucherDTO.ExpirationDate;
            voucher.IsActive = voucherDTO.IsActive ?? voucher.IsActive;

            _db.Vouchers.Update(voucher);
            _db.SaveChanges();

            return Ok(voucher);
        }
        [HttpDelete("DeletVoucher/{id}")]
        public IActionResult DeleteVoucher(int id)
        {
            var voucher = _db.Vouchers.FirstOrDefault(x => x.Id == id);
            if (voucher == null)
                return NotFound();
            _db.Vouchers.Remove(voucher);
            _db.SaveChanges();
            return Ok("The voucher has been Deleted");
        }
    }

}

