import Header from '../components/Header'
import Hero from '../components/Hero'
import Problems from '../components/Problems'
import SolutionTimeline from '../components/SolutionTimeline'
import Features from '../components/Features'
import ForWho from '../components/ForWho'
import Benefits from '../components/Benefits'
import CTA from '../components/CTA'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Problems />
      <SolutionTimeline />
      <Features />
      <ForWho />
      <Benefits />
      <CTA />
    </div>
  );
}
