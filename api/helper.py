import httpx
import pandas as pd
from typing import Dict, Any, Set


async def fetch_data() -> Dict[str, Any]:
    """
    Fetches data from the specified URL asynchronously using httpx.

    Returns:
        dict: A dictionary containing movie data retrieved from the URL.
    """
    url = "https://raw.githubusercontent.com/Mariana-Tek/the-movies-at-mariana/master/movies/index.json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        return response.json()


async def create_df() -> pd.DataFrame:
    """
    Creates a DataFrame from the movie data fetched asynchronously.

    Returns:
        pandas.DataFrame: A DataFrame containing movie information.
    """
    data = await fetch_data()
    df = pd.DataFrame()
    for date in data:
        movie = date.get("movies")
        df = pd.concat([df, pd.DataFrame(movie)], axis=0, ignore_index=True)
    return df

async def get_genre() -> Set[str]:
    """
    Retrieves all unique genres from the movie DataFrame asynchronously.

    Returns:
        set: A set containing all unique genres.
    """
    df = await create_df()
    return set(df["genre"].sum())