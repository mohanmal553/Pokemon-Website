import './index.css';
import { useEffect, useState } from "react";
export const Pokemon = () => {
    // store pokemon data into a state variable
    let [pokemon, setPokemon] = useState([]);
    
    //Page loading
    let [loading, setLoading] = useState(true);

    //search
    let [search, setSearch] = useState("");
    let handleChange = (e) => {
        setSearch(e.target.value);
    }

    //Searching card
    let searchData = pokemon.filter((currentPokemon) => {
        return currentPokemon.name.toLowerCase().includes(search.toLowerCase())
    });

    //Fetch Pokemon API
    let API = import.meta.env.VITE_MYAPI;  // Define API link
    let fetchPokemon = async () => {
        try {
            let res = await fetch(API);  //We get a response
            let data = await res.json();  // Convert into proper JSON format
            //each pokemon have it's won API so get the api url
            let detailedPokemonData = data.results.map(async (currentPokemon) => {
                let res = await fetch(currentPokemon.url);
                let data = await res.json();
                return data;
            });
            // console.log(detailedPokemonData) -> return data as a promise
            let detailData = await Promise.all(detailedPokemonData); // return all data when all promise is fulfiled
            setPokemon(detailData);  // store into a state variable
            setLoading(false);
        }
        catch (err) {
            console.log("Error: ", err);
        }
    }

    useEffect(() => {
        fetchPokemon();
    }, []);

    if (loading) {
        return <div className="loading"><p></p></div>
    }
    else {
        return (
            <div className="div-main">
                <div className="header">Let's Catch Pokёmon</div>
                <div><i className="fa-solid fa-magnifying-glass"></i>
                    <input type='text' className="search" placeholder="Search Pokemon" value={search} onChange={handleChange} /></div>
                <div className="pokemon-cards">

                    {
                        // pokemon.map((currentPokemon) => {
                        searchData.map((currentPokemon) => {
                            return (
                                <div className="card" key={currentPokemon.id}>
                                    <div className="pokemon-photo"><img src={currentPokemon.sprites.other.dream_world.front_default} /></div>
                                    <center>
                                        <p className="pokemon_name">{currentPokemon.name}</p>
                                        <p className="pokemon_type">
                                            {
                                                currentPokemon.types.map((currentType) => {
                                                    return currentType.type.name;
                                                }).join(" | ")
                                            }
                                        </p>
                                    </center>
                                    <div className="pokemon_features">
                                        <div className="span">
                                            <p className="height">Height: <font>{currentPokemon.height}</font></p>
                                            <p className="weight">Weight: <font>{currentPokemon.weight}</font></p>
                                            <p className="speed">Speed: <font>{currentPokemon.stats[5].base_stat}</font></p>
                                        </div>
                                        <br />
                                        <div className="span">
                                            <p className="experience">Experience: <br /><font>{currentPokemon.base_experience}</font></p>
                                            <p className="attack">Attack: <br /><font>{currentPokemon.stats[1].base_stat}</font></p>
                                            <p className="abilities">Abilities:<br /><font>{currentPokemon.abilities[0].ability.name}</font></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}