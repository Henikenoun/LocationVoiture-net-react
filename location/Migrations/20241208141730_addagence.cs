using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace location.Migrations
{
    /// <inheritdoc />
    public partial class addagence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AgenceId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Agences",
                columns: table => new
                {
                    IdAgence = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tel = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agences", x => x.IdAgence);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AgenceId",
                table: "AspNetUsers",
                column: "AgenceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Agences_AgenceId",
                table: "AspNetUsers",
                column: "AgenceId",
                principalTable: "Agences",
                principalColumn: "IdAgence");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Agences_AgenceId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Agences");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AgenceId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AgenceId",
                table: "AspNetUsers");
        }
    }
}
