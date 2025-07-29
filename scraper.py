import time
# Remove this line since we're using pyvirtualdisplay
# from xvfbwrapper import Xvfb
import re
import concurrent.futures
import googlesearch
from bs4 import BeautifulSoup as Bs
from urllib.request import Request, urlopen
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import ssl
import urllib3

# Remove this import
# from pyvirtualdisplay import Display
import random

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def safe_google_search(query, num_results=1):
    """Perform Google search with SSL error handling"""
    try:
        # Try normal search first
        results = list(googlesearch.search(query, num=num_results, stop=num_results, pause=2))
        print("Google search results", results)
        return results
    except Exception as e:
        print(f"Google search failed: {e}")
        # Return empty list if search fails
        return []

def is_swiggy_city_page(url):
    """
    Detects if a Swiggy URL is a city-level page rather than a specific restaurant.
    City pages: https://www.swiggy.com/city/bangalore/mcdonalds
    Restaurant pages: https://www.swiggy.com/city/bangalore/mcdonalds-lashimipura-bannerghatta-road-rest848525
    """
    # Check if it's a city page without a specific restaurant identifier
    if "/city/" in url:
        # Count the number of segments after "/city/"
        parts = url.split("/city/")
        if len(parts) == 2:
            segments = parts[1].strip("/").split("/")
            # If there are just 2 segments (city and restaurant name) without a specific location
            if len(segments) <= 2:
                # Check if there's no "rest" identifier which is common in specific restaurant URLs
                if "rest" not in url and "-" not in segments[-1]:
                    return True
    return False

def search_restaurant_options(platform, restaurant_name, location):
    """Return a list of possible restaurant options for a given name and location."""
    options = []
    
    try:
        # Use improved search queries for better results
        if platform.lower() == "swiggy":
            search_query = f"site:swiggy.com {restaurant_name} {location}"
        elif platform.lower() == "zomato":
            search_query = f"site:zomato.com {restaurant_name} {location} order"
        else:
            search_query = f"{platform} {restaurant_name} {location}"
        
        # Use safe search function
        search_results = safe_google_search(search_query, 8)
        
        for url in search_results:
            # For Swiggy URLs, filter out city pages
            if platform.lower() == "swiggy":
                if is_swiggy_city_page(url):
                    print(f"Skipping Swiggy city page: {url}")
                    continue
                
                # Only accept URLs that look like specific restaurant pages
                # Look for indicators like "rest" ID numbers or hyphenated location names
                if "/restaurants/" in url or "rest" in url or (
                    "/city/" in url and "-" in url.split("/")[-1]):
                    options.append({
                        "url": url,
                        "area": location,  # Use passed location since extraction is complex
                        "platform": "Swiggy"
                    })
            # For Zomato URLs, prioritize order pages
            elif platform.lower() == "zomato":
                # Ensure the URL points to an order page
                if "/order" in url:
                    final_url = url
                elif url.endswith('/info'):
                    final_url = url.replace('/info', '/order')
                else:
                    final_url = f"{url.rstrip('/')}/order"
                
                parts = url.split("/")
                if len(parts) >= 5:
                    location_info = parts[4].split("-")
                    area = "-".join(location_info[1:-1]) if location_info[-1] == "bangalore" else "-".join(location_info[1:])
                    options.append({
                        "url": final_url,
                        "area": area.replace("-", " ").title(),
                        "platform": "Zomato"
                    })
    except Exception as e:
        print(f"Error finding {platform} restaurant options: {e}")
    
    return options

def swiggyScraper(location, restaurant_name, specific_url=None):
    if specific_url:
        swiggy_resturant_link = specific_url
    else:
        # Search for restaurant with SSL error handling
        swiggy_search_query = f"Swiggy {restaurant_name} {location}"
        search_results = safe_google_search(swiggy_search_query, 1)
        
        if search_results:
            swiggy_resturant_link = search_results[0]
            print(f"Found Swiggy URL: {swiggy_resturant_link}")
        else:
            print("No Swiggy search results found - Google search failed")
            return {}

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                "--no-sandbox",
                "--disable-dev-shm-usage"
            ]
        )

        # Set up context with additional options
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            ignore_https_errors=True
        )

        page = context.new_page()
        food_items = {}

        try:
            # Navigate to the Swiggy page
            print(f"Navigating to {swiggy_resturant_link}")
            page.goto(swiggy_resturant_link, wait_until="load", timeout=30000)
            page.wait_for_timeout(3000)
            
            # Check if this is a city page with multiple restaurant listings
            is_city_page = False
            try:
                # Look for restaurant cards that indicate a listing page
                restaurant_cards = page.query_selector_all("div[data-testid*='restaurant_list_card']")
                if len(restaurant_cards) > 0:
                    print(f"Detected a city page with {len(restaurant_cards)} Swiggy restaurant listings")
                    is_city_page = True
            except Exception as e:
                print(f"Error checking page type: {e}")
            
            if is_city_page:
                print("This is a city page with multiple locations. Selecting the closest Swiggy restaurant...")
                
                try:
                    restaurants = []

                    for card in restaurant_cards:
                        # Extract delivery time text
                        delivery_time_element = card.query_selector("div[class*='sc-beySbM hhnNfO']")
                        full_text = delivery_time_element.text_content()
                        parts = full_text.split('•')

                        delivery_time_text = parts[1].strip()
                        # Example delivery_time_text: "50-55 mins"
                        # Get the lower limit of the delivery time
                        delivery_time_number = int(delivery_time_text.strip().split('-')[0])

                        # Extract restaurant link
                        link_element = card.query_selector('a')
                        link = link_element.get_attribute('href')

                        restaurants.append((delivery_time_number, link))

                    # Sort by delivery time ascending
                    restaurants.sort(key=lambda x: x[0])

                    # Pick the fastest restaurant
                    fastest_restaurant_link = restaurants[0][1]

                    if fastest_restaurant_link:
                        print(f"Selected Swiggy restaurant with URL: {fastest_restaurant_link}")
                        
                        # Now navigate to this specific restaurant
                        page.goto(fastest_restaurant_link, wait_until="load", timeout=30000)
                        page.wait_for_timeout(5000)
                    else:
                        raise Exception("Could not find any restaurant links")
                except Exception as e:
                    print(f"Error selecting restaurant from city page: {e}")
                    # Take a screenshot to debug
                    try:
                        page.screenshot(path="swiggy_city_page_error.png")
                        print("Saved error screenshot to swiggy_city_page_error.png")
                    except:
                        pass
                    return {}

            # At this point we should be on a restaurant menu page,
            # so continue with the regular menu scraping

            # First, let's take a screenshot to see what the page looks like
            try:
                page.screenshot(path="swiggy_menu_page.png")
                print("Saved screenshot to swiggy_menu_page.png")
            except Exception as e:
                print(f"Could not save screenshot: {e}")

            # Now proceed with your existing code to extract menu items
            food_elements = page.query_selector_all("//div[@class = 'sc-jsJBEP QMaYM']")
            print(f"Found {len(food_elements)} items on Swiggy after expanding sections")

            # More robust extraction with error handling
            for index, food in enumerate(food_elements):
                try:
                    # Try multiple selectors for name
                    name_selectors = [
                        ".sc-aXZVg.eqSzsP.sc-eeDRCY.dwSeRx",
                        "h4",
                        "div[class*='name']",
                        "div[class*='title']",
                        "div[class*='item-name']",
                        "div[class*='Name']"
                    ]
                    
                    # Try to get name using any of these selectors
                    name_element = None
                    for selector in name_selectors:
                        try:
                            name_element = food.query_selector(selector)
                            if name_element:
                                break
                        except:
                            continue
                    
                    # If we couldn't find a name with selectors, try JavaScript
                    if not name_element:
                        try:
                            # Get all text inside the element and try to identify name and price
                            all_text = food.evaluate("el => el.textContent")
                            
                            # Look for price pattern (₹ followed by digits and optional decimal)
                            price_match = re.search(r'₹\s*(\d+(?:\.\d+)?)', all_text)
                            
                            if price_match:
                                # Everything before the price might be the name
                                price_pos = all_text.find('₹')
                                if price_pos > 5:  # Ensure there's enough text for a name
                                    potential_name = all_text[:price_pos].strip()
                                    food_name = re.sub(r'\((.*?)\)', '', potential_name).strip()
                                    food_price = price_match.group(1)
                                    
                                    food_items[food_name] = food_price
                                    continue  # Skip the rest of the loop for this item
                        except Exception as e:
                            print(f"Error with JavaScript extraction: {e}")
                    
                    # If we found a name element, extract the text
                    if name_element:
                        food_name = name_element.text_content()

                        # Try multiple selectors for price
                        price_selectors = [
                            "span",
                            "span[class*='price']",
                            "div[class*='price']",
                            "div:has-text('₹')",
                            "span:has-text('₹')"
                        ]

                        price_element = None
                        for selector in price_selectors:
                            try:
                                price_element = food.query_selector(selector)
                                if price_element:
                                    break
                            except:
                                continue

                        if price_element:
                            food_price = price_element.text_content()
                            # Clean price - keep digits and decimal point
                            clean_price = re.sub(r'[^\d.]', '', str(food_price))
                            # Remove multiple consecutive dots and trailing dots
                            clean_price = re.sub(r'\.+', '.', clean_price)
                            clean_price = clean_price.strip('.')

                            if food_name and clean_price and clean_price.replace('.', '').isdigit():
                                food_items[food_name] = clean_price

                except Exception as e:
                    print(f"Error extracting item {index+1}: {e}")
                    continue

            print(f"Successfully extracted {len(food_items)} items")

            # If we couldn't find any items, use BeautifulSoup as fallback
            if not food_items:
                print("Falling back to BeautifulSoup method")
                content = page.content()
                soup = Bs(content, "html.parser")
                for food in soup.find_all(class_="styles_detailsContainer__22vh8"):
                    try:
                        food_name_par = food.find('h3', class_='styles_itemNameText__3ZmZZ').text.strip()
                        food_name = re.sub(r'\((.*?)\)', '', food_name_par).strip()
                        food_price = food.find('span', class_='rupee').text.strip()
                        food_items[food_name] = food_price
                    except Exception as e:
                        print(f"Error in fallback method: {e}")
                        continue

        except Exception as e:
            print(f"Error accessing Swiggy: {e}")
            try:
                page.screenshot(path="swiggy_error.png")
            except:
                pass

        browser.close()

    print(f"Total Swiggy items found: {len(food_items)}")
    print(food_items)
    return food_items

# Zomato Scrape

def zomatoScraper(location, restaurant_name, specific_url=None):
    if specific_url:
        zomato_resturant_link = specific_url
    else:
        # Search for restaurant with SSL error handling - specifically target order pages
        zomato_search_query = f"site:zomato.com {restaurant_name} {location} order"
        search_results = safe_google_search(zomato_search_query, 3)
        
        if search_results:
            # Prefer URLs that already have /order in them
            order_urls = [url for url in search_results if '/order' in url]
            if order_urls:
                zomato_resturant_link = order_urls[0]
                print(f"Found Zomato order URL: {zomato_resturant_link}")
            else:
                # If no order URL found, use the first result and add /order
                base_url = search_results[0]
                if base_url.endswith('/info'):
                    zomato_resturant_link = base_url.replace('/info', '/order')
                elif not base_url.endswith('/order'):
                    zomato_resturant_link = f"{base_url.rstrip('/')}/order"
                else:
                    zomato_resturant_link = base_url
                print(f"Modified Zomato URL to order page: {zomato_resturant_link}")
        else:
            print("No Zomato search results found - Google search failed")
            return {}

    # Proxy configuration - let's try without proxy first
    proxy_config = None  # Temporarily disable proxy
    # proxy_config = {
    #     "server": "http://38.153.152.244:9594",
    #     "username": "pxudkacs",
    #     "password": "zt0dz7t0v212"
    # }

    max_retries = 3
    print("Starting to scrape Zomato: ", zomato_resturant_link)

    try:
        with sync_playwright() as p:
            # More browser settings to avoid detection
            browser = p.chromium.launch(
                headless=False,  # Keep visible for debugging
                proxy=proxy_config,  # This will be None now
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--window-size=1920,1080',
                    '--disable-blink-features=AutomationControlled'
                ]
            )

            # Set a random user agent using Python's random module
            random_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

            context = browser.new_context(
                user_agent=random_user_agent,
                viewport={"width": 1920, "height": 1080}
            )
            
            # Add headers to mimic a real browser
            context.set_extra_http_headers({
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Cache-Control": "max-age=0"
            })

            # Create a new page using the sync API
            page = context.new_page()
            food_items = {}

            try:
                # Navigate to the Zomato page
                print(f"Navigating to Zomato {zomato_resturant_link}")
                
                # Add stealth mode settings
                page.evaluate("""() => {
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined
                    });
                    
                    // Remove webdriver property
                    delete navigator.__proto__.webdriver;
                    
                    // Mock chrome property
                    Object.defineProperty(navigator, 'chrome', {
                        get: () => ({
                            runtime: {},
                            loadTimes: () => {},
                            csi: () => {},
                            app: {}
                        })
                    });
                    
                    // Mock plugins
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5]
                    });
                    
                    // Mock languages
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['en-US', 'en']
                    });
                }""")
                
                # Try multiple URL variations if the first one fails
                navigation_success = False
                urls_to_try = []
                
                # If URL has /order, also try without it
                if '/order' in zomato_resturant_link:
                    urls_to_try.append(zomato_resturant_link)  # Try with /order first
                    urls_to_try.append(zomato_resturant_link.replace('/order', ''))  # Try without /order
                else:
                    urls_to_try.append(zomato_resturant_link)  # Try original URL
                    urls_to_try.append(f"{zomato_resturant_link}/order")  # Try with /order added
                
                # Also try /menu endpoint
                base_url = zomato_resturant_link.replace('/order', '')
                urls_to_try.append(f"{base_url}/menu")
                
                for i, url_to_try in enumerate(urls_to_try):
                    try:
                        print(f"Trying URL {i+1}/{len(urls_to_try)}: {url_to_try}")
                        
                        # Try different navigation strategies for each URL
                        strategies = [
                            {"wait_until": "domcontentloaded", "timeout": 20000},
                            {"wait_until": "networkidle", "timeout": 30000},
                            {"wait_until": "load", "timeout": 40000}
                        ]
                        
                        for j, strategy in enumerate(strategies):
                            try:
                                print(f"  Strategy {j+1}: {strategy}")
                                page.goto(url_to_try, **strategy)
                                navigation_success = True
                                print(f"Navigation successful with URL: {url_to_try} using strategy: {strategy}")
                                break
                            except Exception as strategy_error:
                                print(f"  Strategy {j+1} failed: {strategy_error}")
                                if j < len(strategies) - 1:
                                    print("  Trying next strategy...")
                                    continue
                        
                        if navigation_success:
                            break
                                
                    except Exception as nav_error:
                        print(f"URL {i+1} failed completely: {nav_error}")
                        if i < len(urls_to_try) - 1:
                            print("Trying next URL...")
                            page.wait_for_timeout(3000)  # Longer wait between attempts
                            continue
                
                if not navigation_success:
                    print("All URL variations and strategies failed")
                    # Try one more time with a completely fresh approach
                    try:
                        print("Attempting final fallback navigation...")
                        page.goto(zomato_resturant_link.replace('/order', ''), timeout=60000)
                        navigation_success = True
                        print("Fallback navigation succeeded!")
                    except Exception as final_error:
                        print(f"Final fallback also failed: {final_error}")
                        return {}
                    
                    print("Waiting for page content to stabilize...")
                    page.wait_for_timeout(5000)  # Wait for content to load

                # Check if this is a city page with multiple restaurant listings
                is_city_page = False
                try:
                    # Look for restaurant cards that indicate a listing page
                    restaurant_cards = page.query_selector_all("div[class*='jumbo-tracker']")
                    print("Zomato restaurant_cards", restaurant_cards)
                    if len(restaurant_cards) > 0:
                        print(f"Detected a city page with {len(restaurant_cards)} Zomato restaurant listings")
                        is_city_page = True
                except Exception as e:
                    print(f"Error checking page type: {e}")

                if is_city_page:
                    print("This is a city page with multiple locations. Selecting the closest restaurant...")

                    try:
                        restaurants = []

                        for card in restaurant_cards:
                            # Extract delivery time text
                            print("card", card)
                            delivery_distance_element = card.query_selector("div[class*='min-basic-info-right']")
                            print("Zomato delivery_distance_element", delivery_distance_element)

                            distance_text = delivery_distance_element.text_content()
                            # Example delivery_time_text: "50-55 mins"
                            # Get the lower limit of the delivery time
                            delivery_distance_number = float(distance_text.strip().split(' ')[0])

                            # Extract restaurant link
                            link_element = card.query_selector('a')
                            link = link_element.get_attribute('href')

                            # Add base URL
                            full_link = "https://www.zomato.com/" + link.lstrip('/')

                            # Replace 'info' with 'order' at the end
                            if full_link.endswith('/info'):
                                full_link = full_link[:-5] + '/order'

                            restaurants.append((delivery_distance_number, full_link))

                        # Sort by delivery time ascending
                        restaurants.sort(key=lambda x: x[0])

                        # Pick the fastest restaurant
                        fastest_restaurant_link = restaurants[0][1]

                        if fastest_restaurant_link:
                            print(f"Selected Zomato restaurant with URL: {fastest_restaurant_link}")

                            # Now navigate to this specific restaurant
                            page.goto(fastest_restaurant_link, wait_until="load", timeout=30000)
                            page.wait_for_timeout(5000)
                        else:
                            raise Exception("Could not find any Zomato restaurant links")
                    except Exception as e:
                        print(f"Error selecting restaurant from city page: {e}")
                        # Take a screenshot to debug
                        try:
                            page.screenshot(path="zomato_city_page_error.png")
                            print("Saved error screenshot to zomato_city_page_error.png")
                        except:
                            pass
                        return {}

                # At this point we should be on a restaurant menu page,
                # so continue with the regular menu scraping

                # First, let's take a screenshot to see what the page looks like
                try:
                    page.screenshot(path="zomato_menu_page.png")
                    print("Saved screenshot to zomato_menu_page.png")
                except Exception as e:
                    print(f"Could not save screenshot: {e}")

                # Now proceed with menu extraction using multiple strategies
                print("Attempting to extract menu items...")
                
                # Try multiple selectors for Zomato food items
                food_selectors = [
                    "//div[@class='sc-bstyWg jSRJRA']",  # Original selector
                    "div[data-testid='menu-item']",      # Alternative selector
                    "div[class*='menu-item']",           # Partial class match
                    "div[class*='dish']",                # Dish containers
                    "div[class*='item-card']",           # Item cards
                    "article",                           # Article elements
                    "div[class*='food']"                 # Food-related divs
                ]
                
                food_elements = []
                successful_selector = None
                
                for selector in food_selectors:
                    try:
                        elements = page.query_selector_all(selector)
                        if len(elements) > 0:
                            print(f"Found {len(elements)} items with selector: {selector}")
                            food_elements = elements
                            successful_selector = selector
                            break
                    except Exception as e:
                        print(f"Selector {selector} failed: {e}")
                        continue
                
                print(f"Found {len(food_elements)} items on Zomato using selector: {successful_selector}")

                # Try to extract food items with multiple methods
                for index, food in enumerate(food_elements):
                    try:
                        food_name = None
                        food_price = None
                        
                        # Method 1: Original Zomato selectors
                        try:
                            name_el = food.query_selector("h4")
                            price_el = food.query_selector(".sc-17hyc2s-1.cCiQWA")
                            if name_el and price_el:
                                food_name = name_el.inner_text()
                                food_price = price_el.inner_text().replace("₹", "")
                        except:
                            pass
                        
                        # Method 2: Alternative selectors
                        if not food_name or not food_price:
                            try:
                                # Try different name selectors
                                name_selectors = ["h3", "h4", "h5", "span[class*='name']", "div[class*='name']"]
                                for name_sel in name_selectors:
                                    name_el = food.query_selector(name_sel)
                                    if name_el and name_el.inner_text().strip():
                                        food_name = name_el.inner_text().strip()
                                        break
                                    
                                # Try different price selectors
                                price_selectors = ["span[class*='price']", "div[class*='price']", "span:has-text('₹')", "div:has-text('₹')"]
                                for price_sel in price_selectors:
                                    price_el = food.query_selector(price_sel)
                                    if price_el and '₹' in price_el.inner_text():
                                        food_price = price_el.inner_text().replace("₹", "").strip()
                                        break
                            except:
                                pass
                        
                        # Method 3: Text-based extraction
                        if not food_name or not food_price:
                            try:
                                all_text = food.text_content()
                                if all_text and '₹' in all_text:
                                    # Look for price pattern (₹ followed by digits and optional decimal)
                                    price_match = re.search(r'₹\s*(\d+(?:\.\d+)?)', all_text)
                                    if price_match:
                                        price_pos = all_text.find('₹')
                                        if price_pos > 5:
                                            potential_name = all_text[:price_pos].strip()
                                            # Clean up the name
                                            food_name = re.sub(r'\((.*?)\)', '', potential_name).strip()
                                            food_name = re.sub(r'\s+', ' ', food_name)  # Remove extra spaces
                                            food_price = price_match.group(1)
                            except:
                                pass
                        
                        # Add to results if we found both name and price
                        if food_name and food_price and len(food_name) > 2:
                            # Clean price - keep digits and decimal point
                            clean_price = re.sub(r'[^\d.]', '', str(food_price))
                            # Remove multiple consecutive dots and trailing dots
                            clean_price = re.sub(r'\.+', '.', clean_price)
                            clean_price = clean_price.strip('.')
                            
                            if clean_price and clean_price.replace('.', '').isdigit():
                                food_items[food_name] = clean_price
                                print(f"Found Zomato item: {food_name} - ₹{clean_price}")
                        
                    except Exception as e:
                        print(f"Error extracting food item {index}: {e}")
                        continue

            except Exception as e:
                print(f"Error accessing Zomato: {e}")
                try:
                    page.screenshot(path="zomato_error.png")
                except:
                    pass

            browser.close()

    except Exception as e:
        print(f"Error accessing Zomato: {e}")
        try:
            page.screenshot(path="zomato_error.png")
        except:
            pass

    print(f"Total Zomato items found: {len(food_items)}")
    print(food_items)
    return food_items

def alternative_zomato_scraper(location, restaurant_name):
    # Use the same improved search logic as the main zomato scraper
    zomato_search_query = f"site:zomato.com {restaurant_name} {location} order"
    search_results = safe_google_search(zomato_search_query, 3)
    
    if search_results:
        # Prefer URLs that already have /order in them
        order_urls = [url for url in search_results if '/order' in url]
        if order_urls:
            zomato_resturant_link = order_urls[0]
            print(f"Found Zomato order URL: {zomato_resturant_link}")
        else:
            # If no order URL found, use the first result and add /order
            base_url = search_results[0]
            if base_url.endswith('/info'):
                zomato_resturant_link = base_url.replace('/info', '/order')
            elif not base_url.endswith('/order'):
                zomato_resturant_link = f"{base_url.rstrip('/')}/order"
            else:
                zomato_resturant_link = base_url
            print(f"Modified Zomato URL to order page: {zomato_resturant_link}")
    else:
        print("No search results found")
        return {}

    food_items = {}
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1366, "height": 768},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/110.0"
        )
        page = context.new_page()

        try:
            page.goto(zomato_resturant_link, timeout=60000)
            # Add your scraping logic here
            print(f"Successfully loaded Zomato page: {zomato_resturant_link}")

        except Exception as e:
            print(f"Error accessing Zomato: {e}")
            try:
                page.screenshot(path="zomato_error.png")
            except:
                pass

        browser.close()

    return food_items
