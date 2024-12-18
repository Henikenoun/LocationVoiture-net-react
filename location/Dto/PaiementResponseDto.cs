public class PaiementResponseDto
{
    public int IdPaiement { get; set; }
    public DateTime DatePaiement { get; set; }
    public decimal Montant { get; set; }
    public int LocationId { get; set; }
    public string MatriculeVoiture { get; set; }
    public string MarqueVoiture { get; set; }
    public string NomAgence { get; set; }
}
