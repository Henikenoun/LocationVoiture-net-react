using System.Collections.Generic;
using System.Threading.Tasks;
using location.Models;
using Microsoft.EntityFrameworkCore;

namespace location.Repository
{
    public class MaintenanceRepository : IMaintenanceRepository
    {
        private readonly VoitureContext _context;

        public MaintenanceRepository(VoitureContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Maintenance>> GetAllMaintenancesAsync()
        {
            return await _context.Maintenances.Include(m => m.Voiture).ThenInclude(v => v.Agence).ToListAsync();
        }

        public async Task<Maintenance> GetMaintenanceByIdAsync(int id)
        {
            return await _context.Maintenances.Include(m => m.Voiture)
                .FirstOrDefaultAsync(m => m.IdMaintenance == id);
        }

        public async Task<Maintenance> AddMaintenanceAsync(Maintenance maintenance)
        {
            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();
            return maintenance;
        }

        public async Task<Maintenance> UpdateMaintenanceAsync(Maintenance maintenance)
        {
            _context.Maintenances.Update(maintenance);
            await _context.SaveChangesAsync();
            return maintenance;
        }

        public async Task<bool> DeleteMaintenanceAsync(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null) return false;

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
