from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")

client = TavilyClient(
    api_key=os.getenv(
        "TAVILY_API_KEY"
    )
)


def search_web(query):

    try:

        response = client.search(
            query=query,
            max_results=3
        )

        results = ""

        for item in response["results"]:

            results += (
                item["title"]
                + "\n"
            )

        return results

    except Exception as e:

        return str(e)