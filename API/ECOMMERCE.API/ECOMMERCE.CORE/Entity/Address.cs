using ECOMMERCE.CORE.Interfaces;

namespace ECOMMERCE.CORE.Entity
{
    public class Address : BaseEntity
    {
        public string? Cep { get; set; }
        public string? Number { get; set; }
        public string? Logradouro { get; set; }
        public string? Complemento { get; set; }
        public string? Estado  { get; set; }
        public string? Bairro { get; set; }
        public string? Localidade { get; set; }
        public string? Uf { get; set; }
        public string? Ddd { get; set; }
    }
} 