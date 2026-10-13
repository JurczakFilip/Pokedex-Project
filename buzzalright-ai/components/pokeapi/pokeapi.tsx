export async function GetPokemon() {
    try {
        const response = await fetch(
            'https://pokeapi.co/api/v2/pokemon'
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const pokedata = await response.json();

        return pokedata;
    } catch (error) {
        console.error("Failed to fetch Pokemon:", error);
        return null;
    }
}

async function GET_FlavorEntries(id: number)
{
    try{
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${id}/`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const Entries = await response.json();
        return Entries
    }
    catch (error) {
        console.log("Failed to GET_FlavorEntries.")
    }
} 

export async function RandomPokemon() {
    const PokeData = await GetPokemon();

    const randPokemonFromList = PokeData.results[Math.floor(Math.random() * PokeData.results.length)];
    console.log("Loaded %s!", randPokemonFromList.name, randPokemonFromList)
    try {
        console.log("Loading %s stats...", randPokemonFromList.name)
        const response = await fetch(
            randPokemonFromList.url
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const pokemonData = await response.json();
        const stats = pokemonData.stats.reduce((result: any, currentStat: any) => {
            result[currentStat.stat.name] = currentStat.base_stat
            return result
        }, {})

        const FlavorDescription = await GET_FlavorEntries(pokemonData.id);
        if (pokemonData) return {...pokemonData, stats, FlavorDescription};
    }
    catch {
        console.log("Failed to grab: ", randPokemonFromList.name)
    }
}
