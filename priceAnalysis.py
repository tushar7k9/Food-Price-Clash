import pandas as pd
import numpy as np
import re
from difflib import SequenceMatcher




def normalize_food_name(name):
    """Normalize food names for better matching"""
    # Convert to lowercase
    name = name.lower()
    # Remove common words that might vary
    remove_words = ['special', 'fresh', 'hot', 'spicy', 'tasty', 'delicious', 'crispy', 'super', 'extra']
    for word in remove_words:
        name = name.replace(word, '')
    # Remove extra spaces and punctuation
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name

def similarity(a, b):
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, a, b).ratio()

def find_best_matches(swiggy_items, zomato_items, threshold=0.6):
    """Find the best matches between Swiggy and Zomato items"""
    matches = {}
    
    # Normalize all names
    swiggy_normalized = {name: normalize_food_name(name) for name in swiggy_items.keys()}
    zomato_normalized = {name: normalize_food_name(name) for name in zomato_items.keys()}
    
    # Find matches
    for swiggy_name, swiggy_norm in swiggy_normalized.items():
        best_match = None
        best_score = 0
        
        for zomato_name, zomato_norm in zomato_normalized.items():
            score = similarity(swiggy_norm, zomato_norm)
            if score > best_score and score >= threshold:
                best_score = score
                best_match = zomato_name
        
        if best_match:
            matches[swiggy_name] = best_match
            print(f"Matched: '{swiggy_name}' <-> '{best_match}' (similarity: {best_score:.2f})")
    
    return matches


def priceAnalyser(food_details):
    print("SWIGGY DETAILS:", food_details['swiggy'])
    print("ZOMATO DETAILS:", food_details['zomato'])
    
    # Handle both old format (string prices) and new format (dict with price/image)
    swiggy_processed = {}
    zomato_processed = {}
    
    # Process Swiggy data
    for name, data in food_details['swiggy'].items():
        if isinstance(data, dict):
            # New format with image
            swiggy_processed[name] = data.get("price", "0")
        else:
            # Old format (just price string)
            swiggy_processed[name] = str(data)
    
    # Process Zomato data
    for name, data in food_details['zomato'].items():
        if isinstance(data, dict):
            # New format with image
            zomato_processed[name] = data.get("price", "0")
        else:
            # Old format (just price string)
            zomato_processed[name] = str(data)

    # Create a DataFrame for analysis using processed prices
    food_details_processed = {
        'swiggy': swiggy_processed,
        'zomato': zomato_processed
    }
    food_details_df = pd.DataFrame(food_details_processed)

    # Find common food items using fuzzy matching
    print("Finding matches between Swiggy and Zomato items...")
    matches = find_best_matches(swiggy_processed, zomato_processed, threshold=0.4)
    
    # Create comparison data for matched items
    common_food_data = {}
    for swiggy_name, zomato_name in matches.items():
        swiggy_price = swiggy_processed[swiggy_name]
        zomato_price = zomato_processed[zomato_name]
        
        common_food_data[swiggy_name] = {
            "Swiggy Price": swiggy_price,
            "Zomato Price": zomato_price,
            "Swiggy Image": food_details['swiggy'][swiggy_name].get("image") if isinstance(food_details['swiggy'][swiggy_name], dict) else None,
            "Zomato Image": food_details['zomato'][zomato_name].get("image") if isinstance(food_details['zomato'][zomato_name], dict) else None,
            "Price Difference": abs(float(swiggy_price) - float(zomato_price)) if swiggy_price and zomato_price else 0,
            "Zomato Match": zomato_name  # Store the matched Zomato item name
        }

    print(f"Found {len(common_food_data)} matching items between platforms")
    
    # Use matched items instead of exact matches
    common_food_items = list(matches.keys())

    # Create the DataFrame
    common_food_df = pd.DataFrame.from_dict(common_food_data, orient='index')

    print(common_food_df)
    
    # Check if DataFrame is empty or missing required columns
    if common_food_df.empty:
        print("No common food items found between Swiggy and Zomato")
        return {
            "analysis": "No common food items found for comparison",
            "recommendation": "Unable to compare prices - no matching items found",
            "common_items": {},
            "swiggy_total": 0,
            "zomato_total": 0,
            "winner": "No comparison possible"
        }
    
    # Check if required columns exist
    if "Swiggy Price" not in common_food_df.columns or "Zomato Price" not in common_food_df.columns:
        print("Missing price data for comparison")
        return {
            "analysis": "Insufficient price data for comparison",
            "recommendation": "Unable to compare prices - missing data",
            "common_items": common_food_data,
            "swiggy_total": 0,
            "zomato_total": 0,
            "winner": "No comparison possible"
        }
    
    try:
        swiggy_common_Total = pd.to_numeric(common_food_df["Swiggy Price"], errors='coerce').sum()
        zomato_common_Total = pd.to_numeric(common_food_df["Zomato Price"], errors='coerce').sum()
    except Exception as e:
        print(f"Error calculating totals: {e}")
        return {
            "analysis": "Error processing price data",
            "recommendation": "Unable to calculate price comparison",
            "common_items": common_food_data,
            "swiggy_total": 0,
            "zomato_total": 0,
            "winner": "Calculation error"
        }

    if swiggy_common_Total == zomato_common_Total:
        analysis_text = "Based on our analysis, both platforms have similar prices for this restaurant's menu items."
        recommendation = "We recommend checking the real-time price comparison table below for detailed item-wise pricing."
        winner = "Similar pricing"
    elif swiggy_common_Total < zomato_common_Total:
        analysis_text = 'Based on our real-time analysis, "Swiggy" is cheaper than "Zomato" for this restaurant today.'
        recommendation = "Consider ordering from Swiggy for better value."
        winner = "Swiggy"
    else:
        analysis_text = 'Based on our real-time analysis, "Zomato" is cheaper than "Swiggy" for this restaurant today.'
        recommendation = "Consider ordering from Zomato for better value."
        winner = "Zomato"
    
    print(analysis_text)

    # Create a unified menu structure
    # This will contain all unique food items with proper comparison data
    unified_menu = {}
    
    # First, add all matched items (common items)
    for swiggy_name, comparison_data in common_food_data.items():
        unified_menu[swiggy_name] = {
            "item_name": swiggy_name,
            "availability": "both",
            "swiggy": {
                "price": comparison_data["Swiggy Price"],
                "image": comparison_data["Swiggy Image"],
                "available": True
            },
            "zomato": {
                "price": comparison_data["Zomato Price"], 
                "image": comparison_data["Zomato Image"],
                "available": True,
                "matched_name": comparison_data["Zomato Match"]
            },
            "price_difference": comparison_data["Price Difference"],
            "cheaper_platform": "Swiggy" if float(comparison_data["Swiggy Price"]) < float(comparison_data["Zomato Price"]) 
                              else "Zomato" if float(comparison_data["Swiggy Price"]) > float(comparison_data["Zomato Price"])
                              else "Same"
        }
    
    # Add Swiggy-only items (not matched with Zomato)
    matched_swiggy_items = set(common_food_data.keys())
    for name, data in swiggy_processed.items():
        if name not in matched_swiggy_items:
            unified_menu[name] = {
                "item_name": name,
                "availability": "swiggy_only",
                "swiggy": {
                    "price": data,
                    "image": food_details['swiggy'][name].get("image") if isinstance(food_details['swiggy'][name], dict) else None,
                    "available": True
                },
                "zomato": {
                    "price": None,
                    "image": None, 
                    "available": False,
                    "message": "Not available on Zomato"
                },
                "price_difference": None,
                "cheaper_platform": "Swiggy"
            }
    
    # Add Zomato-only items (not matched with Swiggy)
    matched_zomato_items = set(comparison_data["Zomato Match"] for comparison_data in common_food_data.values())
    for name, data in zomato_processed.items():
        if name not in matched_zomato_items:
            unified_menu[name] = {
                "item_name": name,
                "availability": "zomato_only", 
                "swiggy": {
                    "price": None,
                    "image": None,
                    "available": False,
                    "message": "Not available on Swiggy"
                },
                "zomato": {
                    "price": data,
                    "image": food_details['zomato'][name].get("image") if isinstance(food_details['zomato'][name], dict) else None,
                    "available": True
                },
                "price_difference": None,
                "cheaper_platform": "Zomato"
            }

    result_dict = {
        "menu": unified_menu,
        "summary": {
            "total_items": len(unified_menu),
            "common_items": len(common_food_data),
            "swiggy_only": len([item for item in unified_menu.values() if item["availability"] == "swiggy_only"]),
            "zomato_only": len([item for item in unified_menu.values() if item["availability"] == "zomato_only"]),
            "swiggy_total": str(swiggy_common_Total),
            "zomato_total": str(zomato_common_Total),
            "analysis": analysis_text,
            "recommendation": recommendation,
            "winner": winner
        },
        # Empty old structure to prevent duplicates - frontend should use "menu" instead
        "swiggy": {},
        "zomato": {},
        # Keep analysis data for backward compatibility
        "common_items": common_food_data,
        "swiggy_common_Total": str(swiggy_common_Total),
        "zomato_common_Total": str(zomato_common_Total),
        "analysis": analysis_text,
        "recommendation": recommendation,
        "winner": winner,
        "common_items_count": len(common_food_data)
    }

    return result_dict


# priceAnalyser(food_details)
