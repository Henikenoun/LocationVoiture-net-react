namespace location.Dto
{
    public class VoitureDto
    {
        public int? id { get; set; }
        public string Matricule { get; set; }
        public string Marque { get; set; }
        public string Modele { get; set; }
        public DateTime DateFab { get; set; }
        public string Nature { get; set; }
        public decimal PrixJourn { get; set; }
        public int? AgenceId { get; set; }
        public string ImageUrl { get; set; }
    }
}
