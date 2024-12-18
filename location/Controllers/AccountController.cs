using location.Dto;
using location.Models;
using location.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace location.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly VoitureContext _context;
        private readonly IAgenceRepository repo;

        public AccountController(UserManager<ApplicationUser> userManager, IConfiguration configuration, VoitureContext context, IAgenceRepository repo)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            this.repo = repo;
        }

        [HttpPost("RegisterManager")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterManager([FromBody] EmployeeDto registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var agence = await _context.Agences.FindAsync(registerDTO.AgenceId);
            if (agence == null)
            {
                return BadRequest(new { Message = "Agence non trouvée." });
            }
            var appUser = new ApplicationUser
            {
                UserName = registerDTO.Email,
                Email = registerDTO.Email,
                Nom = registerDTO.Nom,
                Prenom = registerDTO.Prenom,
                Adresse = registerDTO.Adresse,
                date_naiss = registerDTO.DateNaiss,
                Poste = registerDTO.Poste,
                PhoneNumber = registerDTO.PhoneNumber,
                AgenceId = registerDTO.AgenceId
            };
            var result = await _userManager.CreateAsync(appUser, registerDTO.Password);
            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(appUser, "Manager");
                if (roleResult.Succeeded)
                {
                    return Ok(new { Message = "Le manager a été enregistré avec succès." });
                }

                await _userManager.DeleteAsync(appUser);
                return BadRequest(new { Errors = roleResult.Errors.Select(e => e.Description) });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        [HttpPost("RegisterEmployee")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> RegisterEmployee([FromBody] EmployeeDto registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var managerId = _userManager.GetUserId(User);
            var manager = await _userManager.FindByIdAsync(managerId);
            if (manager == null)
            {
                return Unauthorized(new { Message = "Manager non trouvé." });
            }

            var agence = await _context.Agences.FindAsync(manager.AgenceId);
            if (agence == null)
            {
                return BadRequest(new { Message = "Agence du manager non trouvée." });
            }
            var appUser = new ApplicationUser
            {
                UserName = registerDTO.Email,
                Email = registerDTO.Email,
                Nom = registerDTO.Nom,
                Prenom = registerDTO.Prenom,
                Adresse = registerDTO.Adresse,
                date_naiss = registerDTO.DateNaiss,
                Poste = registerDTO.Poste,
                PhoneNumber = registerDTO.PhoneNumber,
                AgenceId = manager.AgenceId 
            };

            var result = await _userManager.CreateAsync(appUser, registerDTO.Password);
            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(appUser, "Employee");
                if (roleResult.Succeeded)
                {
                    return Ok(new { Message = "L'employé a été enregistré avec succès." });
                }
                await _userManager.DeleteAsync(appUser);
                return BadRequest(new { Errors = roleResult.Errors.Select(e => e.Description) });
            }
            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        [HttpPost("RegisterClient")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterClient([FromBody] ClientDto registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var appUser = new ApplicationUser
            {
                UserName = registerDTO.Email,
                Email = registerDTO.Email,
                Nom = registerDTO.Nom,
                Prenom = registerDTO.Prenom,
                Adresse = registerDTO.Adresse,
                date_naiss = registerDTO.DateNaiss,
                nb_voiture = registerDTO.NbVoiture,
                PhoneNumber = registerDTO.PhoneNumber
            };

            var result = await _userManager.CreateAsync(appUser, registerDTO.Password);
            if (result.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(appUser, "Client");
                if (roleResult.Succeeded)
                {
                    return Ok(new { Message = "Le client a été enregistré avec succès." });
                }

                await _userManager.DeleteAsync(appUser);
                return BadRequest(new { Errors = roleResult.Errors.Select(e => e.Description) });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDto loginDTO)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await _userManager.FindByNameAsync(loginDTO.Email);
                if (user != null)
                {
                    if (await _userManager.CheckPasswordAsync(user, loginDTO.Password))
                    {
                        var roles = await _userManager.GetRolesAsync(user);

                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, user.UserName),
                            new Claim(ClaimTypes.NameIdentifier, user.Id),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                        };
                        foreach (var role in roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, role));
                        }

                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
                        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                        var token = new JwtSecurityToken(
                            issuer: _configuration["JWT:Issuer"],
                            audience: _configuration["JWT:Audience"],
                            claims: claims,
                            expires: DateTime.Now.AddHours(1),
                            signingCredentials: creds
                        );
                        return Ok(new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            expiration = token.ValidTo,
                            username = loginDTO.Email,
                            roles = roles 
                        });
                    }
                    return Unauthorized(new { Message = "Mot de passe incorrect."});
                }

                return BadRequest(new { Message = "Utilisateur non trouvé." });
            }

            return BadRequest(ModelState);
        }

        [HttpGet("GetAllEmployees")]
        [Authorize(Roles = "Manager,Employee")]
        public async Task<IActionResult> GetAllEmployees()
        {
            // Get the current authenticated user's ID
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

            var users = await _userManager.Users.ToListAsync();

            var employees = new List<EmployeeDto>();

            foreach (var user in users)
            {
                if (user != null && await _userManager.IsInRoleAsync(user, "Employee"))
                {
                    if (user.AgenceId == managerAgenceId)
                    {
                        var agence = await repo.GetAgenceByIdAsync(managerAgenceId);
                        var agenceName = agence?.Nom;

                        employees.Add(new EmployeeDto
                        {
                            id = user.Id,
                            Nom = user.Nom,
                            Prenom = user.Prenom,
                            Adresse = user.Adresse,
                            Poste = user.Poste ?? string.Empty,
                            DateNaiss = user.date_naiss,
                            Email = user.Email ?? string.Empty,
                            AgenceName = agenceName,
                            AgenceId = user.AgenceId,
                            PhoneNumber = user.PhoneNumber ?? string.Empty,
                            Role = "Employee"
                        });
                    }
                }
            }

            return Ok(employees);
        }



        [HttpGet("GetAllManagers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllManagers()
        {
            var users = await _userManager.GetUsersInRoleAsync("Manager");

            var employees = new List<EmployeeDto>();
            foreach (var user in users)
            {
                var agence = await _context.Agences.FindAsync(user.AgenceId);
                var agenceName = agence?.Nom;

                employees.Add(new EmployeeDto
                {
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Adresse = user.Adresse,
                    Poste = user.Poste ?? string.Empty,
                    DateNaiss = user.date_naiss,
                    Email = user.Email ?? string.Empty,
                    AgenceName = agenceName,
                    AgenceId = user.AgenceId,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Role = "Manager"
                });
            }
            return Ok(employees);
        }

        [HttpGet("GetAllClients")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllClients()
        {
            var users = await _userManager.Users.ToListAsync();

            var clients = new List<ClientDto>();
            foreach (var user in users)
            {
                if (await _userManager.IsInRoleAsync(user, "Client"))
                {
                    clients.Add(new ClientDto
                    {
                        Nom = user.Nom,
                        Prenom = user.Prenom,
                        Adresse = user.Adresse,
                        NbVoiture = user.nb_voiture,
                        DateInscription = user.date_inscri,
                        DateNaiss = user.date_naiss,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Role = "Client"
                    });
                }
            }

            return Ok(clients);
        }

        [HttpGet("GetCurrentUser")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            // Récupérer l'ID de l'utilisateur actuellement connecté
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized(new { Message = "Utilisateur non authentifié." });
            }

            // Récupérer l'utilisateur par son ID
            var user = await _userManager.FindByIdAsync(currentUserId);
            if (user == null)
            {
                return NotFound(new { Message = "Utilisateur non trouvé." });
            }

            // Créer un DTO selon le rôle de l'utilisateur
            if (await _userManager.IsInRoleAsync(user, "Employee"))
            {
                var agence = await _context.Agences.FindAsync(user.AgenceId);
                var agenceName = agence?.Nom;

                var employeeDto = new EmployeeDto
                {
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Adresse = user.Adresse,
                    Poste = user.Poste ?? string.Empty,
                    DateNaiss = user.date_naiss,
                    Email = user.Email ?? string.Empty,
                    AgenceName = agenceName,
                    AgenceId = user.AgenceId,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Role = "Employee"
                };

                return Ok(employeeDto);
            }

            if (await _userManager.IsInRoleAsync(user, "Manager"))
            {
                var agence = await _context.Agences.FindAsync(user.AgenceId);
                var agenceName = agence?.Nom;

                var managerDto = new EmployeeDto
                {
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Adresse = user.Adresse,
                    Poste = user.Poste ?? string.Empty,
                    DateNaiss = user.date_naiss,
                    Email = user.Email ?? string.Empty,
                    AgenceName = agenceName,
                    AgenceId = user.AgenceId,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Role = "Manager"
                };

                return Ok(managerDto);
            }

            if (await _userManager.IsInRoleAsync(user, "Client"))
            {
                var clientDto = new ClientDto
                {
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Adresse = user.Adresse,
                    NbVoiture = user.nb_voiture,
                    DateInscription = user.date_inscri,
                    DateNaiss = user.date_naiss,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = "Client"
                };

                return Ok(clientDto);
            }
            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                var clientDto = new ClientDto
                {
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Adresse = user.Adresse,
                    NbVoiture = user.nb_voiture??null,
                    DateInscription = user.date_inscri,
                    DateNaiss = user.date_naiss,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = "Admin"
                };

                return Ok(clientDto);
            }

            return BadRequest(new { Message = "Le rôle de l'utilisateur est inconnu." });
        }


        [HttpPut("UpdateEmployee/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateDto)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id != currentUserId && !User.IsInRole("Manager"))
            {
                return Forbid();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "Utilisateur non trouvé." });
            }

            if (updateDto.AgenceId.HasValue)
            {
                var agence = await _context.Agences.FindAsync(updateDto.AgenceId.Value);
                if (agence == null)
                {
                    return BadRequest(new { Message = "Agence non trouvée." });
                }
            }

            user.Nom = updateDto.Nom ?? user.Nom;
            user.Prenom = updateDto.Prenom ?? user.Prenom;
            user.Adresse = updateDto.Adresse ?? user.Adresse;
            user.PhoneNumber = updateDto.PhoneNumber ?? user.PhoneNumber;
            user.date_naiss = updateDto.DateNaiss ?? user.date_naiss;
            user.Poste = updateDto.Poste ?? user.Poste;
            user.nb_voiture = updateDto.NbVoiture.HasValue ? updateDto.NbVoiture.ToString() : null;
            user.AgenceId = updateDto.AgenceId ?? user.AgenceId;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Utilisateur mis à jour avec succès." });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }

        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { Message = "Utilisateur non trouvé." });
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Utilisateur supprimé avec succès." });
            }

            return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
        }
    }
}
