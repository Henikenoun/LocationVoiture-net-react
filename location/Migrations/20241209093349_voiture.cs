using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace location.Migrations
{
    /// <inheritdoc />
    public partial class voiture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Voitures",
                columns: table => new
                {
                    IdVoiture = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Matricule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Marque = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Modele = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateFab = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Nature = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrixJourn = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AgenceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voitures", x => x.IdVoiture);
                    table.ForeignKey(
                        name: "FK_Voitures_Agences_AgenceId",
                        column: x => x.AgenceId,
                        principalTable: "Agences",
                        principalColumn: "IdAgence",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Voitures_AgenceId",
                table: "Voitures",
                column: "AgenceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Voitures");
        }
    }
}
