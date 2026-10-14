import Home from './Home';
import { About } from './About';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { GitHubActivity } from '../components/sections/GitHubActivity';
import { Achievements } from './Achievements';
import { Contact } from './Contact';

export default function HomePage() {
    return (
        <>
            <Home />
            <About />
            <Projects />
            <Skills />
            <GitHubActivity />
            <Achievements />
            <Contact />
        </>
    );
}