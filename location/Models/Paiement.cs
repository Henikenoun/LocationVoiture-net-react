using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace location.Models
{
    public class Paiement
    {
        [Key]
        public int IdPaiement { get; set; }

        [Required]
        public DateTime DatePaiement { get; set; }

        [Required]
        public decimal Montant { get; set; }

        // Relation avec Location
        public int LocationId { get; set; }

        [ForeignKey("LocationId")]
        public Location Location { get; set; }
    }
}
