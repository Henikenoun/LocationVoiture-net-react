namespace location.Dto
{
    public class EmployeeDto
    {
        public string? id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Adresse { get; set; }
        public string Poste { get; set; }
        public DateTime DateNaiss { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        // Utilisation d'un int pour AgenceId au lieu de Guid
        public int? AgenceId { get; set; }
        public string? AgenceName { get; set; }
        public string? Role { get; set; }

    }
}
