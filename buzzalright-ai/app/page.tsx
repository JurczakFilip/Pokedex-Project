
"use client";

import CRTWarp from "@/components/ReactBits/Backgrounds/CRTWRAP/crtwrap";
import { RandomPokemon } from "@/components/pokeapi/pokeapi";
import { Cross } from "lucide-react";
import { useEffect, useState } from "react";

type Pokemon = {
  name: string;
  sprites: {
    front_default: string | null;
  };
  stats: Record<string, number>;
};

export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [searchedPokemon, setSearchedPokemon] = useState<Pokemon | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load a random Pokémon when the page mounts
  useEffect(() => {
    async function loadRandomPokemon() {
      try {
        const pokemon = await RandomPokemon();
        setSelectedPokemon(pokemon);
        HandleSearch("51");
      } catch (err) {
        console.error("Failed to load random Pokémon:", err);
      }
    }

    loadRandomPokemon();
  }, []);

  async function HandleSearch(idOrName: string) {
    const query = idOrName.trim().toLowerCase();

    if (!query) {
      setError("Please enter a Pokémon name or ID.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchedPokemon(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Pokémon not found.");
      }

      const data = await response.json();

      // Convert the API's stats array into the object format used by the cards
      const stats = Object.fromEntries(
        data.stats.map(
          (item: { base_stat: number; stat: { name: string } }) => [
            item.stat.name,
            item.base_stat,
          ]
        )
      );

      setSearchedPokemon({
        name: data.name,
        sprites: data.sprites,
        stats,
      });
    } catch {
      setError("Pokémon not found. Check the name or ID and try again.");
    } finally {
      setLoading(false);
    }
  }



  function PokemonCard({
    pokemon,
    title,
  }: {
    pokemon: Pokemon;
    title: string;
  }) {
    return (
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-title p-5 bg-base-200">{title}</div>

        <figure className="p-4">
          {pokemon.sprites.front_default ? (
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-[150px] object-contain"
            />
          ) : (
            <p>No image available</p>
          )}
        </figure>

        <div className="card-body bg-base-200">
          <h2 className="card-title justify-between capitalize">
            {pokemon.name}
            <div className="badge badge-secondary">
              {pokemon.stats.hp ?? 0} <Cross size={15} />
            </div>
          </h2>

          <div className="flex flex-wrap gap-2">
            <div className="badge badge-outline">
              Attack: {pokemon.stats.attack ?? 0}
            </div>
            <div className="badge badge-outline">
              Defense: {pokemon.stats.defense ?? 0}
            </div>
            <div className="badge badge-outline">
              Special Attack: {pokemon.stats["special-attack"] ?? 0}
            </div>
            <div className="badge badge-outline">
              Special Defense: {pokemon.stats["special-defense"] ?? 0}
            </div>
            <div className="badge badge-outline">
              Speed: {pokemon.stats.speed ?? 0}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden flex items-center justify-center"
      >
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

        <div className="relative z-10 text-center text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Welcome to the Pokedex Project
            </h1>

            <p className="py-6">
              Find all the Pokémon info you need on one site.
            </p>

            <a href="#api" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </section>

      <section
        id="api"
        className="flex justify-center items-start gap-8 p-5 mt-10"
      >
        <div>
          <div className="flex justify-center items-center">
            <form
              className="join"
              onSubmit={(e) => {
                e.preventDefault();
                HandleSearch(input);
              }}
            >
              <input
                type="text"
                className="input join-item w-55"
                placeholder="Search Pokémon by name or ID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn btn-neutral join-item"
                disabled={loading}
              >
                {loading ? "Searching..." : "Submit"}
              </button>
            </form>

            {error && <p className="text-error">{error}</p>}
          </div>
          <div className="flex gap-15 mt-15">
            {selectedPokemon ? (
              <PokemonCard pokemon={selectedPokemon} title="Random Pokémon" />
            ) : (
              <div className="loading loading-spinner loading-lg" />
            )}

            <div className="flex flex-col gap-4">

              {searchedPokemon && (
                <PokemonCard
                  pokemon={searchedPokemon}
                  title="Search Result"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
