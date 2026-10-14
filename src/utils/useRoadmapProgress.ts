import { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'purushothaman_roadmap_progress_v1';
const UPSTASH_KEY = 'purushothaman_portfolio_roadmap_progress';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface RoadmapProgressState {
    completed: string[]; // List of checkpoint IDs
    updatedAt: number;
}

export function useRoadmapProgress() {
    const [completed, setCompleted] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsed: RoadmapProgressState = JSON.parse(saved);
                return Array.isArray(parsed.completed) ? parsed.completed : [];
            }
        } catch {
            // Ignore parse errors
        }
        return [];
    });

    const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');

    // Upstash credentials from Vite env
    const upstashUrl = import.meta.env.VITE_UPSTASH_REDIS_REST_URL as string | undefined;
    const upstashToken = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN as string | undefined;
    const isCloudConfigured = Boolean(upstashUrl && upstashToken);

    // Initial Cloud Fetch (if Upstash is configured)
    useEffect(() => {
        if (!isCloudConfigured || !upstashUrl || !upstashToken) {
            setSyncStatus('offline');
            return;
        }

        let isCancelled = false;
        async function fetchRemoteProgress() {
            try {
                setSyncStatus('syncing');
                const res = await fetch(`${upstashUrl}/get/${UPSTASH_KEY}`, {
                    headers: {
                        Authorization: `Bearer ${upstashToken}`
                    }
                });

                if (!res.ok) throw new Error('Cloud fetch failed');
                const data = await res.json();

                if (data.result && !isCancelled) {
                    const remoteState: RoadmapProgressState = typeof data.result === 'string'
                        ? JSON.parse(data.result)
                        : data.result;

                    if (Array.isArray(remoteState.completed)) {
                        setCompleted(prev => {
                            // Merge local and remote
                            const merged = Array.from(new Set([...prev, ...remoteState.completed]));
                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                                completed: merged,
                                updatedAt: Date.now()
                            }));
                            return merged;
                        });
                    }
                }
                if (!isCancelled) setSyncStatus('synced');
            } catch (err) {
                console.warn('Roadmap cloud sync warning:', err);
                if (!isCancelled) setSyncStatus('error');
            }
        }

        fetchRemoteProgress();
        return () => { isCancelled = true; };
    }, [isCloudConfigured, upstashUrl, upstashToken]);

    // Save to LocalStorage and push to Upstash on changes
    const saveProgress = useCallback(async (newCompleted: string[]) => {
        const payload: RoadmapProgressState = {
            completed: newCompleted,
            updatedAt: Date.now()
        };

        // 1. Instant local write
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));

        // 2. Background cloud write if configured
        if (isCloudConfigured && upstashUrl && upstashToken) {
            setSyncStatus('syncing');
            try {
                const res = await fetch(`${upstashUrl}/set/${UPSTASH_KEY}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${upstashToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(JSON.stringify(payload))
                });
                if (res.ok) {
                    setSyncStatus('synced');
                } else {
                    setSyncStatus('error');
                }
            } catch {
                setSyncStatus('error');
            }
        }
    }, [isCloudConfigured, upstashUrl, upstashToken]);

    // Toggle checkpoint completed state
    const toggleCheckpoint = useCallback((checkpointId: string) => {
        setCompleted(prev => {
            const next = prev.includes(checkpointId)
                ? prev.filter(id => id !== checkpointId)
                : [...prev, checkpointId];
            saveProgress(next);
            return next;
        });
    }, [saveProgress]);

    const isCompleted = useCallback((checkpointId: string) => {
        return completed.includes(checkpointId);
    }, [completed]);

    const getSkillProgress = useCallback((checkpointIds: string[]) => {
        if (!checkpointIds.length) return 0;
        const count = checkpointIds.filter(id => completed.includes(id)).length;
        return Math.round((count / checkpointIds.length) * 100);
    }, [completed]);

    return {
        completed,
        toggleCheckpoint,
        isCompleted,
        getSkillProgress,
        syncStatus,
        isCloudConfigured
    };
}
