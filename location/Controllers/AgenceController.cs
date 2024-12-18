using location.Dto;
using location.Models;
using location.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace location.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Restrict all actions in this controller by default
    public class AgenceController : ControllerBase
    {
        private readonly IAgenceRepository _repository;
        private readonly UserManager<ApplicationUser> _userManager;

        public AgenceController(IAgenceRepository repository, UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            this._userManager = userManager;
        }

        // Accessible uniquement par les Admins
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllAgences()
        {
            var agences = await _repository.GetAllAgencesAsync();

            var agencesDto = agences.Select(a => new AgenceDto
            {
                id=a.IdAgence,
                Nom = a.Nom,
                Adresse = a.Adresse,
                Tel = a.Tel,
                Employees = a.Employees.Select(e => new EmployeeDto
                {
                    Nom = e.Nom,
                    Prenom = e.Prenom,
                    Poste = e.Poste
                }).ToList(),
                Voitures = a.Voitures.Select(v => new VoitureDto
                {
                    id = v.IdVoiture,
                    Marque = v.Marque,
                    Modele = v.Modele,
                    Matricule = v.Matricule,
                    ImageUrl = v.ImageUrl,
                    Nature = v.Nature,
                    PrixJourn =v.PrixJourn
                }).ToList()
            }).ToList();

            return Ok(agencesDto);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetAgenceById(int id)
        {
            var agence = await _repository.GetAgenceByIdAsync(id);
            if (agence == null) return NotFound();

            var agenceDto = new AgenceDto
            {
                id = agence.IdAgence,
                Nom = agence.Nom,
                Adresse = agence.Adresse,
                Tel = agence.Tel,
                Employees = agence.Employees.Select(e => new EmployeeDto
                {
                    Nom = e.Nom,
                    Prenom = e.Prenom,
                    Poste = e.Poste
                }).ToList(),
                Voitures = agence.Voitures.Select(v => new VoitureDto
                {
                    id=v.IdVoiture,
                    Marque = v.Marque,
                    Modele = v.Modele,
                    Matricule = v.Matricule,
                    ImageUrl = v.ImageUrl,
                    Nature = v.Nature,
                    PrixJourn=v.PrixJourn
                }).ToList()
            };


            return Ok(agenceDto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddAgence([FromBody] AgenceDto dto)
        {
            var agence = new Agence
            {
                Nom = dto.Nom,
                Adresse = dto.Adresse,
                Tel = dto.Tel
            };

            var createdAgence = await _repository.AddAgenceAsync(agence);
            return CreatedAtAction(nameof(GetAgenceById), new { id = createdAgence.IdAgence }, createdAgence);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> UpdateAgence(int id, [FromBody] AgenceDto dto)
        {
            var existingAgence = await _repository.GetAgenceByIdAsync(id);
            if (existingAgence == null)
                return NotFound();

            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);

            if (manager == null || manager.AgenceId != existingAgence.IdAgence)
            {
                return Unauthorized(new { Message = "Vous n'avez pas l'autorisation de modifier cette agence." });
            }
            existingAgence.Nom = dto.Nom;
            existingAgence.Adresse = dto.Adresse;
            existingAgence.Tel = dto.Tel;

            await _repository.UpdateAgenceAsync(existingAgence);
            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAgence(int id)
        {
            var success = await _repository.DeleteAgenceAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}
