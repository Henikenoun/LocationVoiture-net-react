using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace location.Models
{
    public class Voiture
    {
        [Key]
        public int IdVoiture { get; set; }

        [Required]
        public string Matricule { get; set; }

        [Required]
        public string Marque { get; set; }

        [Required]
        public string Modele { get; set; }

        [Required]
        public DateTime DateFab { get; set; }

        [Required]
        public string Nature { get; set; }

        [Required]
        public decimal PrixJourn { get; set; }

        [Required]
        public string ImageUrl { get; set; }
        // Clé étrangère vers Agence
        public int AgenceId { get; set; }

        [ForeignKey("AgenceId")]
        public Agence Agence { get; set; }

        // Relation avec Maintenance
        public ICollection<Maintenance> Maintenances { get; set; } = new List<Maintenance>();

        // Relation avec Location
        public ICollection<Location> Locations { get; set; }
    }
}
