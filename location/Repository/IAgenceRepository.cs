using System.Collections.Generic;
using System.Threading.Tasks;
using location.Models;

namespace location.Repository
{
    public interface IAgenceRepository
    {
        Task<IEnumerable<Agence>> GetAllAgencesAsync();
        Task<Agence> GetAgenceByIdAsync(int id);
        Task<Agence> AddAgenceAsync(Agence agence);
        Task<Agence> UpdateAgenceAsync(Agence agence);
        Task<bool> DeleteAgenceAsync(int id);
    }
}
