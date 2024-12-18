using location.Factory;
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
    public class PaiementController : ControllerBase
    {
        private readonly IPaiementServiceFactory _paiementServiceFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> userManager;
        //private readonly IClientRepository clientRepository; // Add the clientRepository field

        public PaiementController(IPaiementServiceFactory paiementServiceFactory, IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager) // Add clientRepository parameter to the constructor
        {
            _paiementServiceFactory = paiementServiceFactory;
            _httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
            //this.clientRepository = clientRepository; // Assign the clientRepository parameter to the field
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllPaiements()
        {
            var paiementRepository = _paiementServiceFactory.CreatePaiementRepository();  // Création via la factory
            var paiements = await paiementRepository.GetAllPaiementsAsync();

            var response = paiements.Select(p => new PaiementResponseDto
            {
                IdPaiement = p.IdPaiement,
                DatePaiement = p.DatePaiement,
                Montant = p.Montant,
                LocationId = p.LocationId,
                MatriculeVoiture = p.Location?.Voiture?.Matricule ?? "N/A",
                MarqueVoiture = p.Location?.Voiture?.Marque ?? "N/A",
                NomAgence = p.Location?.Voiture?.Agence?.Nom ?? "N/A"
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPaiementById(int id)
        {
            var paiementRepository = _paiementServiceFactory.CreatePaiementRepository();  // Création via la factory
            var paiement = await paiementRepository.GetPaiementByIdAsync(id);
            if (paiement == null)
                return NotFound(new { message = "Paiement introuvable." });

            var response = new PaiementResponseDto
            {
                IdPaiement = paiement.IdPaiement,
                DatePaiement = paiement.DatePaiement,
                Montant = paiement.Montant,
                LocationId = paiement.LocationId,
                MatriculeVoiture = paiement.Location?.Voiture?.Matricule ?? "N/A",
                MarqueVoiture = paiement.Location?.Voiture?.Marque ?? "N/A",
                NomAgence = paiement.Location?.Voiture?.Agence?.Nom ?? "N/A"
            };

            return Ok(response);
        }

        [HttpPost("payer")]
        [Authorize]
        public async Task<IActionResult> PayerLocation([FromBody] PaiementRequestDto paiementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var locationRepository = _paiementServiceFactory.CreateLocationRepository();  // Création via la factory
            var location = await locationRepository.GetLocationByIdAsync(paiementDto.LocationId);
            if (location == null)
                return NotFound(new { message = "La location spécifiée est introuvable." });

            if (paiementDto.Montant != (decimal)location.PrixTotal)
                return BadRequest(new { message = "Le montant du paiement ne correspond pas au montant dû." });

            var paiementRepository = _paiementServiceFactory.CreatePaiementRepository();  // Création via la factory
            var paiement = new Paiement
            {
                DatePaiement = paiementDto.DatePaiement,
                Montant = paiementDto.Montant,
                LocationId = paiementDto.LocationId,
                Location = location
            };

            var createdPaiement = await paiementRepository.AddPaiementAsync(paiement);

            // Get the Client associated with the Location
            var client = await userManager.FindByIdAsync(location.UserId);

            if (client == null)
                return NotFound(new { message = "Client not found." });

            // Increment the NbVoiture field
            client.nb_voiture = (client.nb_voiture) + 1;  // Assuming NbVoiture can be null, defaulting it to 0
            await userManager.UpdateAsync(client);  // Save the updated client

            var responseDto = new PaiementResponseDto
            {
                IdPaiement = createdPaiement.IdPaiement,
                DatePaiement = createdPaiement.DatePaiement,
                Montant = createdPaiement.Montant,
                LocationId = createdPaiement.LocationId,
                MatriculeVoiture = location.Voiture?.Matricule ?? "N/A",
                MarqueVoiture = location.Voiture?.Marque ?? "N/A",
                NomAgence = location.Voiture?.Agence?.Nom ?? "N/A"
            };

            return CreatedAtAction(nameof(GetPaiementById), new { id = responseDto.IdPaiement }, responseDto);
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePaiement(int id, [FromBody] Paiement paiement)
        {
            if (id != paiement.IdPaiement)
                return BadRequest();

            var paiementRepository = _paiementServiceFactory.CreatePaiementRepository();  // Création via la factory
            var existingPaiement = await paiementRepository.GetPaiementByIdAsync(id);
            if (existingPaiement == null)
                return NotFound();

            await paiementRepository.UpdatePaiementAsync(paiement);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePaiement(int id)
        {
            var paiementRepository = _paiementServiceFactory.CreatePaiementRepository();  // Création via la factory
            var success = await paiementRepository.DeletePaiementAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
