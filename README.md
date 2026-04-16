# duBLE — Boutique de Repostería Artesanal

Sistema de pedidos MVP para **duBLE Pastelería Artesanal**. Catálogo dinámico, carrito y checkout vía WhatsApp.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express (MVC) |
| Base de datos | MongoDB Atlas + Mongoose |
| Frontend | HTML5, Tailwind CDN, Vanilla JS |
| Proceso | PM2 |
| CI/CD | GitHub Actions → EC2 |

---

## Estructura

```
duBLE/
├── .github/workflows/deploy.yml  ← CI/CD automático
├── public/
│   ├── index.html                ← Landing page
│   ├── catalogo.html             ← Catálogo + carrito
│   ├── css/style.css
│   └── js/
│       ├── script.js
│       └── catalog.js
├── models/         Product.js, Order.js
├── controllers/    productController.js, orderController.js
├── routes/         productRoutes.js, orderRoutes.js
├── middleware/     errorHandler.js
├── config/         db.js
├── server.js
├── seeder.js
├── ecosystem.config.js           ← PM2
└── .env.example                  ← Plantilla de variables
```

---

## Instalación local

```bash
git clone git@github.com:eduartrob/duBLE.git
cd duBLE
npm install
cp .env.example .env   # Llenar con tus valores reales
npm run seed           # Poblar productos en MongoDB
npm run dev
```

---

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`. **Nunca subas `.env` al repositorio.**

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default 3000) |
| `MONGO_URI` | Connection string de MongoDB Atlas |
| `WHATSAPP_NUMBER` | Número en formato `521XXXXXXXXXX` |

---

## CI/CD — Deploy automático

Cada push a `main` despliega automáticamente en EC2 vía GitHub Actions.

### Secrets requeridos en GitHub

Ve a **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|---|---|
| `EC2_HOST` | IP pública de la instancia |
| `EC2_USER` | `ec2-user` o `ubuntu` |
| `EC2_SSH_KEY` | Contenido completo del archivo `.pem` |

---

## Seguridad

- `.env` está en `.gitignore` — las credenciales nunca tocan el repositorio.
- El `.pem` de EC2 se almacena **solo** como GitHub Secret, nunca en el código.
- MongoDB Atlas debe tener **IP Whitelist** configurada con la IP del EC2.
- El Security Group de EC2 debe exponer **solo** los puertos necesarios (22 para SSH, 3000 o 80 para HTTP).
- En producción se recomienda poner **Nginx** como reverse proxy frente a Node para no exponer el puerto 3000 directamente.

---

## Scripts

```bash
npm start       # Producción
npm run dev     # Desarrollo con nodemon
npm run seed    # Poblar base de datos
```

---

© 2026 duBLE Pastelería Artesanal
