import requests
import json

class NYTimesSource(object):
    """
    A data loader plugin for the NY Times API.
    """

    def __init__(self, api_key):
        self.api_key = api_key

    def flatten_dict(self, d, parent_key='', sep='.'):
        items = []
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(self.flatten_dict(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
        return dict(items)

    def fetch_articles(self, query, page=0):
        """Fetch articles from the NYT API."""
        url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
        params = {
            'q': query,
            'api-key': self.api_key,
            'page': page
        }
        response = requests.get(url, params=params)
        response.raise_for_status()  # This will raise an exception for HTTP errors
        return response.json()

    def getDataBatch(self, batch_size, query):
        """
        Generator - Get data from source in batches.
        """
        page = 0
        while True:
            response = self.fetch_articles(query, page)
            articles = response.get('response', {}).get('docs', [])
            
            if not articles:
                break

            for article in articles:
                yield self.flatten_dict(article)
                
            page += 1
            if page * 10 >= batch_size:  # assuming each page returns 10 articles
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

# Example usage:
if __name__ == "__main__":
    nytimes_source = NYTimesSource(api_key='API-KEY-VALUE')
    query = "Silicon Valley"  # Example query

    print("Schema:")
    print(nytimes_source.getSchema())
    print("\nArticles:")

    for idx, article in enumerate(nytimes_source.getDataBatch(batch_size=20, query=query)):
        print(f"Article {idx + 1}:")
        print(json.dumps(article, indent=2))
        # if (idx + 1) % 10 == 0:
        #     print("Next page...\n")
