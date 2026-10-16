// Icons pinned to fixed package versions so they never change underneath us
const DEVICON = 'https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons'
const SIMPLE = 'https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons'
const LOBE = 'https://unpkg.com/@lobehub/icons-static-svg@1.95.1/icons'

// `party: 1-6` = featured card slot (in that order); everything else goes in the PC Box.
// `startDate` (YYYY-MM) drives the "Lv." shown — one level per month of use.

export const aiTools = [
  { name: 'Claude', icon: `${SIMPLE}/claude.svg`, startDate: '2026-04', category: 'AI', party: 6 },
  { name: 'Codex', icon: `${LOBE}/codex.svg`, startDate: '2026-03', category: 'AI' },
  { name: 'OpenCode', icon: `${SIMPLE}/opencode.svg`, startDate: '2026-05', category: 'AI' },
]

export const frontendTools = [
  { name: 'React', icon: `${DEVICON}/react/react-original.svg`, startDate: '2026-02', category: 'Framework', party: 3 },
  { name: 'JavaScript', icon: `${DEVICON}/javascript/javascript-original.svg`, startDate: '2023-08', category: 'Language' },
  { name: 'TypeScript', icon: `${DEVICON}/typescript/typescript-original.svg`, startDate: '2026-04', category: 'Language' },
  { name: 'HTML5', icon: `${DEVICON}/html5/html5-original.svg`, startDate: '2023-08', category: 'Language' },
  { name: 'CSS3', icon: `${DEVICON}/css3/css3-original.svg`, startDate: '2023-08', category: 'Language' },
  { name: 'Tailwind', icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg`, startDate: '2026-03', category: 'Framework' },
  { name: 'Bootstrap', icon: `${DEVICON}/bootstrap/bootstrap-original.svg`, startDate: '2025-01', category: 'Framework' },
]

export const backendTools = [
  { name: 'Python', icon: `${DEVICON}/python/python-original.svg`, startDate: '2026-03', category: 'Language' },
  { name: 'FastAPI', icon: `${DEVICON}/fastapi/fastapi-original.svg`, startDate: '2026-03', category: 'Framework' },
  { name: 'Laravel', icon: `${DEVICON}/laravel/laravel-original.svg`, startDate: '2025-11', category: 'Framework', party: 4 },
  { name: 'PostgreSQL', icon: `${DEVICON}/postgresql/postgresql-original.svg`, startDate: '2024-08', category: 'Database' },
  { name: 'PHP', icon: `${DEVICON}/php/php-original.svg`, startDate: '2025-01', category: 'Language', party: 1 },
  { name: 'Java', icon: `${DEVICON}/java/java-original.svg`, startDate: '2022-08', category: 'Language' },
  { name: 'C#', icon: `${DEVICON}/csharp/csharp-original.svg`, startDate: '2024-01', category: 'Language' },
  { name: 'Node.js', icon: `${DEVICON}/nodejs/nodejs-original.svg`, startDate: '2026-03', category: 'Runtime', party: 2 },
  { name: 'MySQL', icon: `${DEVICON}/mysql/mysql-original.svg`, startDate: '2024-01', category: 'Database', party: 5 },
  { name: 'MongoDB', icon: `${DEVICON}/mongodb/mongodb-original.svg`, startDate: '2026-03', category: 'Database' },
  { name: 'REST API', icon: `${DEVICON}/openapi/openapi-original.svg`, startDate: '2023-08', category: 'Technology' },
]

export const toolsAndVc = [
  { name: 'Git', icon: `${DEVICON}/git/git-original.svg`, startDate: '2026-02', category: 'Tool' },
  { name: 'GitHub', icon: `${DEVICON}/github/github-original.svg`, startDate: '2025-07', category: 'Platform' },
  { name: 'VS Code', icon: `${DEVICON}/vscode/vscode-original.svg`, startDate: '2022-12', category: 'IDE' },
  { name: 'Cursor', icon: `${SIMPLE}/cursor.svg`, startDate: '2026-03', category: 'IDE' },
  { name: 'Antigravity', icon: `${LOBE}/antigravity.svg`, startDate: '2026-04', category: 'IDE' },
  { name: 'Postman', icon: `${DEVICON}/postman/postman-original.svg`, startDate: '2024-02', category: 'Tool' },
  { name: 'ESLint', icon: `${DEVICON}/eslint/eslint-original.svg`, startDate: '2026-02', category: 'Tool' },
  { name: 'Vitest', icon: `${SIMPLE}/vitest.svg`, startDate: '2026-02', category: 'Tool' },
  { name: 'PHPUnit', icon: 'https://phpunit.de/img/phpunit.svg', startDate: '2026-02', category: 'Tool' },
  { name: 'SonarQube', icon: `${DEVICON}/sonarqube/sonarqube-original.svg`, startDate: '2026-02', category: 'Tool' },
  { name: 'Composer', icon: `${DEVICON}/composer/composer-original.svg`, startDate: '2026-02', category: 'Tool' },
  { name: 'npm', icon: `${DEVICON}/npm/npm-original-wordmark.svg`, startDate: '2026-02', category: 'Tool' },
  { name: 'XAMPP', icon: `${SIMPLE}/xampp.svg`, startDate: '2023-03', category: 'Tool' },
  { name: 'Eclipse', icon: `${DEVICON}/eclipse/eclipse-original.svg`, startDate: '2023-01', category: 'IDE' },
]

export const boxGroups = [
  { title: 'AI', tools: aiTools },
  { title: 'Frontend', tools: frontendTools },
  { title: 'Backend', tools: backendTools },
  { title: 'Tools', tools: toolsAndVc },
]

export const partyTools = boxGroups
  .flatMap((g) => g.tools)
  .filter((t) => t.party)
  .sort((a, b) => a.party - b.party)
