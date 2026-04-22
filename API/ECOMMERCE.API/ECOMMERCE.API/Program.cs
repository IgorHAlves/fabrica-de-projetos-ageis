

using ECOMMERCE.API.Auth;
using ECOMMERCE.API.Interfaces;
using ECOMMERCE.API.Repositories;
using ECOMMERCE.CORE.Interfaces;
using ECOMMERCE.CORE.Services;
using ECOMMERCE.DATA.Data;
using ECOMMERCE.DATA.Interfaces;
using ECOMMERCE.DATA.Repositories;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Keycloak.AuthServices.Sdk.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Pix;
using ViaCep.Rest;
using IAuthorizationService = ECOMMERCE.CORE.Interfaces.IAuthorizationService;

namespace ECOMMERCE.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            
            builder.Services.AddScoped<IProductService, ProductServices>();

            builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();

            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            
            builder.Services.AddScoped<IUserService, UserService>();
            
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            builder.Services.AddScoped<IOrderService, OrderService>();

            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

            builder.Services.AddScoped<ICouponRepository, CouponRepository>();
            
            builder.Services.AddScoped<ICouponService, CouponService>();
            
            builder.Services.AddScoped<ViaCepApi, ViaCepApi>();
            
            builder.Services.AddScoped<IShippingService, ShippingService>();

            builder.Services.AddScoped<PixService, PixService>();
            
            string mySqlConnection = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<EcommerceDbContext>(options =>
                options.UseMySql(mySqlConnection, ServerVersion.AutoDetect(mySqlConnection)));

            // Registra o IClaimsTransformation para mapear roles do Keycloak - MOVIDO PARA BAIXO
            // builder.Services.AddScoped<Microsoft.AspNetCore.Authentication.IClaimsTransformation, KeycloakRolesClaimsTransformation>();


            #region Authorization
            
            builder.Services.AddScoped<IAuthorizationService,AuthorizationService>();

            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference 
                            { 
                                Type = ReferenceType.SecurityScheme, 
                                Id = "Bearer" 
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
            
            var authenticationOptions = builder
                .Configuration
                .GetSection(KeycloakAuthenticationOptions.Section)
                .Get<KeycloakAuthenticationOptions>();

            builder.Services.AddKeycloakAuthentication(authenticationOptions, options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // REMOVIDO: PostConfigure não estava funcionando como esperado.
            // A lógica foi movida para um middleware dedicado abaixo.

            var authorizationOptions = builder
                .Configuration
                .GetSection(KeycloakProtectionClientOptions.Section)
                .Get<KeycloakProtectionClientOptions>();

            builder.Services.AddKeycloakAuthorization(authorizationOptions);

            var adminClientOptions = builder
                .Configuration
                .GetSection(KeycloakAdminClientOptions.Section)
                .Get<KeycloakAdminClientOptions>();

            builder.Services.AddKeycloakAdminHttpClient(adminClientOptions);

            #endregion

            // Registra o IClaimsTransformation para mapear roles do Keycloak (REMOVIDO: Usando Middleware)
            // builder.Services.AddScoped<Microsoft.AspNetCore.Authentication.IClaimsTransformation, KeycloakRolesClaimsTransformation>();


            #region CORS

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("PermitirTudo", policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            #endregion
            
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            
            app.UseCors("PermitirTudo"); //Parte do CORS
            app.UseAuthentication(); //Parte da autorização

            // Middleware CUSTOMIZADO para Mapeamento de Roles
            // Executa após UseAuthentication para ter acesso ao User, mas antes de UseAuthorization
            app.UseMiddleware<ECOMMERCE.API.Auth.KeycloakRolesMiddleware>();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}

