using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace location.Models
{
    //Cette classe est utilisée comme modèle pour l'enregistrement et la gestion des utilisateurs. Les propriétés supplémentaires sont stockées dans la base de données via EF Core
    public class ApplicationUser : IdentityUser
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Adresse { get; set; }
        // Clé étrangère vers l'agence
        public int? AgenceId { get; set; }

        [ForeignKey("AgenceId")]
        [JsonIgnore] // Empêche la sérialisation pour éviter les cycles
        public Agence Agence { get; set; }
        //employee
        public string? Poste { get; set; }
        //client
        public string? nb_voiture { get; set; }
        public DateTime? date_inscri { get; set; } 

        public DateTime date_naiss { get; set; }

        // Relation avec Location
        public ICollection<Location> Locations { get; set; }


    }
}
