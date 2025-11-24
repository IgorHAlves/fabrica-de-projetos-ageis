# Guia: Como Implementar Deleção de Imagens do Cloudinary no Backend

## 📋 Resumo

Para deletar imagens do Cloudinary, você precisa criar um endpoint no backend que use as credenciais seguras (API Key e API Secret) do Cloudinary. Essas credenciais **NÃO** devem ser expostas no frontend por questões de segurança.

## 🔧 Passos para Implementação no Backend

### 1. Adicionar Configurações no `appsettings.json`

Adicione as seguintes configurações do Cloudinary no arquivo `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cloudinary": {
    "CloudName": "seu-cloud-name",
    "ApiKey": "sua-api-key",
    "ApiSecret": "seu-api-secret"
  }
}
```

**⚠️ IMPORTANTE:** Adicione também no `appsettings.Development.json` para desenvolvimento, mas **NUNCA** commite essas credenciais no Git. Use variáveis de ambiente ou User Secrets.

### 2. Criar Interface `ICloudinaryService.cs`

Crie o arquivo `Interfaces/ICloudinaryService.cs`:

```csharp
namespace ECOMMERCE.API.Interfaces;

public interface ICloudinaryService
{
    /// <summary>
    /// Deleta uma imagem do Cloudinary usando o public_id
    /// </summary>
    /// <param name="publicId">O public_id da imagem no Cloudinary</param>
    /// <returns>True se a imagem foi deletada com sucesso, False caso contrário</returns>
    Task<bool> DeleteImageAsync(string publicId);
}
```

### 3. Criar Serviço `CloudinaryService.cs`

Crie o arquivo `Services/CloudinaryService.cs`:

```csharp
using ECOMMERCE.API.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace ECOMMERCE.API.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<CloudinaryService> _logger;
    private readonly HttpClient _httpClient;

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger, HttpClient httpClient)
    {
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClient;
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        try
        {
            var cloudName = _configuration["Cloudinary:CloudName"];
            var apiKey = _configuration["Cloudinary:ApiKey"];
            var apiSecret = _configuration["Cloudinary:ApiSecret"];

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                _logger.LogError("Cloudinary não configurado corretamente. Verifique as configurações em appsettings.json");
                return false;
            }

            // Gerar timestamp
            var timestamp = ((long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds).ToString();

            // Criar assinatura (signature) para autenticação
            var signatureString = $"public_id={publicId}&timestamp={timestamp}{apiSecret}";
            var signature = ComputeSha256Hash(signatureString);

            // Construir a URL da API de destruição
            var url = $"https://api.cloudinary.com/v1_1/{cloudName}/image/destroy";

            // Criar o conteúdo da requisição
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("public_id", publicId),
                new KeyValuePair<string, string>("timestamp", timestamp),
                new KeyValuePair<string, string>("api_key", apiKey),
                new KeyValuePair<string, string>("signature", signature)
            });

            // Fazer a requisição POST (Cloudinary usa POST para destroy)
            var response = await _httpClient.PostAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Imagem deletada com sucesso. PublicId: {PublicId}", publicId);
                return true;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Erro ao deletar imagem do Cloudinary. Status: {Status}, Response: {Response}", 
                    response.StatusCode, errorContent);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exceção ao deletar imagem do Cloudinary. PublicId: {PublicId}", publicId);
            return false;
        }
    }

    /// <summary>
    /// Calcula o hash SHA256 de uma string
    /// </summary>
    private static string ComputeSha256Hash(string rawData)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
```

### 4. Criar Controller `CloudinaryController.cs`

Crie o arquivo `Controllers/CloudinaryController.cs`:

```csharp
using ECOMMERCE.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECOMMERCE.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CloudinaryController : ControllerBase
{
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ILogger<CloudinaryController> _logger;

    public CloudinaryController(ICloudinaryService cloudinaryService, ILogger<CloudinaryController> logger)
    {
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    /// <summary>
    /// Deleta uma imagem do Cloudinary
    /// </summary>
    /// <param name="publicId">O public_id da imagem no Cloudinary</param>
    /// <returns>Resultado da operação</returns>
    [HttpDelete("{publicId}")]
    public async Task<IActionResult> DeleteImage(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest(new { message = "publicId é obrigatório" });
        }

        try
        {
            var result = await _cloudinaryService.DeleteImageAsync(publicId);

            if (result)
            {
                return Ok(new { message = "Imagem deletada com sucesso", publicId });
            }
            else
            {
                return StatusCode(500, new { message = "Erro ao deletar imagem do Cloudinary" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar imagem. PublicId: {PublicId}", publicId);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}
```

### 5. Registrar Serviços no `Program.cs`

Atualize o arquivo `Program.cs` para registrar o serviço:

```csharp
using ECOMMERCE.API.Interfaces;
using ECOMMERCE.API.Services;

namespace ECOMMERCE.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Registrar HttpClient para CloudinaryService
            builder.Services.AddHttpClient<ICloudinaryService, CloudinaryService>();

            // Registrar CloudinaryService
            builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
```

## 🎯 Como Usar no Frontend

### 1. Atualizar o serviço `cloudinary.js`

Adicione a função para deletar imagens:

```javascript
import axios from 'axios'
import api from './Axios'

// ... código existente ...

/**
 * Deleta uma imagem do Cloudinary via backend
 * @param {string} publicId - O public_id da imagem no Cloudinary
 * @returns {Promise<boolean>} True se deletado com sucesso
 */
export async function deleteImageFromCloudinary(publicId) {
    if (!publicId) {
        throw new Error('publicId é obrigatório')
    }

    try {
        const response = await api.delete(`Cloudinary/${publicId}`)
        return response.status === 200
    } catch (error) {
        console.error('Erro ao deletar imagem:', error)
        throw error
    }
}
```

### 2. Extrair o public_id da URL

O Cloudinary retorna o `public_id` quando você faz upload. Você precisa salvar esse `public_id` junto com a URL da imagem. 

**Exemplo de resposta do upload:**
```json
{
  "public_id": "produtos/abc123",
  "secure_url": "https://res.cloudinary.com/seu-cloud/image/upload/v1234567890/produtos/abc123.jpg",
  ...
}
```

**Função auxiliar para extrair public_id da URL:**
```javascript
/**
 * Extrai o public_id de uma URL do Cloudinary
 * @param {string} imageUrl - URL completa da imagem
 * @returns {string|null} public_id ou null se não for uma URL válida do Cloudinary
 */
export function extractPublicIdFromUrl(imageUrl) {
    if (!imageUrl) return null
    
    try {
        // Padrão: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{ext}
        const match = imageUrl.match(/\/upload\/[^\/]+\/(.+?)(?:\.[^.]+)?$/)
        if (match && match[1]) {
            return match[1]
        }
        
        // Tentar extrair diretamente se a URL contém o public_id
        const urlParts = imageUrl.split('/')
        const uploadIndex = urlParts.findIndex(part => part === 'upload')
        if (uploadIndex !== -1 && urlParts[uploadIndex + 2]) {
            const publicIdWithExt = urlParts[uploadIndex + 2]
            return publicIdWithExt.replace(/\.[^.]+$/, '') // Remove extensão
        }
        
        return null
    } catch (error) {
        console.error('Erro ao extrair public_id:', error)
        return null
    }
}
```

### 3. Usar ao deletar produto

Quando deletar um produto, também delete a imagem:

```javascript
import { deleteImageFromCloudinary, extractPublicIdFromUrl } from '@/Services/cloudinary'

async function deleteProduct(productId, imageUrl) {
    try {
        // Deletar imagem do Cloudinary se existir
        if (imageUrl) {
            const publicId = extractPublicIdFromUrl(imageUrl)
            if (publicId) {
                await deleteImageFromCloudinary(publicId)
            }
        }
        
        // Deletar produto do banco
        await api.delete(`Product/${productId}`)
    } catch (error) {
        // Tratar erro
    }
}
```

## 📝 Notas Importantes

1. **Segurança**: As credenciais do Cloudinary (API Key e API Secret) devem estar apenas no backend, nunca no frontend.

2. **Public ID**: Você precisa salvar o `public_id` retornado pelo upload. Se não tiver salvo, pode tentar extrair da URL, mas isso pode não funcionar em todos os casos.

3. **Assinatura**: O Cloudinary requer uma assinatura (signature) calculada com SHA256 para autenticar requisições de destruição.

4. **Timestamp**: Cada requisição precisa de um timestamp único para gerar a assinatura.

5. **Teste**: Após implementar, teste a deleção através do Swagger ou Postman antes de usar no frontend.

## 🔍 Como Obter as Credenciais do Cloudinary

1. Acesse o [Dashboard do Cloudinary](https://cloudinary.com/console)
2. Vá em **Settings** → **Security**
3. Copie:
   - **Cloud Name** (já está no frontend)
   - **API Key**
   - **API Secret** (clique em "Reveal" para ver)

## ✅ Checklist de Implementação

- [ ] Adicionar configurações no `appsettings.json`
- [ ] Criar `ICloudinaryService.cs`
- [ ] Criar `CloudinaryService.cs`
- [ ] Criar `CloudinaryController.cs`
- [ ] Registrar serviços no `Program.cs`
- [ ] Testar endpoint no Swagger
- [ ] Atualizar `cloudinary.js` no frontend
- [ ] Implementar deleção ao deletar produto
- [ ] Testar fluxo completo

