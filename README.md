# DoofPlus Web Application (reference)

Reference implementation of the DoofPlus Web Application, built from the Figma mock-ups of the project report (chapter 4). The team uses it as a guide for [IngesCompany-Frontend](https://github.com/IngesCompany-7742/IngesCompany-Frontend), the official repository.

It follows the structure of the course base project: Angular 22, Angular Material, ngx-translate (English and Spanish) and a fake REST API with json-server. Each bounded context has its own `domain`, `application`, `infrastructure` and `presentation` layers.

| Bounded context | Folder |
|-----------------|--------|
| Identity & Access Management | `src/app/iam` |
| Organizations & Profiles | `src/app/organizations` |
| Subscriptions & Payments | `src/app/subscriptions` |
| Manufacturing & Batch Management | `src/app/manufacturing` |
| IoT Monitoring | `src/app/monitoring` |
| Quality & Compliance | `src/app/quality` |

## Run

```bash
npm install
npx json-server --watch server/db.json --routes server/routes.json --port 3000
npm start
```

Open `http://localhost:4200/`. The fake API runs at `http://localhost:3000/api/v1`.
