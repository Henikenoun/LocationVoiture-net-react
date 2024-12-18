using System.Collections.Generic;
using System.Threading.Tasks;
using location.Models;

namespace location.Repository
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Location>> GetAllLocationsAsync();
        Task<Location> GetLocationByIdAsync(int id);
        Task<Location> AddLocationAsync(Location location);
        Task<Location> UpdateLocationAsync(Location location);
        Task<bool> DeleteLocationAsync(int id);
    }
}
