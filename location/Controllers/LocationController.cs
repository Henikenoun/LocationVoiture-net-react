using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using location.Dto;
using location.Models;
using location.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace location.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LocationController : ControllerBase
    {
        private readonly ILocationRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationController(ILocationRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllLocations()
        {
            var locations = await _repository.GetAllLocationsAsync();

            var locationDtos = locations.Select(l => new LocationDto
            {
                IdLocation = l.IdLocation,
                DateDebut = l.DateDebut,
                DateFin = l.DateFin,
                PrixTotal = l.PrixTotal,
                VoitureId = l.VoitureId,
                MarqueVoiture = l.Voiture.Marque,
                Model = l.Voiture.Modele,
                UserId = l.UserId,
                NomClient = l.User.Nom
            }).ToList();

            return Ok(locationDtos);
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetLocationById(int id)
        {
            var location = await _repository.GetLocationByIdAsync(id);
            if (location == null) return NotFound();

            var locationDto = new LocationDto
            {
                IdLocation = location.IdLocation,
                DateDebut = location.DateDebut,
                DateFin = location.DateFin,
                PrixTotal = location.PrixTotal,
                VoitureId = location.VoitureId,
                MarqueVoiture = location.Voiture?.Marque,
                UserId = location.UserId,
                NomClient = location.User?.Nom
            };

            return Ok(locationDto);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddLocation([FromBody] LocationDto locationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Impossible de récupérer l'utilisateur connecté.");
            }
            var location = new Location
            {
                DateDebut = locationDto.DateDebut,
                DateFin = locationDto.DateFin,
                PrixTotal = locationDto.PrixTotal,
                VoitureId = locationDto.VoitureId,
                UserId = userId
            };

            var createdLocation = await _repository.AddLocationAsync(location);

            var createdLocationDto = new LocationDto
            {
                IdLocation = createdLocation.IdLocation,
                DateDebut = createdLocation.DateDebut,
                DateFin = createdLocation.DateFin,
                PrixTotal = createdLocation.PrixTotal,
                VoitureId = createdLocation.VoitureId,
                MarqueVoiture = createdLocation.Voiture?.Marque,
                UserId = createdLocation.UserId,
                NomClient = createdLocation.User?.Nom
            };

            return CreatedAtAction(nameof(GetLocationById), new { id = createdLocation.IdLocation }, createdLocationDto);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateLocation(int id, [FromBody] LocationDto locationDto)
        {
            if (id != locationDto.IdLocation) return BadRequest("ID mismatch");

            var existingLocation = await _repository.GetLocationByIdAsync(id);
            if (existingLocation == null) return NotFound();
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Impossible de récupérer l'utilisateur connecté.");
            }
            existingLocation.DateDebut = locationDto.DateDebut;
            existingLocation.DateFin = locationDto.DateFin;
            existingLocation.PrixTotal = locationDto.PrixTotal;
            existingLocation.VoitureId = locationDto.VoitureId;
            existingLocation.UserId = userId;

            await _repository.UpdateLocationAsync(existingLocation);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var success = await _repository.DeleteLocationAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }
}
