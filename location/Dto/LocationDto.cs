namespace location.Dto
{
    public class LocationDto
    {
        public int IdLocation { get; set; }
        public DateTime DateDebut { get; set; }
        public DateTime DateFin { get; set; }
        public double PrixTotal { get; set; }

        // Informations sur la voiture
        public int VoitureId { get; set; }
        public string? MarqueVoiture { get; set; }
        public string? Model { get; set; }

        // Informations sur le client
        public string? UserId { get; set; }
        public string? NomClient { get; set; }
    }
}
