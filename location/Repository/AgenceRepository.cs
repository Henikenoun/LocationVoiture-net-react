using location.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace location.Repository
{
    public class AgenceRepository : IAgenceRepository
    {
        private readonly VoitureContext _context;

        public AgenceRepository(VoitureContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Agence>> GetAllAgencesAsync()
        {
            return await _context.Agences
                .Include(a => a.Employees)
                .Include(a => a.Voitures) 
                .ToListAsync();
        }

        public async Task<Agence> GetAgenceByIdAsync(int id)
        {
            return await _context.Agences
                .Include(a => a.Employees)
                .Include(a => a.Voitures) 
                .FirstOrDefaultAsync(a => a.IdAgence == id);
        }

        public async Task<Agence> AddAgenceAsync(Agence agence)
        {
            _context.Agences.Add(agence);
            await _context.SaveChangesAsync();
            return agence;
        }

        public async Task<Agence> UpdateAgenceAsync(Agence agence)
        {
            _context.Agences.Update(agence);
            await _context.SaveChangesAsync();
            return agence;
        }

        public async Task<bool> DeleteAgenceAsync(int id)
        {
            var agence = await _context.Agences
                .Include(a => a.Employees)
                .Include(a => a.Voitures)
                .FirstOrDefaultAsync(a => a.IdAgence == id);

            if (agence == null)
            {
                return false;
            }

            _context.Agences.Remove(agence);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
