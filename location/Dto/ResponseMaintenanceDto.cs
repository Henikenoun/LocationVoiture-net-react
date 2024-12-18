namespace location.Dto
{
    public class ResponseMaintenanceDto
    {
        public int IdMaintenance { get; set; }
        public DateTime DateEntree { get; set; }
        public DateTime? DateSortie { get; set; }
        public string Description { get; set; }
        public double? Cout { get; set; }

        // Coordonnées de la voiture
        public string Matricule { get; set; }
        public string Marque { get; set; }
        public string Agence { get; set; }
        public string Model { get; set; }
        public int VoitureId { get; set; }
    }
}
