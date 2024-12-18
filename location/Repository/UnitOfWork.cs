using location.Models;
using location.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly VoitureContext _context;

    public IMaintenanceRepository MaintenanceRepository { get; }
    public IVoitureRepository VoitureRepository { get; }

    public UnitOfWork(VoitureContext context, IMaintenanceRepository maintenanceRepository, IVoitureRepository voitureRepository)
    {
        _context = context;
        MaintenanceRepository = maintenanceRepository;
        VoitureRepository = voitureRepository;
    }

    public async Task<int> SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
