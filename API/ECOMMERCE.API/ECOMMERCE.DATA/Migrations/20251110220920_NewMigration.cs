using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECOMMERCE.DATA.Migrations
{
    /// <inheritdoc />
    public partial class NewMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Street",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "number",
                table: "Address");

            migrationBuilder.RenameColumn(
                name: "CEP",
                table: "Address",
                newName: "Cep");

            migrationBuilder.AlterColumn<string>(
                name: "Cep",
                table: "Address",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Bairro",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Complemento",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Ddd",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Localidade",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Logradouro",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Uf",
                table: "Address",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bairro",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Complemento",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Ddd",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Localidade",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Logradouro",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Uf",
                table: "Address");

            migrationBuilder.RenameColumn(
                name: "Cep",
                table: "Address",
                newName: "CEP");

            migrationBuilder.UpdateData(
                table: "Address",
                keyColumn: "CEP",
                keyValue: null,
                column: "CEP",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "CEP",
                table: "Address",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Street",
                table: "Address",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "number",
                table: "Address",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
