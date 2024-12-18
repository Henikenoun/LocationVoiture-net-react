namespace location.Dto
{
    public class MaintenanceDto
    {
        public DateTime DateEntree { get; set; }
        public DateTime? DateSortie { get; set; }
        public string Description { get; set; }
        public decimal? Cout { get; set; }
        public int VoitureId { get; set; }
    }
}
