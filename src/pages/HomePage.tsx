import Home from './Home';
import { About } from './About';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { Achievements } from './Achievements';
import { Contact } from './Contact';

/**
 * Single-page portfolio combining all sections
 */
export default function HomePage() {
    return (
        <>
            <Home />
            <About />
            <Projects />
            <Skills />
            <Achievements />
            <Contact />
        </>
    );
}
