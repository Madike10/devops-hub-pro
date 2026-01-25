
import { ToolCategory, Tool, Section } from './types';

export const SECTIONS: Section[] = [
  { id: 'definition', title: 'Définition', icon: 'fa-book-open' },
  { id: 'role', title: 'Rôle & Missions', icon: 'fa-user-gear' },
  { id: 'tools', title: 'Outils', icon: 'fa-screwdriver-wrench' },
  { id: 'assistant', title: 'Assistant IA', icon: 'fa-robot' },
];

export const TOOLS_DATA: Tool[] = [
  {
    id: 'jenkins',
    name: 'Jenkins',
    category: ToolCategory.CI_CD,
    description: 'Le serveur d’automatisation open-source le plus populaire pour le CI/CD.',
    useCases: ['Pipelines de build automatique', 'Tests unitaires et d\'intégration', 'Déploiement continu'],
    advantages: ['Écosystème géant de plugins', 'Hautement extensible', 'Gratuit et open-source'],
    icon: 'fa-jenkins',
    color: 'bg-red-500'
  },
  {
    id: 'docker',
    name: 'Docker',
    category: ToolCategory.CONTAINERS,
    description: 'Plateforme permettant de packager des applications dans des conteneurs isolés.',
    useCases: ['Isolation d\'environnement', 'Microservices', 'Simplification du déploiement'],
    advantages: ['Portabilité maximale', 'Léger par rapport aux VMs', 'Standard de l\'industrie'],
    icon: 'fa-docker',
    color: 'bg-blue-600'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes (K8s)',
    category: ToolCategory.ORCHESTRATION,
    description: 'Système d\'orchestration open-source pour automatiser le déploiement et la mise à l\'échelle.',
    useCases: ['Gestion de clusters de conteneurs', 'Auto-scaling', 'Self-healing des applications'],
    advantages: ['Haute disponibilité', 'Scalabilité horizontale performante', 'Cloud-agnostic'],
    icon: 'fa-dharmachakra',
    color: 'bg-indigo-600'
  },
  {
    id: 'terraform',
    name: 'Terraform',
    category: ToolCategory.IAC,
    description: 'Outil d\'Infrastructure as Code pour créer et gérer des ressources cloud via des fichiers de config.',
    useCases: ['Provisioning multi-cloud (AWS, Azure, GCP)', 'Gestion du cycle de vie des infrastructures'],
    advantages: ['Langage déclaratif (HCL)', 'Planification avant exécution', 'Supporte des centaines de providers'],
    icon: 'fa-cloud',
    color: 'bg-purple-600'
  },
  {
    id: 'ansible',
    name: 'Ansible',
    category: ToolCategory.IAC,
    description: 'Outil de configuration et d\'automatisation IT simple et sans agent.',
    useCases: ['Configuration de serveurs', 'Déploiement d\'applications', 'Automatisation des tâches sysadmin'],
    advantages: ['Agentless (via SSH)', 'Apprentissage rapide (YAML)', 'Idempotence native'],
    icon: 'fa-gear',
    color: 'bg-slate-700'
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    category: ToolCategory.MONITORING,
    description: 'Système de monitoring et d\'alerte basé sur les séries temporelles.',
    useCases: ['Collecte de métriques', 'Alerting en temps réel', 'Monitoring de Kubernetes'],
    advantages: ['Modèle de données multi-dimensionnel', 'Langage de requête puissant (PromQL)', 'Intégration facile'],
    icon: 'fa-chart-line',
    color: 'bg-orange-600'
  },
  {
    id: 'grafana',
    name: 'Grafana',
    category: ToolCategory.MONITORING,
    description: 'Logiciel de visualisation de données et de création de tableaux de bord.',
    useCases: ['Tableaux de bord opérationnels', 'Visualisation de métriques Prometheus/SQL', 'Analyse de logs'],
    advantages: ['Visuels magnifiques', 'Nombreuses sources de données', 'Alertes personnalisables'],
    icon: 'fa-desktop',
    color: 'bg-yellow-500'
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: ToolCategory.CI_CD,
    description: 'Automatisation du workflow directement intégrée à GitHub.',
    useCases: ['Workflows CI/CD GitHub-native', 'Automatisation de code review', 'Publishing de packages'],
    advantages: ['Intégration transparente avec le dépôt', 'Marketplace d\'actions', 'Facile à configurer'],
    icon: 'fa-github',
    color: 'bg-black'
  }
];
