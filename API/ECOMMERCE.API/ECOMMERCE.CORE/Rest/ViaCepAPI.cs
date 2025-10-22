using 

namespace ECOMMERCE.CORE.Helper;

public static class ViaCepAPI
{
    public void Search(string cep)
    {
        HttpClient client = new HttpClient();  
        client.BaseAddress = new Uri("https://viacep.com.br/");
        client.DefaultRequestHeaders.Accept.Clear();
        
        client.GetAsync(cep + "/")
            
            return saida/
    }
}