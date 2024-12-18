using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace location.Models
{
    public class VoitureContext : IdentityDbContext<ApplicationUser>
    {
        public VoitureContext(DbContextOptions<VoitureContext> options) : base(options)
        {
        }

        public DbSet<Agence> Agences { get; set; }
        public DbSet<Voiture> Voitures { get; set; }
        public DbSet<Maintenance> Maintenances { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Paiement> Paiements { get; set; }

    }
}
