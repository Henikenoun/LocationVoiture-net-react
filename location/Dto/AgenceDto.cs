using location.Dto;

public class AgenceDto
{
    public int? id{ get; set; }
    public string Nom { get; set; }
    public string Adresse { get; set; }
    public string Tel { get; set; }
    public List<EmployeeDto>? Employees { get; set; } = new List<EmployeeDto>();
    public List<VoitureDto>? Voitures { get; set; } = new List<VoitureDto>();
}