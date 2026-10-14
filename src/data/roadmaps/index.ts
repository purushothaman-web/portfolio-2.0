import { SkillRoadmap } from './types';
import { javascriptRoadmap } from './javascript';
import { reactRoadmap } from './react';
import { typescriptRoadmap } from './typescript';
import { nextjsRoadmap } from './nextjs';
import { tailwindRoadmap } from './tailwind';
import { framerMotionRoadmap } from './framerMotion';
import { nodejsRoadmap } from './nodejs';
import { postgresqlRoadmap } from './postgresql';
import { prismaRoadmap } from './prisma';
import { mongodbRoadmap } from './mongodb';
import { gitRoadmap } from './git';
import { systemDesignRoadmap } from './systemDesign';

export * from './types';

export const SKILL_ROADMAPS: Record<string, SkillRoadmap> = {
    'javascript': javascriptRoadmap,
    'react': reactRoadmap,
    'typescript': typescriptRoadmap,
    'nextjs': nextjsRoadmap,
    'tailwind': tailwindRoadmap,
    'framer-motion': framerMotionRoadmap,
    'nodejs': nodejsRoadmap,
    'postgresql': postgresqlRoadmap,
    'prisma': prismaRoadmap,
    'mongodb': mongodbRoadmap,
    'git': gitRoadmap,
    'system-design': systemDesignRoadmap,
};
