# New York Times Article Fetcher

## Overview
This project is a simple interface to the New York Times Article Search API. It allows users to query for articles and retrieve them in batched formats.

## Requirements
To run

pip3 install -r requirements.txt

python3 test.py

## Task Checklist

1. New York Times API Utilization: The NewYork.py file you provided earlier appears to handle the communication with the New York Times API. It fetches articles based on a query and processes them in batches as required.

2. NYTimesSource Class Structure: The class in NewYork.py matches the expectation for a data loader plugin for the NY Times API.

3. Batched Results: The getDataBatch method in NewYork.py uses a generator to yield articles in batches.

4. Dictionary Flattening: The flatten_dict method in NewYork.py is implemented without third-party libraries, which satisfies the requirement.

5. No Third-Party Libraries for Flattening: Confirmed by reviewing NewYork.py; the flattening is custom-coded.

6. requirements.txt: This file is needed to specify dependencies. Since the requests library is used, this should be listed in requirements.txt.

7. output.txt has the output of the script execution.

