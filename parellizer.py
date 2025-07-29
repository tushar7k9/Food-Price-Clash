from scraper import swiggyScraper, zomatoScraper
from concurrent.futures import ProcessPoolExecutor
import time

# location = "Bangalore"
# restaurant_name = "Krishnam Veg"  # Changed from search_food_rest to restaurant_name

start = time.time()


def scrape(scraper_function, location, restaurant_name, specific_url=None):
    df = scraper_function(location, restaurant_name, specific_url)
    return df


def food_json(location, restaurant_name, zomato_url=None, swiggy_url=None):
    with ProcessPoolExecutor() as executor:
        futures = []
        futures.append(executor.submit(
            scrape, swiggyScraper, location, restaurant_name, swiggy_url))
        futures.append(executor.submit(
            scrape, zomatoScraper, location, restaurant_name, zomato_url))

        swiggy_df, zomato_df = tuple(future.result() for future in futures)

    food_json = {"swiggy": swiggy_df, "zomato": zomato_df}
    # print(swiggy_df, zomato_df)
    print("Total time: ", time.time() - start)

    return food_json
