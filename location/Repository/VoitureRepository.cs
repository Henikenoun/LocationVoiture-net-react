using location.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace location.Repository
{
    public class VoitureRepository : IVoitureRepository
    {
        private readonly VoitureContext _context;

        public VoitureRepository(VoitureContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Voiture>> GetAllVoituresAsync()
        {
            return await _context.Voitures.Include(v => v.Agence).ToListAsync();
        }

        public async Task<Voiture> GetVoitureByIdAsync(int id)
        {
            return await _context.Voitures.Include(v => v.Agence).FirstOrDefaultAsync(v => v.IdVoiture == id);
        }

        public async Task<Voiture> AddVoitureAsync(Voiture voiture)
        {
            _context.Voitures.Add(voiture);
            await _context.SaveChangesAsync();
            return voiture;
        }

        public async Task<Voiture> UpdateVoitureAsync(Voiture voiture)
        {
            _context.Voitures.Update(voiture);
            await _context.SaveChangesAsync();
            return voiture;
        }

        public async Task<bool> DeleteVoitureAsync(int id)
        {
            var voiture = await _context.Voitures.FindAsync(id);
            if (voiture == null) return false;

            _context.Voitures.Remove(voiture);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
