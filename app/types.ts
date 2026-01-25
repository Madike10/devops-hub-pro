
export enum ToolCategory {
  CI_CD = 'CI/CD & Automation',
  CONTAINERS = 'Conteneurisation',
  ORCHESTRATION = 'Orchestration',
  IAC = 'Infrastructure as Code (IaC)',
  MONITORING = 'Monitoring & Logging',
  SCM = 'Source Control Management',
  SECURITY = 'DevSecOps & Security'
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  useCases: string[];
  advantages: string[];
  icon: string;
  color: string;
}

export interface Section {
  id: string;
  title: string;
  icon: string;
}
