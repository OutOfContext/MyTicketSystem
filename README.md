# MyTicketSystem

Ein vollständiges IT-Support Ticketsystem mit ReactJS Frontend und Spring Boot Backend.

## Funktionen

- **Authentifizierung**: Login und Registrierung mit JWT
- **Rollenverwaltung**: User, Support, Admin Rollen
- **Ticket-Management**: 
  - Tickets erstellen, bearbeiten, löschen
  - Status-Verwaltung (Open, In Progress, Resolved, Closed)
  - Prioritäten (Low, Medium, High, Critical)
  - Zuweisen von Tickets an Support-Mitarbeiter
- **Kommentare**: Diskussionen zu Tickets
- **Suche & Filter**: Nach Status, Priorität und Suchtext
- **Benutzerverwaltung**: Admin kann Rollen verwalten

## Technologien

### Backend
- Spring Boot 3.1.5
- Spring Security mit JWT
- Spring Data JPA
- H2 Datenbank (in-memory)
- Swagger/OpenAPI für API-Dokumentation
- Lombok

### Frontend
- React 18 mit TypeScript
- Material-UI (MUI)
- React Router
- Axios
- Context API für State Management

## Projektstruktur

```
MyTicketSystem/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ticketsystem/
│   │   │   │   ├── config/           # Konfiguration (Security, Swagger, DataInit)
│   │   │   │   ├── controller/       # REST Controllers
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   ├── exception/        # Exception Handler
│   │   │   │   ├── repository/       # JPA Repositories
│   │   │   │   ├── security/         # JWT Security
│   │   │   │   └── service/          # Business Logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── auth/              # Login, Register
    │   │   ├── common/            # Navbar, PrivateRoute
    │   │   ├── tickets/           # Ticket Komponenten
    │   │   └── users/             # User Management
    │   ├── contexts/              # Auth Context
    │   ├── services/              # API Services
    │   ├── types/                 # TypeScript Types
    │   └── App.tsx
    ├── package.json
    └── .env
```

## Installation und Start

### Backend starten

```bash
cd backend
mvn spring-boot:run
```

Der Backend-Server läuft auf `http://localhost:8080`

- API-Endpunkte: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

### Frontend starten

```bash
cd frontend
npm install
npm start
```

Die Frontend-Anwendung läuft auf `http://localhost:3000`

## Standard-Benutzer

Das System wird mit folgenden Test-Benutzern initialisiert:

| Username | Password   | Role    |
|----------|-----------|---------|
| admin    | admin123  | ADMIN   |
| support  | support123| SUPPORT |
| user     | user123   | USER    |

## API-Endpunkte

### Authentifizierung
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrierung

### Tickets
- `GET /api/tickets` - Alle Tickets
- `GET /api/tickets/{id}` - Ticket Details
- `POST /api/tickets` - Ticket erstellen
- `PUT /api/tickets/{id}` - Ticket aktualisieren
- `PATCH /api/tickets/{id}/status` - Status ändern
- `DELETE /api/tickets/{id}` - Ticket löschen (Admin)
- `GET /api/tickets/search` - Tickets suchen
- `GET /api/tickets/my-tickets` - Eigene Tickets
- `GET /api/tickets/assigned-to-me` - Zugewiesene Tickets

### Kommentare
- `GET /api/tickets/{id}/comments` - Kommentare abrufen
- `POST /api/tickets/{id}/comments` - Kommentar hinzufügen
- `DELETE /api/tickets/{ticketId}/comments/{commentId}` - Kommentar löschen (Admin)

### Benutzer
- `GET /api/users` - Alle Benutzer (Support/Admin)
- `GET /api/users/{id}` - Benutzer Details
- `PATCH /api/users/{id}/role` - Rolle ändern (Admin)
- `DELETE /api/users/{id}` - Benutzer löschen (Admin)

## Build für Produktion

### Backend
```bash
cd backend
mvn clean package
java -jar target/ticket-system-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Build-Dateien sind in /build Verzeichnis
```

## Konfiguration

### Backend (application.properties)
- Datenbank-Konfiguration
- JWT Secret und Expiration
- Server Port

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

## Lizenz

Dieses Projekt ist ein Beispielprojekt für Demonstrationszwecke.
