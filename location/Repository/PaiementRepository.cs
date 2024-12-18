using location.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace location.Repository
{
    public class PaiementRepository : IPaiementRepository
    {
        private readonly VoitureContext _context;

        public PaiementRepository(VoitureContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Récupère tous les paiements, avec les relations de location, voiture et agence incluses.
        /// </summary>
        public async Task<IEnumerable<Paiement>> GetAllPaiementsAsync()
        {
            return await _context.Paiements
                .Include(p => p.Location)
                    .ThenInclude(l => l.Voiture)
                        .ThenInclude(v => v.Agence) // Inclure l'agence associée
                .ToListAsync();
        }

        /// <summary>
        /// Récupère un paiement par son ID, avec les relations incluses.
        /// </summary>
        public async Task<Paiement> GetPaiementByIdAsync(int id)
        {
            return await _context.Paiements
                .Include(p => p.Location)
                    .ThenInclude(l => l.Voiture)
                        .ThenInclude(v => v.Agence)
                .FirstOrDefaultAsync(p => p.IdPaiement == id);
        }

        /// <summary>
        /// Ajoute un nouveau paiement.
        /// </summary>
        public async Task<Paiement> AddPaiementAsync(Paiement paiement)
        {
            await _context.Paiements.AddAsync(paiement);
            await _context.SaveChangesAsync();
            return paiement;
        }

        /// <summary>
        /// Met à jour un paiement existant.
        /// </summary>
        public async Task<Paiement> UpdatePaiementAsync(Paiement paiement)
        {
            var existingPaiement = await _context.Paiements.FindAsync(paiement.IdPaiement);
            if (existingPaiement == null)
                return null;

            _context.Entry(existingPaiement).CurrentValues.SetValues(paiement);
            await _context.SaveChangesAsync();
            return paiement;
        }

        /// <summary>
        /// Supprime un paiement par son ID.
        /// </summary>
        public async Task<bool> DeletePaiementAsync(int id)
        {
            var paiement = await _context.Paiements.FindAsync(id);
            if (paiement == null)
                return false;

            _context.Paiements.Remove(paiement);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
