using location.Repository;

namespace location.Factory
{
    public interface IPaiementServiceFactory
    {
        IPaiementRepository CreatePaiementRepository();
        ILocationRepository CreateLocationRepository();
    }

}
