using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace location.Models
{
    public class Agence
    {
        [Key]
        public int IdAgence { get; set; }

        [Required]
        public string Nom { get; set; }

        [Required]
        public string Adresse { get; set; }

        [Required]
        public string Tel { get; set; }
        public ICollection<ApplicationUser> Employees { get; set; } = new List<ApplicationUser>();
        public ICollection<Voiture> Voitures { get; set; } = new List<Voiture>();
    }
}
