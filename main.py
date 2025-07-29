from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from parellizer import food_json
from priceAnalysis import priceAnalyser
from typing import Optional


app = FastAPI()

# Allow requests from all origins during development (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "Food Price Comparison API with Images & Smart Matching",
        "description": "Compare menu prices between Swiggy and Zomato for the same restaurant, including food images and intelligent name matching",
        "features": [
            "✅ Food images extraction",
            "✅ Smart fuzzy matching (handles name variations like 'Chicken Biryani' ↔ 'Biryani Chicken')",
            "✅ Price analysis with recommendations",
            "✅ Handles both exact and similar food item names"
        ],
        "usage": "GET /{location}/{restaurant_name}",
        "example": "GET /bangalore/dominos-pizza",
        "optional_params": "?zomato_url=...&swiggy_url=...",
        "response_format": {
            "menu": {
                "McChicken® Xplode": {
                    "item_name": "McChicken® Xplode",
                    "availability": "both",
                    "swiggy": {
                        "price": "199.00",
                        "image": "https://swiggy.com/image.jpg",
                        "available": True
                    },
                    "zomato": {
                        "price": "209.00",
                        "image": "https://zomato.com/image.jpg", 
                        "available": True,
                        "matched_name": "Xplode McChicken"
                    },
                    "price_difference": 10.0,
                    "cheaper_platform": "Swiggy"
                },
                "Pizza Margherita": {
                    "item_name": "Pizza Margherita",
                    "availability": "swiggy_only",
                    "swiggy": {
                        "price": "299.00",
                        "image": "https://swiggy.com/pizza.jpg",
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
            },
            "summary": {
                "total_items": 25,
                "common_items": 15,
                "swiggy_only": 7,
                "zomato_only": 3,
                "analysis": "Swiggy is cheaper than Zomato for this restaurant",
                "winner": "Swiggy",
                "recommendation": "Consider ordering from Swiggy for better value"
            }
        }
    }


@app.get("/{location}/{restaurant}")
async def get_restaurant_menu(location: str, restaurant: str, 
                zomato_url: Optional[str] = None, 
                swiggy_url: Optional[str] = None):
    print(f"Received location: {location}")
    print(f"Restaurant: {restaurant}")
    print(f"Zomato URL: {zomato_url}")
    print(f"Swiggy URL: {swiggy_url}")

    # Food Price Clash Scraping and Analysis Logic
    # Now searching by restaurant name instead of food name
    food_details = food_json(location, restaurant, zomato_url, swiggy_url)
    final_Analysed_data = priceAnalyser(food_details)

    response_data = {"message": final_Analysed_data}
    print(response_data)
    return JSONResponse(content=response_data)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
