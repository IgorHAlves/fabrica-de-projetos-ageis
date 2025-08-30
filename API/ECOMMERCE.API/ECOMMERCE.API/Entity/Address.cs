namespace ECOMMERCE.API.Entity
{
    public class Address
    {
        public int Id { get; set; }
        public string Street { get; set; }
        public string number { get; set; }
        public string CEP { get; set; }

        public Address()
        {
            
        }
    }
}