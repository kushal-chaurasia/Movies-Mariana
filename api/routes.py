from fastapi import APIRouter
from api.helper import create_df, fetch_data, get_genre
from api.schemas import MovieSchema

route = APIRouter()


@route.get("/genre/")
async def get_genre_view():
    data = await get_genre()
    return {"genre": list(data)}


@route.post("/get-movie/")
async def get_movies_view(request_body: MovieSchema):
    df = await create_df()
    if request_body.genre and request_body.query:

        df = df[
            df.apply(
                lambda x: any(genre in x["genre"] for genre in request_body.genre)
                and request_body.query.lower() in x["title"].lower(),
                axis=1,
            )
        ]

    elif request_body.genre:
        df = df[
            df["genre"].apply(lambda x: any(genre in x for genre in request_body.genre))
        ]
    elif request_body.query:
        df = df[df["title"].str.contains(request_body.query, case=False)]

    ret = df.to_dict(orient="records")
    return ret
