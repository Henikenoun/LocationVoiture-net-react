using System.Collections.Generic;
using System.Threading.Tasks;
using location.Models;
using Microsoft.EntityFrameworkCore;

namespace location.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private readonly VoitureContext _context;

        public LocationRepository(VoitureContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Location>> GetAllLocationsAsync()
        {
            return await _context.Locations
                .Include(l => l.Voiture) // Inclure la voiture
                .Include(l => l.User) // Inclure l'utilisateur
                .ToListAsync();
        }

        public async Task<Location> GetLocationByIdAsync(int id)
        {
            return await _context.Locations
                .Include(l => l.Voiture) // Inclure la voiture
                .Include(l => l.User) // Inclure l'utilisateur
                .FirstOrDefaultAsync(l => l.IdLocation == id);
        }


        public async Task<Location> AddLocationAsync(Location location)
        {
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();
            return location;
        }

        public async Task<Location> UpdateLocationAsync(Location location)
        {
            _context.Locations.Update(location);
            await _context.SaveChangesAsync();
            return location;
        }

        public async Task<bool> DeleteLocationAsync(int id)
        {
            var location = await _context.Locations.FindAsync(id);
            if (location == null) return false;

            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
