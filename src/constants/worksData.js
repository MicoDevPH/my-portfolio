import kevinsExpress from '../assets/KevinsExpress.png'
import maxFireman from '../assets/MaxFireman.png'
import myPortfolio from '../assets/MyPortfolio.png'
import ligtas from '../assets/Ligtas.png'
import samyo from '../assets/Samyo ng San Pedro.png'
import ligtasMp3 from '../assets/Ligtas.mp3'
import samyoMp3 from '../assets/Samyo ng San Pedro.mp3'
import saLaguna from '../assets/Sa Laguna.png'
import mahiwagangLaguna from '../assets/Mahiwagang Laguna.png'
import saLagunaMp3 from '../assets/Sa Laguna.mp3'
import mahiwagangLagunaMp3 from '../assets/Mahiwagang Laguna.mp3'
import muiMui from '../assets/Mui Mui.png'
import muiMuiMp3 from '../assets/Mui Mui.mp3'

export const musicWorks = [
  {
    title: 'Sa Laguna',
    desc: 'Entry for Anilag Festival 2023, An original track showing the rich culture of Laguna.',
    longDesc: 'A vibrant pop track created for Anilag Festival 2023, capturing the rich cultural heritage and festive spirit of Laguna through an energetic melody and heartfelt lyrics.',
    year: '2023',
    genre: 'Pop',
    award: 'Anilag Festival 2023 entry',
    img: saLaguna,
    audio: saLagunaMp3,
  },
  {
    title: 'Samyo ng San Pedro',
    desc: 'Original composition celebrating the heritage of San Pedro City, Laguna.',
    longDesc: "An original pop track celebrating the fragrance and culture of San Pedro City, Laguna. A melodic tribute to the city's identity and community spirit.",
    year: '2024',
    genre: 'Pop',
    award: 'Sampaguita Festival 2024 entry',
    img: samyo,
    audio: samyoMp3,
  },
  {
    title: 'Mahiwagang Laguna',
    desc: 'Entry for Anilag Festival 2024, An original track celebrating the beauty of Laguna.',
    longDesc: 'An orchestral pop piece composed for Anilag Festival 2024, weaving together lush instrumental arrangements with enchanting vocals to celebrate the mystical beauty of Laguna\'s landscapes and traditions.',
    year: '2024',
    genre: 'Orchestral Pop',
    award: 'Anilag Festival 2024 entry',
    img: mahiwagangLaguna,
    audio: mahiwagangLagunaMp3,
  },
  {
    title: 'Ligtas',
    desc: 'Awarded 1st Runner Up in the CDRRMO Musikaligtasan 2025 competition.',
    longDesc: 'A J-pop inspired track with a pop-forward sound. Produced as an entry for the CDRRMO Musikaligtasan 2025 competition, where it placed 1st Runner Up.',
    year: '2025',
    genre: 'J-pop',
    award: '1st Runner Up · Musikaligtasan 2025',
    img: ligtas,
    audio: ligtasMp3,
  },
  {
    title: 'Mui Mui',
    desc: 'Track inspired on a short story "Ang Ama"',
    longDesc: 'A genre-blending track fusing rap, hip-hop, and rock, inspired by the short story "Ang Ama" — delivering hard-hitting verses and intense guitar-driven energy that captures the emotional weight and drama of the narrative.',
    year: '2025',
    genre: 'Rap, Hiphop, Rock',
    img: muiMui,
    audio: muiMuiMp3,
  },
]

// Optional per project — only shown when filled in:
//   live: 'https://…', github: 'https://…', role: 'Solo full-stack', outcome: '…'
// `featured: true` gets the wide spotlight card.
export const programmingWorks = [
  {
    title: "Kevin's Express Studio",
    desc: 'Full-stack booking platform for music studio scheduling and management.',
    longDesc: "A full-stack booking platform built for Kevin's Express Studio that streamlines the scheduling and management of studio sessions. Features a responsive frontend with a clean PHP backend handling reservations, client management, and session tracking.",
    features: ['Online booking system with real-time availability', 'Client management and session history tracking', 'Responsive design for desktop and mobile', 'Secure admin dashboard for managing reservations'],
    year: '2025',
    featured: true,
    img: kevinsExpress,
    tags: ['PHP', 'CSS3', 'Html5'],
  },
  {
    title: 'Max Fireman',
    desc: 'AI-powered support platform that diagnoses bugs and automates ticket creation in ClickUp.',
    longDesc: 'An intelligent support platform that leverages AI to diagnose software bugs and automate the entire ticket creation workflow in ClickUp.',
    features: ['AI-powered bug diagnosis and error analysis', 'Automated ClickUp ticket creation with context', 'Real-time status tracking for reported issues', 'User-friendly dashboard for managing support cases'],
    year: '2026',
    img: maxFireman,
    tags: ['React', 'NodeJS', 'Python'],
  },
  {
    title: 'My Portfolio',
    desc: 'Personal portfolio built with Ganymede v1.2, an AI agent developed by Mokusei AI.',
    longDesc: 'A personal portfolio website built with React and Vite, featuring an AI-powered chat assistant powered by Ganymede v1.2.',
    features: ['AI chat assistant (Ganymede) for interactive engagement', 'Smooth scroll animations and responsive design', 'Works carousel with interactive project showcase', 'Contact form with EmailJS integration'],
    year: '2026',
    img: myPortfolio,
    tags: ['React', 'Python'],
  },
]
// URL-safe id for a work, used in #/works/<slug>
export const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
