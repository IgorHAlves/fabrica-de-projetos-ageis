using System.Security.Claims;
using System.Text.Json;

namespace ECOMMERCE.API.Auth
{
    public class KeycloakRolesMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<KeycloakRolesMiddleware> _logger;

        public KeycloakRolesMiddleware(RequestDelegate next, ILogger<KeycloakRolesMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            _logger.LogWarning($"[KeycloakRolesMiddleware] Request: {context.Request.Path}");

            if (context.User?.Identity?.IsAuthenticated == true)
            {
                _logger.LogWarning($"[KeycloakRolesMiddleware] Usuário autenticado: {context.User.Identity.Name}");
                var identity = (ClaimsIdentity)context.User.Identity;

                // Debug: Listar todas as claims iniciais
                foreach (var claim in context.User.Claims)
                {
                    _logger.LogWarning($"[KeycloakRolesMiddleware] Claim Inicial: {claim.Type} = {claim.Value}");
                }

                // Verifica se já tem roles
                var existingRoles = identity.FindAll(ClaimTypes.Role).ToList();
                if (!existingRoles.Any())
                {
                    _logger.LogWarning("[KeycloakRolesMiddleware] Nenhuma role encontrada. Tentando extrair do Keycloak...");

                    // 1. Realm Access
                    var realmAccessClaim = identity.FindFirst("realm_access");
                    if (realmAccessClaim != null)
                    {
                        try
                        {
                            using var realmAccess = JsonDocument.Parse(realmAccessClaim.Value);
                            if (realmAccess.RootElement.TryGetProperty("roles", out var rolesElement))
                            {
                                foreach (var role in rolesElement.EnumerateArray())
                                {
                                    var roleName = role.GetString();
                                    identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
                                    _logger.LogDebug($"[KeycloakRolesMiddleware] Role adicionada [Realm]: {roleName}");
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"[KeycloakRolesMiddleware] Erro ao processar realm_access: {ex.Message}");
                        }
                    }

                    // 2. Resource Access
                    var resourceAccessClaim = identity.FindFirst("resource_access");
                    if (resourceAccessClaim != null)
                    {
                        try
                        {
                            using var resourceAccess = JsonDocument.Parse(resourceAccessClaim.Value);
                            // Tenta encontrar o cliente 'ecommerce-api' ou iterar sobre todos
                            if (resourceAccess.RootElement.TryGetProperty("ecommerce-api", out var clientElement))
                            {
                                if (clientElement.TryGetProperty("roles", out var rolesElement))
                                {
                                    foreach (var role in rolesElement.EnumerateArray())
                                    {
                                        var roleName = role.GetString();
                                        identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
                                        _logger.LogDebug($"[KeycloakRolesMiddleware] Role adicionada [Resource]: {roleName}");
                                    }
                                }
                            }
                            else
                            {
                                _logger.LogDebug("[KeycloakRolesMiddleware] Cliente 'ecommerce-api' não encontrado em resource_access.");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"[KeycloakRolesMiddleware] Erro ao processar resource_access: {ex.Message}");
                        }
                    }
                }
                else
                {
                    _logger.LogWarning($"[KeycloakRolesMiddleware] Roles já presentes: {string.Join(", ", existingRoles.Select(r => r.Value))}");
                }
            }
            else
            {
                _logger.LogWarning("[KeycloakRolesMiddleware] Usuário NÃO autenticado.");
            }

            await _next(context);
        }
    }
}
