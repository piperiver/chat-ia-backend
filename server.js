// chat-reclutadores-backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Información sobre Felipe Rivera para que la IA responda con contexto
const userProfile = `
Felipe Rivera es un desarrollador de software con más de 10 años de experiencia, actualmente vive en colombia en una hermosa ciudad llamada Cali. Especializado en el desarrollo web y móvil. Inició su carrera como Full Stack Developer, adquiriendo sólidas habilidades en backend y bases de datos, y ha trabajado en proyectos de fintech, startups, e-commerce y e-learning. Se destaca por su capacidad para liderar equipos y gestionar proyectos complejos.

**Experiencia Laboral:**
- **SOY HENRY** – Technical Lead Frontend (08/2023 - 01/2025, 15 meses):  
  - Lideró un equipo frontend de 4 personas en el desarrollo y mantenimiento de aplicaciones educativas.  
  - Tecnologías utilizadas: Next.js 13, TypeScript, Jira, Scrum, CI/CD, AWS Amplify, React Testing Library, Storybook, MDBootstrap, AntDesign, semantic-release.  
  - Casos de éxito: Implementación de semantic release, automatización de pipelines y optimización de flujos de trabajo en Jira.

- **WOLOX PART OF ACCENTURE** – Frontend Developer Senior (12/2020 - 03/2022, 15 meses):  
  - Realizó análisis, diseño e implementación de aplicaciones web para gestión de mapas en centros comerciales, landings y blogs.  
  - Tecnologías utilizadas: React.js v17, Jibestream SDK, TypeScript, Intersection Observer, React Testing Library, GitHub, Material UI, responsive design.

- **THE BRIDGE SOCIAL** – Frontend Developer Senior (12/2022 - 07/2023, 6 meses):  
  - Desarrollo de nuevas funcionalidades en la aplicación Qik (primer banco digital de República Dominicana) y en la landing web de la aplicación.  
  - Tecnologías utilizadas: React Native v0.64, React.js v17, GraphQL, TypeScript, Jira, Scrum, React Testing Library, Storybook, GitLab, Material UI.

- **SISTEL** – Full Stack Developer (01/2019 - 04/2019, 4 meses):  
  - Mantenimiento de la plataforma Sensei (software e-learning) y desarrollo de aplicaciones web y móviles para temas de asistencia y exámenes.  
  - Tecnologías utilizadas: Laravel v5.6, Ionic 2, MySQL, SQL Server, JavaScript, JWT, CodeIgniter, responsive design.

- **VTM SOLUCIONES** – Full Stack Developer (03/2017 - 01/2019, 22 meses):  
  - Desarrollo de software financiero, incluyendo conexión a centrales de riesgo, calculadoras de crédito, módulos de cartera financiera y control de permisos.  
  - Tecnologías utilizadas: Laravel v5.6, Ionic 2, MySQL, JavaScript, JWT, responsive design.

- **JIKKOSOFT** – Full Stack Developer Senior (04/2019 - 11/2020, 19 meses):  
  - Desarrollo de aplicaciones móviles y plataforma web para la administración del impuesto de alumbrado público en Colombia.  
  - Tecnologías utilizadas: Laravel v5.6, React.js, Ionic 2, SQL Server, JavaScript, JWT, responsive design.  
  - Casos de éxito: Implementación de scroll infinito con Intersection Observer, optimización de caché para mapas y creación de un blog tipo medium para desarrolladores.

- **NEXURA** – Full Stack Developer (02/2016 - 03/2017, 13 meses):  
  - Desarrollo de proyectos en PHP puro para temas de gobierno en línea, participando en proyectos como Transmilenio, Ministerio de Transporte, Colpensiones, Findeter y Gobernación del Valle.  
  - Tecnologías utilizadas: PHP, HTML, JavaScript, responsive design, CSS.

- **TISEK** – Full Stack Developer (09/2015 - 02/2016, 7 meses):  
  - Desarrollo de aplicaciones en Android y PHP, integrando webservices con SAP.  
  - Tecnologías utilizadas: PHP, HTML, JavaScript, responsive design, CSS.

**Tecnologías y Habilidades:**
- **Frontend:** React.js (>16.8), React Native (>0.64), Next.js (>12.0 y 13), TypeScript, GraphQL (>15.4), Axios, Socket.io, React Testing Library, Husky, lint-staged, ESLint, custom hooks, Material UI, Storybook, NX Monorepo, Module Federation, Webpack, React Query, React Router.
- **Backend:** Node.js (Express, Nest.js), PHP (Laravel, CodeIgniter).
- **Bases de Datos:** MySQL, PostgreSQL, SQL Server, MongoDB.
- **DevOps y Otros:** CI/CD, AWS Amplify, Google Cloud, Docker, Gitflow, GitHub, Bitbucket, GitLab, SOLID, Atomic Design, Scrum, Agile, Kanban, diseño responsivo, CSS/SASS.

**Educación y Certificaciones:**
- Tecnólogo en Sistemas – Antonio José Camacho (2012-2015).  
- Certificación en Programación Segura – Password Consulting Services (2016).

Felipe es un profesional adaptable, orientado a resultados y siempre actualizado en las últimas tendencias tecnológicas, preparado para enfrentar nuevos desafíos y aportar valor en cada proyecto.
`;

const userProfile2 = `
Felipe Rivera es un Frontend Developer con más de 10 años de experiencia en el desarrollo web y móvil. Destaca como Technical Lead en Soy Henry, donde lideró equipos y optimizó procesos, y ha trabajado en empresas como Skydropx, Wolox (Accenture) y The Bridge Social. Además, cuenta con experiencia como Full Stack Developer en proyectos de fintech, startups, e-commerce y e-learning.
Principales tecnologías: React, React Native, Next.js, TypeScript, GraphQL, CI/CD y AWS Amplify.
Habilidades clave: liderazgo, desarrollo de soluciones escalables y optimización de flujos de trabajo.
`;


// Lista de palabras clave para permitir temas relacionados
// const allowedKeywords = [
//     "experiencia", "trabajo", "tecnología", "proyectos", "habilidades", "frontend", "backend", "React", "Next.js", "Nest.js", "desarrollo"
//   ];

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // Filtrar preguntas irrelevantes
//   if (!allowedTopics.some(topic => message.toLowerCase().includes(topic))) {
//     return res.json({ reply: "Solo puedo responder preguntas relacionadas con mi experiencia laboral y tecnologías que domino." });
//   }

//   try {

    const moderationResponse = await openai.moderations.create({ input: message });
    const flagged = moderationResponse.results[0].flagged;
    if (flagged) {
        return res.json({ reply: "Tu pregunta contiene contenido inapropiado. Solo respondo sobre experiencia profesional." });
    }


    // Paso único: Clasificación y generación de respuesta en una sola consulta
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content:`Usa la siguiente información para responder preguntas sobre Felipe Rivera:\n${userProfile}\nSi la pregunta es sobre su experiencia laboral, responde con detalle. Si no, responde solo con 'no relacionada'.` },
          { role: "user", content: message },
        ],
        max_tokens: 100,
      });
  
      const responseText = completion.choices[0].message.content.toLowerCase();
      if (responseText.includes("no relacionada")) {
        return res.json({ reply: "Solo puedo responder preguntas relacionadas con mi experiencia laboral y tecnologías que domino." });
      }
  
      res.json({ reply: responseText });
    
//   } catch (error) {
//     res.status(500).json({ error: "Error al procesar la solicitud." });
//   }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
