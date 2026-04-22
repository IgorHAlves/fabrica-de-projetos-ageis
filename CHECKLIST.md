# ✅ Checklist de Apresentação e Deploy

Para garantir que o projeto rode em qualquer máquina sem problemas ("sem B.O."), siga estes passos antes de subir para o Git ou apresentar:

## 1. Configuração do Ambiente (Frontend)
- [ ] Verifique se o arquivo `.env` foi criado na pasta `Front-end` (use o `.env.example` como base).
- [ ] Confirme se as URLs do Keycloak no `.env` batem com o ambiente onde será apresentado.

## 2. Configuração do Backend (API)
- [ ] **Banco de Dados**: O projeto usa **MySQL**. Certifique-se de que a máquina de apresentação tenha o MySQL instalado.
- [ ] **Connection String**: Verifique o arquivo `API/ECOMMERCE.API/ECOMMERCE.API/appsettings.json`.
  - A string de conexão `DefaultConnection` deve apontar para o banco correto (usuário/senha/porta).
  - **Dica**: Se for rodar em outra máquina, talvez precise ajustar `server=localhost` e as credenciais.
- [ ] **Migrations**: Se for uma máquina nova, rode `dotnet ef database update` na pasta da API para criar as tabelas.

## 3. Keycloak (Autenticação)
- [ ] O Keycloak deve estar rodando (geralmente porta 8080).
- [ ] **Realm**: Certifique-se de que o Realm `ecommerce` foi importado/criado no Keycloak da máquina de apresentação.
- [ ] **Client**: O client `ecommerce-api` deve existir e estar configurado como público (para o front) e confidencial (para a API, se usar secret).
- [ ] **Secret**: Se a API usa um client secret (no `appsettings.json`), verifique se ele bate com o do Keycloak.

## 4. Arquivos Ignorados (.gitignore)
- [ ] Confirme que pastas pesadas ou com senhas não foram para o Git:
  - `node_modules/` (Frontend)
  - `bin/` e `obj/` (Backend)
  - `.env` (Frontend)
  - `appsettings.Development.json` (Backend - opcional, mas recomendado ignorar se tiver senhas reais)

## 5. Teste Final
1. Suba o banco (MySQL).
2. Suba o Keycloak.
3. Rode a API (`dotnet run`).
4. Rode o Front (`npm run dev`).
5. Tente fazer login e uma compra completa.

---
**Boa apresentação! 🚀**
