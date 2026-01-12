import { Template } from '@/types';

export const TEMPLATES: Template[] = [
  {
    roleName: 'Software Engineer',
    attributes: ['System Design', 'Programming', 'Debugging', 'Communication', 'Documentation'],
  },
  {
    roleName: 'UX Designer',
    attributes: ['Visual Design', 'User Research', 'Prototyping', 'Accessibility', 'Collaboration'],
  },
  {
    roleName: 'Product Manager',
    attributes: ['Strategy', 'Prioritization', 'Stakeholder Mgmt', 'Analytics', 'Communication'],
  },
  {
    roleName: 'Data Scientist',
    attributes: ['Statistics', 'Machine Learning', 'Data Viz', 'SQL', 'Storytelling'],
  },
  {
    roleName: 'DevOps Engineer',
    attributes: ['Infrastructure', 'CI/CD', 'Monitoring', 'Security', 'Automation'],
  },
  {
    roleName: 'Technical Writer',
    attributes: ['Clarity', 'Research', 'Organization', 'Empathy', 'Tool Proficiency'],
  },
  {
    roleName: 'QA Engineer',
    attributes: ['Test Planning', 'Automation', 'Bug Analysis', 'Attention to Detail', 'Communication'],
  },
  {
    roleName: 'Team Lead',
    attributes: ['Leadership', 'Mentorship', 'Delegation', 'Conflict Resolution', 'Vision'],
  },
  {
    roleName: 'Adventurer',
    attributes: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'],
  },
  {
    roleName: 'Creative',
    attributes: ['Imagination', 'Execution', 'Taste', 'Persistence', 'Collaboration'],
  },
];

// Random placeholder nouns for new attributes
export const PLACEHOLDER_NOUNS = [
  'Heart', 'Strength', 'Humor', 'Wisdom', 'Speed',
  'Focus', 'Grit', 'Grace', 'Spark', 'Vision',
  'Drive', 'Calm', 'Fire', 'Edge', 'Flow',
  'Depth', 'Light', 'Shadow', 'Storm', 'Stone',
];

export function getRandomPlaceholders(count: number): string[] {
  const shuffled = [...PLACEHOLDER_NOUNS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomPlaceholder(exclude: string[] = []): string {
  const available = PLACEHOLDER_NOUNS.filter(n => !exclude.includes(n));
  if (available.length === 0) {
    return `Attribute ${Math.floor(Math.random() * 100)}`;
  }
  return available[Math.floor(Math.random() * available.length)];
}

