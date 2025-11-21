namespace ViaCep.DTO;

public class ViaCepDto
{
    // https://json2csharp.com/
    // https://viacep.com.br/
    public string cep { get; set; }
    public string logradouro { get; set; }
    public string bairro { get; set; }
    public string uf { get; set; }
    public string estado { get; set; }
    public string regiao { get; set; }
    
}