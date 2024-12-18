using location.Repository;

public interface IUnitOfWork : IDisposable
{
    IMaintenanceRepository MaintenanceRepository { get; }
    IVoitureRepository VoitureRepository { get; }
    Task<int> SaveAsync();
}
