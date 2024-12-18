using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace location.Migrations
{
    /// <inheritdoc />
    public partial class addclie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Adresse",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Poste",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date_inscri",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date_naiss",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "nb_voiture",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Adresse",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Poste",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "date_inscri",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "date_naiss",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "nb_voiture",
                table: "AspNetUsers");
        }
    }
}
