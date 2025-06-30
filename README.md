# 🔗 Guide de Connexion Frontend - Backend LeBon

## 📋 Table des matières
1. [Configuration du Backend](#configuration-du-backend)
2. [Endpoints API Disponibles](#endpoints-api-disponibles)
3. [Authentification JWT](#authentification-jwt)
4. [Exemples d'intégration Frontend](#exemples-dintégration-frontend)
5. [Gestion des erreurs](#gestion-des-erreurs)
6. [Configuration CORS](#configuration-cors)
7. [Documentation Swagger](#documentation-swagger)

---

## 🏗️ Configuration du Backend

### Informations de base
- **URL du serveur** : `http://localhost:3000` (développement)
- **Port par défaut** : 3000
- **Base path API** : `/`
- **Documentation Swagger** : `http://localhost:3000/api`

### Technologies utilisées
- **Framework** : NestJS avec TypeScript
- **Base de données** : PostgreSQL avec TypeORM
- **Authentification** : JWT (JSON Web Tokens)
- **Validation** : class-validator
- **Documentation** : Swagger/OpenAPI

---

## 🔌 Endpoints API Disponibles

### 🔐 Authentification (`/auth`)

#### POST `/auth/register`
**Description** : Enregistrement d'un nouvel utilisateur

**Body** :
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "password": "MonMotDePasse123!",
  "phoneNumber": "+33123456789",
  "role": "client"
}
```

**Remarques** :
- Le champ `role` est optionnel (par défaut: `client`)
- Rôles disponibles : `client`, `vendeur`, `admin`

**Réponse (201)** :
```json
{
  "id": "uuid-string",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phoneNumber": "+33123456789",
  "role": "client",
  "isVerified": false,
  "createdAt": "2025-06-30T10:00:00.000Z"
}
```

**Réponse d'erreur (409)** :
```json
{
  "statusCode": 409,
  "message": "Un utilisateur avec cet email existe déjà",
  "error": "Conflict"
}
```

#### POST `/auth/login`
**Description** : Authentification utilisateur et obtention du token JWT

**Body** :
```json
{
  "email": "admin@lebon.com",
  "password": "Votre_Mot_De_Passe_123"
}
```

**Réponse (200)** :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "client",
  "user": {
    "id": "uuid-string",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "phoneNumber": "+33123456789",
    "role": "client",
    "isVerified": false,
    "createdAt": "2025-06-30T10:00:00.000Z"
  }
}
```

**Réponse d'erreur (401)** :
```json
{
  "statusCode": 401,
  "message": "Identifiants invalides",
  "error": "Unauthorized"
}
```

#### GET `/auth/profile` 🔒
**Description** : Récupérer le profil de l'utilisateur connecté

**Headers** :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse (200)** :
```json
{
  "id": "uuid-string",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phoneNumber": "+33123456789",
  "role": "client",
  "isVerified": false,
  "createdAt": "2025-06-30T10:00:00.000Z"
}
```

#### PUT `/auth/profile` 🔒
**Description** : Mettre à jour le profil de l'utilisateur connecté

**Headers** :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body** (tous les champs sont optionnels) :
```json
{
  "firstName": "Jean-Claude",
  "lastName": "Dupond",
  "phoneNumber": "+33987654321"
}
```

**Réponse (200)** :
```json
{
  "id": "uuid-string",
  "firstName": "Jean-Claude",
  "lastName": "Dupond",
  "email": "jean.dupont@email.com",
  "phoneNumber": "+33987654321",
  "role": "client",
  "isVerified": false,
  "createdAt": "2025-06-30T10:00:00.000Z"
}
```

### 🏠 Propriétés (`/properties`)

#### GET `/properties`
**Description** : Récupérer toutes les propriétés avec filtres optionnels

**Query Parameters** :
- `type` : Type de propriété (appartement, maison, etc.)
- `minPrice` : Prix minimum
- `maxPrice` : Prix maximum
- `city` : Ville
- `status` : Statut (AVAILABLE, SOLD, RENTED)

**Exemple** : `GET /properties?type=appartement&minPrice=100000&maxPrice=500000`

**Réponse (200)** :
```json
[
  {
    "id": 1,
    "title": "Bel appartement centre-ville",
    "description": "Appartement lumineux...",
    "price": 250000,
    "type": "appartement",
    "city": "Paris",
    "address": "123 Rue de la Paix",
    "surface": 65,
    "rooms": 3,
    "status": "AVAILABLE",
    "createdAt": "2025-06-30T10:00:00.000Z",
    "owner": {
      "id": 1,
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@email.com"
    }
  }
]
```

#### POST `/properties` 🔒
**Description** : Créer une nouvelle propriété (authentification requise)

**Headers** :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body** :
```json
{
  "title": "Maison avec jardin",
  "description": "Belle maison familiale avec grand jardin",
  "price": 450000,
  "type": "maison",
  "city": "Lyon",
  "address": "456 Avenue des Fleurs",
  "surface": 120,
  "rooms": 5
}
```

#### GET `/properties/my-properties` 🔒
**Description** : Récupérer les propriétés de l'utilisateur connecté

#### GET `/properties/:id`
**Description** : Récupérer une propriété par son ID

#### PUT `/properties/:id` 🔒
**Description** : Modifier une propriété (propriétaire ou admin uniquement)

#### DELETE `/properties/:id` 🔒
**Description** : Supprimer une propriété (propriétaire ou admin uniquement)

### 💬 Messages (`/messages`)

#### GET `/messages` 🔒
**Description** : Récupérer les messages de l'utilisateur

#### POST `/messages` 🔒
**Description** : Envoyer un message

**Body** :
```json
{
  "content": "Bonjour, je suis intéressé par cette propriété",
  "propertyId": 1,
  "receiverId": 2
}
```

### 👥 Administration (`/admin`) 🔒
**Description** : Endpoints réservés aux administrateurs

#### POST `/admin/create-admin` 🔒
**Description** : Créer un nouveau compte administrateur (admin uniquement)

**Headers** :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body** :
```json
{
  "email": "nouvel.admin@lebon.com",
  "password": "AdminPassword123!",
  "firstName": "Nouveau",
  "lastName": "Administrateur"
}
```

**Réponse (201)** :
```json
{
  "id": "uuid-string",
  "firstName": "Nouveau",
  "lastName": "Administrateur",
  "email": "nouvel.admin@lebon.com",
  "phoneNumber": "N/A",
  "role": "admin",
  "isVerified": true,
  "createdAt": "2025-06-30T10:00:00.000Z"
}
```

### 🛠️ Configuration initiale (`/setup`)
**Description** : Endpoint public pour l'initialisation du système

#### POST `/setup/init-admin`
**Description** : Créer le premier administrateur (endpoint public, pour l'initialisation)

**Body** :
```json
{
  "email": "premier.admin@lebon.com",
  "password": "PremierAdmin123!",
  "firstName": "Premier",
  "lastName": "Admin"
}
```

**Réponse (201)** :
```json
{
  "id": "uuid-string",
  "firstName": "Premier",
  "lastName": "Admin",
  "email": "premier.admin@lebon.com",
  "phoneNumber": "N/A",
  "role": "admin",
  "isVerified": true,
  "createdAt": "2025-06-30T10:00:00.000Z"
}
```

---

## 📋 Résumé des Endpoints Disponibles

### 🔐 **Authentification** (`/auth`)
| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| POST | `/auth/register` | Enregistrement nouvel utilisateur | ❌ Public |
| POST | `/auth/login` | Connexion utilisateur | ❌ Public |
| GET | `/auth/profile` | Récupérer son profil | ✅ Token requis |
| PUT | `/auth/profile` | Mettre à jour son profil | ✅ Token requis |
| GET | `/auth/profile` | Récupérer le profil utilisateur | ✅ Token requis |
| PUT | `/auth/profile` | Mettre à jour le profil utilisateur | ✅ Token requis |

### 🏠 **Propriétés** (`/properties`)
| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | `/properties` | Liste des propriétés (avec filtres) | ❌ Public |
| POST | `/properties` | Créer une propriété | ✅ Token requis |
| GET | `/properties/my-properties` | Mes propriétés | ✅ Token requis |
| GET | `/properties/:id` | Détail d'une propriété | ❌ Public |
| PUT | `/properties/:id` | Modifier une propriété | ✅ Propriétaire/Admin |
| DELETE | `/properties/:id` | Supprimer une propriété | ✅ Propriétaire/Admin |

### 💬 **Messages** (`/messages`)
| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | `/messages` | Mes messages | ✅ Token requis |
| POST | `/messages` | Envoyer un message | ✅ Token requis |

### 👥 **Administration** (`/admin`)
| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | `/admin/dashboard` | Tableau de bord admin | ✅ Admin uniquement |
| POST | `/admin/create-admin` | Créer un admin | ✅ Admin uniquement |

### 🛠️ **Configuration** (`/setup`)
| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| POST | `/setup/init-admin` | Premier admin (initialisation) | ❌ Public |

### 📊 **Types de réponse**
- **200** : Succès (GET, login)
- **201** : Créé avec succès (POST)
- **400** : Données invalides
- **401** : Non authentifié
- **403** : Permissions insuffisantes
- **409** : Conflit (email déjà utilisé)
- **404** : Ressource non trouvée
- **500** : Erreur serveur

### 🔑 **Authentification JWT**
- **Format header** : `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Contenu token** : `{ sub: userId, email, role, iat, exp }`
- **Rôles disponibles** : `client`, `vendeur`, `admin`
- **Rôle par défaut** : `client` (lors de l'enregistrement)

---

## 🔐 Authentification JWT

### Flux d'authentification

1. **Connexion** : L'utilisateur envoie ses identifiants à `/auth/login`
2. **Token reçu** : Le backend retourne un JWT token
3. **Stockage** : Le frontend stocke le token (localStorage, sessionStorage, ou cookie)
4. **Utilisation** : Le token est envoyé dans le header `Authorization` pour les requêtes protégées

### Format du header d'autorisation
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Décodage du token
Le token contient les informations suivantes :
```json
{
  "sub": 1,           // ID de l'utilisateur
  "email": "user@example.com",
  "role": "user",     // Rôle de l'utilisateur
  "iat": 1719741600,  // Timestamp de création
  "exp": 1719828000   // Timestamp d'expiration
}
```

---

## 💻 Exemples d'intégration Frontend

### Avec Vanilla JavaScript

```javascript
// Configuration de base
const API_BASE_URL = 'http://localhost:3000';

// Classe utilitaire pour les appels API
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Ajouter le token si disponible
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur API');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  // Enregistrement d'un nouvel utilisateur
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  }

  // Récupérer le profil de l'utilisateur connecté
  async getProfile() {
    return await this.request('/auth/profile');
  }

  // Mettre à jour le profil de l'utilisateur connecté
  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Connexion
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    this.token = response.access_token;
    localStorage.setItem('access_token', this.token);
    return response;
  }

  // Enregistrement d'un nouvel utilisateur
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  }

  // Créer un administrateur (admin uniquement)
  async createAdmin(adminData) {
    return await this.request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  // Initialiser le premier admin (public)
  async initializeFirstAdmin(adminData) {
    return await this.request('/setup/init-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  // Déconnexion
  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Récupérer les propriétés
  async getProperties(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;
    return await this.request(endpoint);
  }

  // Créer une propriété
  async createProperty(propertyData) {
    return await this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
  }

  // Récupérer mes propriétés
  async getMyProperties() {
    return await this.request('/properties/my-properties');
  }

  // Envoyer un message
  async sendMessage(messageData) {
    return await this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }
}

// Utilisation
const api = new ApiClient();

// Exemple de connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const result = await api.login(email, password);
    console.log('Connexion réussie:', result);
    console.log('Utilisateur connecté:', result.user);
    console.log('Rôle:', result.role);
    // Rediriger vers le dashboard
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
    // Afficher l'erreur à l'utilisateur
  }
});

// Exemple d'enregistrement
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    role: document.getElementById('role').value || 'client' // client par défaut
  };
  
  try {
    const result = await api.register(userData);
    console.log('Enregistrement réussi:', result);
    // Rediriger vers la page de vérification ou connexion
  } catch (error) {
    console.error('Erreur d\'enregistrement:', error.message);
    // Afficher l'erreur à l'utilisateur
  }
});

// Exemple de récupération du profil
async function loadUserProfile() {
  try {
    const profile = await api.getProfile();
    console.log('Profil utilisateur:', profile);
    // Afficher les informations du profil
    document.getElementById('profileName').textContent = `${profile.firstName} ${profile.lastName}`;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileRole').textContent = profile.role;
  } catch (error) {
    console.error('Erreur chargement profil:', error.message);
  }
}

// Exemple de mise à jour du profil
document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const profileData = {
    firstName: document.getElementById('newFirstName').value,
    lastName: document.getElementById('newLastName').value,
    phoneNumber: document.getElementById('newPhoneNumber').value
  };
  
  // Retirer les champs vides
  Object.keys(profileData).forEach(key => {
    if (!profileData[key]) delete profileData[key];
  });
  
  try {
    const result = await api.updateProfile(profileData);
    console.log('Profil mis à jour:', result);
    // Actualiser l'affichage du profil
    loadUserProfile();
  } catch (error) {
    console.error('Erreur mise à jour profil:', error.message);
  }
});
```

### Avec React

```jsx
// hooks/useApi.js
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000';

export const useApi = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur API');
    }
    
    return await response.json();
  };

  const register = async (userData) => {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  };

  const login = async (email, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    setToken(response.access_token);
    localStorage.setItem('access_token', response.access_token);
    return response;
  };

  const login = async (email, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    setToken(response.access_token);
    localStorage.setItem('access_token', response.access_token);
    return response;
  };

  const register = async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  };

  const createAdmin = async (adminData) => {
    return await request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  };

  const initializeFirstAdmin = async (adminData) => {
    return await request('/setup/init-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('access_token');
  };

  return { 
    request, 
    register, 
    login, 
    logout, 
    createAdmin, 
    initializeFirstAdmin, 
    isAuthenticated: !!token 
  };
};

// components/LoginForm.jsx
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};

// components/RegisterForm.jsx
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useApi();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Prénom:</label>
        <input 
          type="text" 
          name="firstName"
          value={formData.firstName} 
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label>Nom:</label>
        <input 
          type="text" 
          name="lastName"
          value={formData.lastName} 
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="email"
          value={formData.email} 
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input 
          type="password" 
          name="password"
          value={formData.password} 
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label>Téléphone:</label>
        <input 
          type="tel" 
          name="phoneNumber"
          value={formData.phoneNumber} 
          onChange={handleChange}
          required 
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  );
};

// components/AdminSetupForm.jsx (pour l'initialisation)
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

const AdminSetupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { initializeFirstAdmin } = useApi();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await initializeFirstAdmin(formData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Initialisation du Premier Administrateur</h3>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="email"
          value={formData.email} 
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label>Mot de passe:</label>
        <input 
          type="password" 
          name="password"
          value={formData.password} 
          onChange={handleChange}
          required 
        />
      </div>
      <div>
        <label>Prénom:</label>
        <input 
          type="text" 
          name="firstName"
          value={formData.firstName} 
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nom:</label>
        <input 
          type="text" 
          name="lastName"
          value={formData.lastName} 
          onChange={handleChange}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer Admin'}
      </button>
    </form>
  );
};

// components/PropertyList.jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { request } = useApi();

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;
      const data = await request(endpoint);
      setProperties(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Propriétés disponibles</h2>
      {properties.map(property => (
        <div key={property.id} className="property-card">
          <h3>{property.title}</h3>
          <p>{property.description}</p>
          <p><strong>Prix:</strong> {property.price}€</p>
          <p><strong>Type:</strong> {property.type}</p>
          <p><strong>Ville:</strong> {property.city}</p>
          <p><strong>Surface:</strong> {property.surface}m²</p>
          <p><strong>Pièces:</strong> {property.rooms}</p>
        </div>
      ))}
    </div>
  );
};
```

### Avec Vue.js

```javascript
// composables/useApi.js
import { ref } from 'vue';

const API_BASE_URL = 'http://localhost:3000';

export const useApi = () => {
  const token = ref(localStorage.getItem('access_token'));
  const isAuthenticated = computed(() => !!token.value);

  const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur API');
    }
    
    return await response.json();
  };

  const login = async (email, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    token.value = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    return response;
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem('access_token');
  };

  return { request, login, logout, isAuthenticated };
};
```

---

## ⚠️ Gestion des erreurs

### Codes d'erreur courants

| Code | Description | Action recommandée |
|------|-------------|-------------------|
| 400 | Bad Request - Données invalides | Vérifier les données envoyées |
| 401 | Unauthorized - Token invalide/expiré | Rediriger vers la connexion |
| 403 | Forbidden - Permissions insuffisantes | Afficher message d'erreur |
| 404 | Not Found - Ressource introuvable | Afficher page d'erreur |
| 500 | Internal Server Error | Réessayer plus tard |

### Exemple de gestion d'erreurs

```javascript
const handleApiError = (error, navigate) => {
  if (error.status === 401) {
    // Token expiré ou invalide
    localStorage.removeItem('access_token');
    navigate('/login');
  } else if (error.status === 403) {
    // Permissions insuffisantes
    alert('Vous n\'avez pas les permissions nécessaires');
  } else if (error.status === 404) {
    // Ressource non trouvée
    navigate('/404');
  } else {
    // Autres erreurs
    console.error('Erreur API:', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
};
```

---

## 🌐 Configuration CORS

Le backend est configuré avec `app.enableCors()` ce qui permet :
- **Toutes les origines** en développement
- **Toutes les méthodes HTTP** (GET, POST, PUT, DELETE, etc.)
- **Tous les headers**

Pour la production, il est recommandé de configurer CORS de manière plus restrictive :

```typescript
// Dans main.ts (pour la production)
app.enableCors({
  origin: ['https://votre-frontend.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 📚 Documentation Swagger

La documentation complète de l'API est disponible à l'adresse :
**http://localhost:3000/api**

Cette documentation vous permet :
- 📖 **Consulter** tous les endpoints disponibles
- 🧪 **Tester** les endpoints directement depuis l'interface
- 📋 **Voir** les schémas de données (DTO)
- 🔐 **S'authentifier** avec le token JWT

### Utilisation de Swagger pour les tests

1. Allez sur `http://localhost:3000/api`
2. Cliquez sur "Authorize" en haut à droite
3. Entrez votre token JWT au format : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Testez vos endpoints directement

---

## 🚀 Recommandations pour la production

### Sécurité
- ✅ Configurer CORS de manière restrictive
- ✅ Utiliser HTTPS
- ✅ Valider toutes les entrées
- ✅ Implémenter une limitation du taux de requêtes
- ✅ Gérer l'expiration des tokens

### Performance
- ✅ Mettre en cache les réponses fréquemment demandées
- ✅ Utiliser la pagination pour les listes
- ✅ Optimiser les requêtes de base de données
- ✅ Compresser les réponses

### Monitoring
- ✅ Implémenter des logs détaillés
- ✅ Surveiller les performances
- ✅ Alertes en cas d'erreur
- ✅ Métriques d'utilisation

---

## 📞 Support et Contact

Pour toute question ou problème :
1. Consultez d'abord la documentation Swagger
2. Vérifiez les logs du serveur
3. Assurez-vous que le token JWT est valide
4. Contactez l'équipe de développement

---

**🎉 Bonne intégration !**

Ce guide couvre tous les aspects essentiels pour connecter votre frontend au backend LeBon. N'hésitez pas à l'adapter selon vos besoins spécifiques.
