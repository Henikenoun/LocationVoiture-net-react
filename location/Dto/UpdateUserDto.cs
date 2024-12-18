namespace location.Dto
{
    public class UpdateUserDto
    {
        public string? Nom { get; set; }
        public string? Prenom { get; set; }
        public string? Adresse { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateNaiss { get; set; }
        public string? Poste { get; set; } // Pour les employés uniquement
        public int? NbVoiture { get; set; } // Pour les clients uniquement
        public int? AgenceId { get; set; } // Pour les employés uniquement
    }

}
