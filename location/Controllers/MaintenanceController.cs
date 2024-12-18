using System;
using System.Linq;
using System.Threading.Tasks;
using location.Dto;
using location.Models;
using location.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace location.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MaintenanceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public MaintenanceController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> GetAllMaintenances()
        {
            try
            {
                var maintenances = await _unitOfWork.MaintenanceRepository.GetAllMaintenancesAsync();

                var response = maintenances.Select(maintenance => new ResponseMaintenanceDto
                {
                    IdMaintenance = maintenance.IdMaintenance,
                    DateEntree = maintenance.DateEntree,
                    DateSortie = maintenance.DateSortie,
                    Description = maintenance.Description,
                    Cout = maintenance.Cout,
                    Matricule = maintenance.Voiture?.Matricule ?? string.Empty,
                    Marque = maintenance.Voiture?.Marque ?? string.Empty,
                    Agence = maintenance.Voiture?.Agence?.Nom ?? string.Empty,
                    Model = maintenance.Voiture?.Modele ?? string.Empty,
                    VoitureId = maintenance.VoitureId
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur est survenue : {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> GetMaintenanceById(int id)
        {
            try
            {
                var maintenance = await _unitOfWork.MaintenanceRepository.GetMaintenanceByIdAsync(id);

                if (maintenance == null)
                    return NotFound();

                var response = new ResponseMaintenanceDto
                {
                    IdMaintenance = maintenance.IdMaintenance,
                    DateEntree = maintenance.DateEntree,
                    DateSortie = maintenance.DateSortie,
                    Description = maintenance.Description,
                    Cout = maintenance.Cout,
                    Matricule = maintenance.Voiture?.Matricule ?? string.Empty,
                    Marque = maintenance.Voiture?.Marque ?? string.Empty,
                    Agence = maintenance.Voiture?.Agence?.Nom ?? string.Empty,
                    Model = maintenance.Voiture?.Modele ?? string.Empty,
                    VoitureId = maintenance.VoitureId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur est survenue : {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> AddMaintenance([FromBody] MaintenanceDto maintenanceDto)
        {
            if (maintenanceDto == null)
                return BadRequest("Le corps de la requête est vide ou invalide.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var voiture = await _unitOfWork.VoitureRepository.GetVoitureByIdAsync(maintenanceDto.VoitureId);
                if (voiture == null)
                {
                    return NotFound($"La voiture avec l'ID {maintenanceDto.VoitureId} n'existe pas.");
                }

                var maintenance = new Maintenance
                {
                    DateEntree = maintenanceDto.DateEntree,
                    DateSortie = maintenanceDto.DateSortie,
                    Description = maintenanceDto.Description,
                    Cout = maintenanceDto.Cout.HasValue ? Convert.ToDouble(maintenanceDto.Cout) : null,
                    VoitureId = maintenanceDto.VoitureId
                };

                // Ajouter la maintenance
                await _unitOfWork.MaintenanceRepository.AddMaintenanceAsync(maintenance);

                // Sauvegarde des modifications
                await _unitOfWork.SaveAsync();

                return CreatedAtAction(nameof(GetMaintenanceById), new { id = maintenance.IdMaintenance }, maintenance);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur est survenue : {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> UpdateMaintenance(int id, [FromBody] MaintenanceDto maintenanceDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var existingMaintenance = await _unitOfWork.MaintenanceRepository.GetMaintenanceByIdAsync(id);
                if (existingMaintenance == null)
                    return NotFound();

                var voiture = await _unitOfWork.VoitureRepository.GetVoitureByIdAsync(maintenanceDto.VoitureId);
                if (voiture == null)
                {
                    return NotFound($"La voiture avec l'ID {maintenanceDto.VoitureId} n'existe pas.");
                }

                existingMaintenance.DateEntree = maintenanceDto.DateEntree;
                existingMaintenance.DateSortie = maintenanceDto.DateSortie;
                existingMaintenance.Description = maintenanceDto.Description;
                existingMaintenance.Cout = (double?)maintenanceDto.Cout;
                existingMaintenance.VoitureId = maintenanceDto.VoitureId;

                // Mise à jour de la maintenance
                await _unitOfWork.MaintenanceRepository.UpdateMaintenanceAsync(existingMaintenance);

                // Sauvegarde des modifications
                await _unitOfWork.SaveAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur est survenue : {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            try
            {
                var success = await _unitOfWork.MaintenanceRepository.DeleteMaintenanceAsync(id);
                if (!success)
                    return NotFound();

                // Sauvegarde des modifications
                await _unitOfWork.SaveAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur est survenue : {ex.Message}");
            }
        }
    }
}
