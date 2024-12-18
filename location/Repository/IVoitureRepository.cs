using location.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace location.Repository
{
    public interface IVoitureRepository
    {
        Task<IEnumerable<Voiture>> GetAllVoituresAsync();
        Task<Voiture> GetVoitureByIdAsync(int id);
        Task<Voiture> AddVoitureAsync(Voiture voiture);
        Task<Voiture> UpdateVoitureAsync(Voiture voiture);
        Task<bool> DeleteVoitureAsync(int id);
    }
}
