export interface ExternalResource {
    title: string;
    url: string;
    description: string;
    badge?: string; // e.g. "Official Docs", "RFC", "Interactive Practice"
}

export interface Checkpoint {
    id: string;
    title: string;
    estMinutes: number; // e.g. 5
    concept: {
        summary: string;
        analogy: string;
        seniorInsight: string;
    };
    trap: {
        title: string;
        juniorCode: string;
        seniorCode: string;
        explanation: string;
    };
    drill: {
        question: string;
        starterCode?: string;
        hint?: string;
        solution: string;
        explanation: string;
    };
    docLink: ExternalResource;
}

export interface SkillRoadmap {
    skillId: string;
    skillName: string;
    category: 'CLIENT-SIDE' | 'SERVER-SIDE' | 'DATA STORAGE' | 'FOUNDATIONS' | 'ARCHITECTURE';
    tagline: string;
    accentColor: string;
    officialDocs: ExternalResource[];
    checkpoints: Checkpoint[];
}
