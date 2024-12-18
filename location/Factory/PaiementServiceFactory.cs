using location.Models;
using location.Repository;

namespace location.Factory
{
    public class PaiementServiceFactory : IPaiementServiceFactory
    {
        private readonly VoitureContext _context;

        public PaiementServiceFactory(VoitureContext context)
        {
            _context = context;
        }

        public IPaiementRepository CreatePaiementRepository()
        {
            return new PaiementRepository(_context); 
        }

        public ILocationRepository CreateLocationRepository()
        {
            return new LocationRepository(_context); 
        }
    }

}
