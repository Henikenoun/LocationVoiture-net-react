using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace location.Models
{
    public class Maintenance
    {
        [Key]
        public int IdMaintenance { get; set; }

        [Required]
        public DateTime DateEntree { get; set; }

        [Required]
        public DateTime? DateSortie { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public double? Cout { get; set; }

        // Relation avec la classe Voiture
        [Required]
        public int VoitureId { get; set; }

        [ForeignKey("VoitureId")]
        [JsonIgnore]
        public Voiture Voiture { get; set; }
    }
}
