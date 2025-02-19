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
const MAX_MESSAGES = process.env.MAX_MESSAGES; // Cuando la conversación sea larga, resume


const userProfileV1 = `
Felipe Rivera es un desarrollador de software con más de 10 años de experiencia, actualmente vive en colombia en una hermosa ciudad llamada Cali y tiene 30 años. Especializado en el desarrollo web y móvil. Inició su carrera como Full Stack Developer, adquiriendo sólidas habilidades en backend y bases de datos, y ha trabajado en proyectos de fintech, startups, e-commerce y e-learning. Se destaca por su capacidad para liderar equipos y gestionar proyectos complejos.

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

const userProfile = `Felipe Rivera es un desarrollador de software con 10+ años de experiencia especializado en desarrollo frontend y móvil. Tiene liderazgo técnico y experiencia en fintech, startups, e-commerce y e-learning. Reside en Cali, Colombia, y tiene 30 años.

**Experiencia Destacada:**
- **Technical Lead Frontend – Soy Henry (08/2023 - 01/2025):** Lideró equipo de 4 personas. Tecnologías: Next.js 13, TypeScript, CI/CD, AWS Amplify, Scrum, AntDesign, Storybook. Logros: Implementación de semantic release y automatización de pipelines.
- **Frontend Developer Senior – Wolox (12/2020 - 03/2022):** Desarrollo de mapas interactivos y landings. Tecnologías: React 17, TypeScript, Material UI.
- **Frontend Developer Senior – The Bridge Social (12/2022 - 07/2023):** Funcionalidades para banco digital Qik. Tecnologías: React Native 0.64, GraphQL, React.
- **Full Stack Developer – Experiencia previa (2015 - 2020):** Proyectos de software financiero, e-learning, plataformas móviles y gobierno. Tecnologías: Laravel, Ionic, PHP, MySQL, SQL Server.

**Tecnologías Principales:**
- **Frontend:** React, React Native, Next.js, TypeScript, GraphQL, React Testing Library, Material UI, Storybook, Module Federation, NX Monorepo.
- **Backend:** Node.js (Express, Nest.js), PHP (Laravel, CodeIgniter).
- **Bases de Datos:** MySQL, PostgreSQL, SQL Server, MongoDB.
- **DevOps y Otros:** CI/CD, AWS Amplify, Docker, Scrum, Atomic Design, diseño responsivo.

**Educación:**
- Tecnólogo en Sistemas – Antonio José Camacho (2012-2015).`;

app.post('/api/chat', async (req, res) => {
  const { message, prevMessages } = req.body;
  let newMessages = prevMessages.length > 0 ? prevMessages.map(m => ({role: m.role, content: m.text})) : [];
    
  try {
    const moderationResponse = await openai.moderations.create({ input: message });
    const flagged = moderationResponse.results[0].flagged;
    if (flagged) {
        return res.json({ reply: "Tu pregunta contiene contenido inapropiado. Solo respondo sobre experiencia profesional." });
    }


    if (newMessages.length > MAX_MESSAGES) {
        const resumen = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [
            ...newMessages,
            { role: "user", content: "Resume esta conversación brevemente para que podamos continuar." }
          ],
          max_tokens: 200,
        });
        const resumenTexto = resumen.choices[0].message.content;

        newMessages = [
          { role: "system", content: `Resumen del chat hasta ahora: ${resumenTexto}` }
        ];
      }
 
    const conversation = [
        ...newMessages,
        { role: "system", content: `Vas a pasarte por mi, quien te realizara las preguntas, sera un reclutador que esta interesado en mi perfil, asi que se amigable y hazme lucir bien, esta es toda la informacion sobre mi:\n${userProfile}\n. Tambien puedes utilizar el historial del chat para responder. Si no puedes responder, responde solo con 'no relacionada'.` },
        { role: "user", content: message },
    ];

    // Paso único: Clasificación y generación de respuesta en una sola consulta
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        // model: "gpt-4-turbo",
        messages: conversation,
        max_tokens: 200, 
      });
  
      const responseText = completion.choices[0].message.content.toLowerCase();
      if (responseText.includes("no relacionada")) {
        return res.json({ reply: "Solo puedo responder preguntas relacionadas con mi experiencia laboral y tecnologías que domino." });
      }

      res.json({ reply: responseText });
    
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));