import React from 'react';

/**
 * Smoothly scrolls to a section by its ID
 * @param sectionId - The ID of the section to scroll to
 * @param updateHash - Whether to update the URL hash (default: true)
 */
export const scrollToSection = (sectionId: string, updateHash: boolean = true) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const navbarHeight = 80; // Height of fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Update URL hash without triggering scroll
        if (updateHash) {
            const hash = sectionId === 'hero' ? '' : `#${sectionId}`;
            window.history.pushState(null, '', hash || '/');
        }
    }
};

/**
 * Hook to get the current active section based on scroll position
 * @param sectionIds - Array of section IDs to track
 * @returns The ID of the currently active section
 */
export const useActiveSection = (sectionIds: string[]): string => {
    const [activeSection, setActiveSection] = React.useState<string>(sectionIds[0] || '');

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        // Update URL hash when section becomes active
                        const hash = entry.target.id === 'hero' ? '' : `#${entry.target.id}`;
                        window.history.replaceState(null, '', hash || '/');
                    }
                });
            },
            {
                // Improved rootMargin for better detection
                // Section is active when it's 20% from top and has 60% visibility
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            }
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [sectionIds]);

    return activeSection;
};

/**
 * Hook to handle initial page load with hash
 * @param sectionIds - Array of section IDs
 */
export const useHashNavigation = (sectionIds: string[]) => {
    React.useEffect(() => {
        // Handle initial page load with hash
        const hash = window.location.hash.slice(1);
        if (hash && sectionIds.includes(hash)) {
            // Delay to ensure page is fully loaded
            setTimeout(() => {
                scrollToSection(hash, false);
            }, 100);
        }

        // Handle browser back/forward buttons
        const handlePopState = () => {
            const hash = window.location.hash.slice(1);
            const targetSection = hash || 'hero';
            if (sectionIds.includes(targetSection)) {
                scrollToSection(targetSection, false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [sectionIds]);
};

/**
 * Hook to add keyboard navigation between sections
 * @param sectionIds - Array of section IDs
 * @param activeSection - Currently active section
 */
export const useKeyboardNavigation = (sectionIds: string[], activeSection: string) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const currentIndex = sectionIds.indexOf(activeSection);

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    if (currentIndex < sectionIds.length - 1) {
                        scrollToSection(sectionIds[currentIndex + 1]);
                    }
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        scrollToSection(sectionIds[currentIndex - 1]);
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    scrollToSection(sectionIds[0]);
                    break;
                case 'End':
                    e.preventDefault();
                    scrollToSection(sectionIds[sectionIds.length - 1]);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sectionIds, activeSection]);
};
