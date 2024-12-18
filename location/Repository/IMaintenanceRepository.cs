using System.Collections.Generic;
using System.Threading.Tasks;
using location.Models;

namespace location.Repository
{
    public interface IMaintenanceRepository
    {
        Task<IEnumerable<Maintenance>> GetAllMaintenancesAsync();
        Task<Maintenance> GetMaintenanceByIdAsync(int id);
        Task<Maintenance> AddMaintenanceAsync(Maintenance maintenance);
        Task<Maintenance> UpdateMaintenanceAsync(Maintenance maintenance);
        Task<bool> DeleteMaintenanceAsync(int id);
    }
}
