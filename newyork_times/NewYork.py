import requests
import time
import json
from requests.exceptions import HTTPError, RequestException

class NYTimesSource(object):
    """
    This class is responsible for fetching articles from the New York Times API.
    It includes handling for errors and API rate limits.
    """
    # Max number of retries for API calls if we encounter failures
    MAX_RETRIES = 5
    # Cooldown time to wait if we hit the API rate limit (in seconds)
    RATE_LIMIT_COOLDOWN = 60

    def __init__(self, api_key):
        """
        Initialize with the provided API key.
        """
        self.api_key = api_key

    def flatten_dict(self, d, parent_key='', sep='.'):
        """
        Flatten a nested dictionary into a single level by joining keys with a dot.
        """
        items = []
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(self.flatten_dict(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
        return dict(items)

    def fetch_articles(self, query, page=0):
        """Fetch articles from the NYT API with error handling and retry logic."""
        url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
        params = {
            'q': query,
            'api-key': self.api_key,
            'page': page
        }

        retries = 0
        while retries < self.MAX_RETRIES:
            try:
                response = requests.get(url, params=params)
                response.raise_for_status()  # Raise an error for bad status codes
                return response.json()
            except HTTPError as http_err:
                if response.status_code == 429:
                    # If we hit rate limit, wait before trying again
                    print(f"Rate limit hit. Cooling down for {self.RATE_LIMIT_COOLDOWN} seconds.")
                    time.sleep(self.RATE_LIMIT_COOLDOWN)
                    retries += 1
                else:
                    # If other HTTP errors occur, log them and stop retrying
                    print(f"HTTP error occurred: {http_err} - {response.status_code}")
                    break
            except RequestException as req_err:
                # Other request issues, such as network errors.
                print(f"Network error occurred: {req_err}")
                break
            except Exception as err:
                # For any other errors, log the error and stop retrying
                print(f"An error occurred: {err}")
                break
            # Simple strategy to wait a bit before retrying the request
            time.sleep(1)
        return None  # If we run out of retries, return None to indicate failure

    def getDataBatch(self, batch_size, query):
        """
        Generator - Get data from source in batches.
        """
        page = 0
        while True:
            response = self.fetch_articles(query, page)
            articles = response.get('response', {}).get('docs', [])
            
            if not articles:
                break # If no articles are found, stop the generator

            for article in articles:
                # Yield each article one by one after flattening its structure
                yield self.flatten_dict(article)
                
            page += 1
            # Stop if we reach the batch size limit (10 articles per page assumed)
            if page * 10 >= batch_size:
                break

    def getSchema(self):
        """
        Return the schema of the dataset
        :returns a List containing the names of the columns retrieved from the
        source
        """
        schema = [
            "web_url",
            "snippet",
            "lead_paragraph",
            "abstract",
            "print_section",
            "print_page",
            "source",
            "multimedia",
            "headline.main",
            "keywords.value",
            "pub_date",
            "document_type",
            "news_desk",
            "section_name",
            "subsection_name",
            "byline.original",
            "type_of_material",
            "_id",
            "word_count",
            "uri"
        ]
        return schema

# Example on how to use this class:
if __name__ == "__main__":
    nytimes_source = NYTimesSource(api_key='API-KEY-VALUE')
    query = "Silicon Valley"  # Example query term

    print("Schema:")
    print(nytimes_source.getSchema())
    print("\nArticles:")

    for idx, article in enumerate(nytimes_source.getDataBatch(batch_size=20, query=query)):
        print(f"Article {idx + 1}:")
        print(json.dumps(article, indent=2))
        # if (idx + 1) % 10 == 0:
        #     print("Next page...\n")
