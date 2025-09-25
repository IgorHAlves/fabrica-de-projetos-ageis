namespace ECOMMERCE.CORE.DTO.User
{
    public class GetAddressDTO
    {
        public Guid Id { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string CEP { get; set; }
    }
}
