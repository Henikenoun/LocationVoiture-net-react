using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace location.Models
{
    public class Location
    {
        [Key]
        public int IdLocation { get; set; }

        [Required]
        public DateTime DateDebut { get; set; }

        [Required]
        public DateTime DateFin { get; set; }

        [Required]
        public double PrixTotal { get; set; }

        // Relation avec Voiture
        [Required]
        public int VoitureId { get; set; }

        [ForeignKey("VoitureId")]
        public Voiture Voiture { get; set; }

        // Relation avec User (Client)
        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        // Relation avec Paiement
        public ICollection<Paiement> Paiements { get; set; } = new List<Paiement>();
    }
}
