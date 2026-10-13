import CRTWarp from '@/components/ReactBits/Backgrounds/CRTWRAP/crtwrap'
import Navbar from '@/components/core/navbar'
import { RandomPokemon } from '@/components/pokeapi/pokeapi'
import { Cross } from 'lucide-react';

export default async function Home() {
  const SelectedPokemon = await RandomPokemon();

  return (
    <div>
      <Navbar />

      <section
        id="hero"
        className="relative min-h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <CRTWarp
            color="#c755f7"
            backgroundColor="#05010a"
            speed={0.5}
            curvature={0.25}
            scanlineStrength={0.25}
            scanlineFrequency={200}
            waveAmplitude={0.3}
            waveFrequency={2.5}
            bloom={1.5}
            bloomRadius={1}
            noise={0.1}
            vignette={0}
            brightness={1.25}
            pixelation={1}
            rgbShift={0.015}
            mouseReact
            mouseStrength={0.5}
            dpr={1}
            fps={15}
            paused={false}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Welcome to the Pokedex Project
            </h1>

            <p className="py-6">
              Find all the pokemon info you need on one site.
            </p>

            <a href='#api'>
            <button className="btn btn-primary">
              Get Started
            </button>
            </a>
          </div>
        </div>
      </section>
      <section id="api" className="flex w-full h-[500px] items-center justify-center">
        {SelectedPokemon && (
          <div className="card bg-base-200 w-96 shadow-sm">
          <figure>
            <img
              src={SelectedPokemon.sprites.front_default}
              alt={SelectedPokemon.name}
              className='h-[144px]'/>
          </figure>
          <div className="card-body bg-base-100">
            <h2 className="card-title justify-between">
              {SelectedPokemon.name[0].toUpperCase() + SelectedPokemon.name.slice(1)}
              <div className="badge badge-secondary">{SelectedPokemon.stats.hp} <Cross size={15}/></div>
            </h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="justify-start space-x-2 space-y-2">
              <div className="badge badge-outline">Attack: {SelectedPokemon.stats.attack}</div>
              <div className="badge badge-outline">Defense: {SelectedPokemon.stats.defense}</div>
              <div className="badge badge-outline">Special Attack: {SelectedPokemon.stats["special-attack"]}</div>
              <div className="badge badge-outline">Special Defense: {SelectedPokemon.stats["special-defense"]}</div>
              <div className="badge badge-outline">Speed: {SelectedPokemon.stats.speed}</div>
            </div>
          </div>
        </div>
        )}
      </section>
    </div>
  )
}

