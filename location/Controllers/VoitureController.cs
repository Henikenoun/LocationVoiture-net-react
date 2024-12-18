using location.Dto;
using location.Models;
using location.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace location.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VoitureController : ControllerBase
    {
        private readonly IVoitureRepository _repository;
        private readonly UserManager<ApplicationUser> _userManager;

        public VoitureController(IVoitureRepository repository, UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> GetAllVoitures()
        {
            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);

            if (manager == null)
            {
                return Unauthorized(new { Message = "Manager not found." });
            }

            if (!manager.AgenceId.HasValue)
            {
                return BadRequest(new { Message = "Manager does not have an associated AgenceId." });
            }

            var managerAgenceId = manager.AgenceId.Value;
            var voitures = await _repository.GetAllVoituresAsync();

            var voituresDto = voitures
                .Where(v => v.AgenceId == managerAgenceId)
                .Select(v => new VoitureDto
                {
                    id = v.IdVoiture,
                    Matricule = v.Matricule,
                    Marque = v.Marque,
                    Modele = v.Modele,
                    DateFab = v.DateFab,
                    Nature = v.Nature,
                    PrixJourn = v.PrixJourn,
                    AgenceId = v.AgenceId,
                    ImageUrl=v.ImageUrl
                })
                .ToList();

            return Ok(voituresDto);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> GetVoitureById(int id)
        {
            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);

            if (manager == null)
            {
                return Unauthorized(new { Message = "Manager not found." });
            }

            if (!manager.AgenceId.HasValue)
            {
                return BadRequest(new { Message = "Manager does not have an associated AgenceId." });
            }

            var managerAgenceId = manager.AgenceId.Value;
            var voiture = await _repository.GetVoitureByIdAsync(id);

            if (voiture == null || voiture.AgenceId != managerAgenceId)
            {
                return NotFound(new { Message = "Voiture not found or not part of your agency." });
            }

            var voitureDto = new VoitureDto
            {
                Matricule = voiture.Matricule,
                Marque = voiture.Marque,
                Modele = voiture.Modele,
                DateFab = voiture.DateFab,
                Nature = voiture.Nature,
                PrixJourn = voiture.PrixJourn,
                AgenceId = voiture.AgenceId,
                ImageUrl = voiture.ImageUrl
            };

            return Ok(voitureDto);
        }


        [HttpPost]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> AddVoiture([FromBody] VoitureDto dto)
        {
            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);

            if (manager == null)
            {
                return Unauthorized(new { Message = "Manager not found." });
            }

            if (!manager.AgenceId.HasValue)
            {
                return BadRequest(new { Message = "Manager does not have an associated AgenceId." });
            }

            var voiture = new Voiture
            {
                Matricule = dto.Matricule,
                Marque = dto.Marque,
                Modele = dto.Modele,
                DateFab = dto.DateFab,
                Nature = dto.Nature,
                PrixJourn = dto.PrixJourn,
                ImageUrl = dto.ImageUrl,
                AgenceId = manager.AgenceId.Value
            };

            var createdVoiture = await _repository.AddVoitureAsync(voiture);
            return CreatedAtAction(nameof(GetVoitureById), new { id = createdVoiture.IdVoiture }, createdVoiture);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> UpdateVoiture(int id, [FromBody] VoitureDto dto)
        {
            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);

            if (manager == null)
            {
                return Unauthorized(new { Message = "Manager not found." });
            }

            if (!manager.AgenceId.HasValue)
            {
                return BadRequest(new { Message = "Manager does not have an associated AgenceId." });
            }

            var managerAgenceId = manager.AgenceId.Value;
            var existingVoiture = await _repository.GetVoitureByIdAsync(id);

            if (existingVoiture == null || existingVoiture.AgenceId != managerAgenceId)
            {
                return NotFound(new { Message = "Voiture not found or not part of your agency." });
            }

            existingVoiture.Matricule = dto.Matricule;
            existingVoiture.Marque = dto.Marque;
            existingVoiture.Modele = dto.Modele;
            existingVoiture.DateFab = dto.DateFab;
            existingVoiture.Nature = dto.Nature;
            existingVoiture.ImageUrl = dto.ImageUrl;
            existingVoiture.PrixJourn = dto.PrixJourn;

            await _repository.UpdateVoitureAsync(existingVoiture);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteVoiture(int id)
        {
            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);

            if (manager == null)
            {
                return Unauthorized(new { Message = "Manager not found." });
            }

            if (!manager.AgenceId.HasValue)
            {
                return BadRequest(new { Message = "Manager does not have an associated AgenceId." });
            }

            var managerAgenceId = manager.AgenceId.Value;
            var existingVoiture = await _repository.GetVoitureByIdAsync(id);

            if (existingVoiture == null || existingVoiture.AgenceId != managerAgenceId)
            {
                return NotFound(new { Message = "Voiture not found or not part of your agency." });
            }

            var success = await _repository.DeleteVoitureAsync(id);

            if (!success)
            {
                return BadRequest(new { Message = "Failed to delete the voiture." });
            }

            return NoContent();
        }
    }
}
