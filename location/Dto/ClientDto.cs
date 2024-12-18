namespace location.Dto
{
    public class ClientDto
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Adresse { get; set; }
        public string? NbVoiture { get; set; }
        public DateTime? DateInscription { get; set; }
        public DateTime DateNaiss { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string? Role { get; set; }
    }
}
