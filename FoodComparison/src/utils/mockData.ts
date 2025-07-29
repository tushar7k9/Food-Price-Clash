// Mock data for the app
export const mockResults = [
  {
    id: '1',
    name: 'Butter Chicken',
    restaurant: 'Punjab Grill',
    cuisine: 'North Indian',
    veg: false,
    description: 'Tender chicken pieces simmered in a rich tomato and butter gravy, flavored with aromatic spices.',
    zomato: {
      basePrice: 360,
      finalPrice: 324,
      discount: 10,
      deliveryFee: 35,
      taxes: 18,
      deliveryTime: 35,
      coupon: 'WELCOMEZ50',
      couponDesc: 'Use WELCOMEZ50 for 50% off up to ₹100',
      paymentOffers: [
        {
          bank: 'HDFC Credit Card',
          description: '10% off up to ₹100 on orders above ₹500'
        },
        {
          bank: 'Paytm',
          description: '₹75 cashback on payment via Paytm wallet'
        }
      ]
    },
    swiggy: {
      basePrice: 350,
      finalPrice: 298,
      discount: 15,
      deliveryFee: 45,
      taxes: 17,
      deliveryTime: 40,
      coupon: 'TASTY100',
      couponDesc: 'Get ₹100 off on orders above ₹350',
      paymentOffers: [
        {
          bank: 'Axis Bank',
          description: '10% off up to ₹120 on Axis Bank Credit Cards'
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    restaurant: 'Domino\'s Pizza',
    cuisine: 'Italian',
    veg: true,
    description: 'Classic pizza with a flavorful tomato sauce, fresh mozzarella cheese, and basil.',
    zomato: {
      basePrice: 249,
      finalPrice: 199,
      discount: 20,
      deliveryFee: 25,
      taxes: 15,
      deliveryTime: 28,
      coupon: 'PIZZAMANIA',
      couponDesc: 'Use PIZZAMANIA for buy 1 get 1 free',
      paymentOffers: [
        {
          bank: 'SBI Credit Card',
          description: '20% off up to ₹120 on orders above ₹400'
        }
      ]
    },
    swiggy: {
      basePrice: 249,
      finalPrice: 224,
      discount: 10,
      deliveryFee: 30,
      taxes: 15,
      deliveryTime: 25,
      coupon: null,
      couponDesc: null,
      paymentOffers: [
        {
          bank: 'ICICI Bank',
          description: '15% off up to ₹150 on ICICI Bank Credit Cards'
        },
        {
          bank: 'PhonePe',
          description: '₹50 cashback on payment via PhonePe'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Chicken Biryani',
    restaurant: 'Behrouz Biryani',
    cuisine: 'Biryani',
    veg: false,
    description: 'Fragrant basmati rice cooked with tender chicken pieces, herbs, and aromatic spices.',
    zomato: {
      basePrice: 320,
      finalPrice: 288,
      discount: 10,
      deliveryFee: 40,
      taxes: 16,
      deliveryTime: 45,
      coupon: null,
      couponDesc: null,
      paymentOffers: [
        {
          bank: 'HDFC Credit Card',
          description: '10% off up to ₹100 on orders above ₹500'
        }
      ]
    },
    swiggy: {
      basePrice: 330,
      finalPrice: 264,
      discount: 20,
      deliveryFee: 25,
      taxes: 16,
      deliveryTime: 38,
      coupon: 'BIRYANI100',
      couponDesc: 'Get ₹100 off on your favorite biryani',
      paymentOffers: [
        {
          bank: 'Yes Bank',
          description: '15% off up to ₹150 on Yes Bank Credit Cards'
        },
        {
          bank: 'Amazon Pay',
          description: '₹75 cashback on payment via Amazon Pay'
        }
      ]
    }
  },
  {
    id: '4',
    name: 'Paneer Butter Masala',
    restaurant: 'Punjabi Tadka',
    cuisine: 'North Indian',
    veg: true,
    description: 'Cottage cheese cubes in a rich, creamy tomato gravy with aromatic spices and butter.',
    zomato: {
      basePrice: 280,
      finalPrice: 252,
      discount: 10,
      deliveryFee: 35,
      taxes: 14,
      deliveryTime: 32,
      coupon: 'ZOMVEG20',
      couponDesc: 'Use ZOMVEG20 for 20% off on veg items',
      paymentOffers: [
        {
          bank: 'Kotak Credit Card',
          description: '10% off up to ₹100 on orders above ₹500'
        }
      ]
    },
    swiggy: {
      basePrice: 270,
      finalPrice: 270,
      discount: 0,
      deliveryFee: 40,
      taxes: 13,
      deliveryTime: 35,
      coupon: null,
      couponDesc: null,
      paymentOffers: [
        {
          bank: 'RBL Bank',
          description: '15% off up to ₹120 on RBL Bank Credit Cards'
        }
      ]
    }
  }
];