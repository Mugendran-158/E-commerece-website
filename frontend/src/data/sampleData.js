export const SAMPLE_CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    description: "Smartphones, laptops, audio gadgets & smart wearables",
    imageUrl: "/images/cat-electronics.jpg",
    itemCount: 18
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trending apparel, jackets, streetwear and summer fits",
    imageUrl: "/images/cat-fashion.jpg",
    itemCount: 24
  },
  {
    id: 3,
    name: "Shoes",
    description: "Athletic sneakers, running kicks, leather boots & casual loafers",
    imageUrl: "/images/cat-shoes.jpg",
    itemCount: 15
  },
  {
    id: 4,
    name: "Beauty",
    description: "Skincare essentials, fragrances, cosmetics & haircare",
    imageUrl: "/images/cat-beauty.jpg",
    itemCount: 12
  },
  {
    id: 5,
    name: "Home",
    description: "Aesthetic furniture, ambient lighting, decor & kitchen essentials",
    imageUrl: "/images/cat-home.jpg",
    itemCount: 16
  },
  {
    id: 6,
    name: "Accessories",
    description: "Luxury timepieces, leather wallets, sunglasses & backpacks",
    imageUrl: "/images/cat-accessories.jpg",
    itemCount: 20
  }
];

export const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    categoryId: 1,
    description: "Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality engineered to perfection with Ultra-clear hands-free calling.",
    originalPrice: 399.99,
    discountPrice: 329.99,
    rating: 4.8,
    reviewsCount: 1420,
    stockQuantity: 25,
    imageUrl: "/images/prod-1.jpg",
    isFeatured: true
  },
  {
    id: 2,
    name: "Nike Air Zoom Pegasus Running Shoes",
    category: "Shoes",
    categoryId: 3,
    description: "Responsive cushioning in the Pegasus provides an energized ride for everyday road running. Experience lighter-weight energy return with dual Air Zoom units.",
    originalPrice: 150.00,
    discountPrice: 119.99,
    rating: 4.7,
    reviewsCount: 890,
    stockQuantity: 40,
    imageUrl: "/images/prod-2.jpg",
    isFeatured: true
  },
  {
    id: 3,
    name: "Minimalist Chronograph Quartz Watch",
    category: "Accessories",
    categoryId: 6,
    description: "Crafted with 316L stainless steel, sapphire-coated crystal glass, and Italian genuine leather strap. Water resistant up to 50 meters.",
    originalPrice: 220.00,
    discountPrice: 165.00,
    rating: 4.9,
    reviewsCount: 310,
    stockQuantity: 18,
    imageUrl: "/images/prod-3.jpg",
    isFeatured: true
  },
  {
    id: 4,
    name: "Premium Oversized Cotton Hoodie",
    category: "Fashion",
    categoryId: 2,
    description: "Heavyweight 450 GSM French terry cotton with relaxed dropped shoulders and durable ribbed cuffs. Pre-shrunk for an enduring comfy fit.",
    originalPrice: 85.00,
    discountPrice: 59.99,
    rating: 4.6,
    reviewsCount: 450,
    stockQuantity: 50,
    imageUrl: "/images/prod-4.jpg",
    isFeatured: true
  },
  {
    id: 5,
    name: "Mechanical RGB Gaming Keyboard",
    category: "Electronics",
    categoryId: 1,
    description: "Hot-swappable custom linear switches with per-key customizable RGB lighting, sound-dampening foam, and PBT double-shot keycaps.",
    originalPrice: 130.00,
    discountPrice: 99.00,
    rating: 4.8,
    reviewsCount: 680,
    stockQuantity: 30,
    imageUrl: "/images/prod-5.jpg",
    isFeatured: false
  },
  {
    id: 6,
    name: "Hydrating Botanical Facial Serum",
    category: "Beauty",
    categoryId: 4,
    description: "Infused with Hyaluronic acid, Vitamin C, and natural green tea antioxidants for bright, dewy, and revitalized skin texture.",
    originalPrice: 48.00,
    discountPrice: 38.00,
    rating: 4.9,
    reviewsCount: 520,
    stockQuantity: 65,
    imageUrl: "/images/prod-6.jpg",
    isFeatured: true
  },
  {
    id: 7,
    name: "Modern Nordic Ceramic Table Lamp",
    category: "Home",
    categoryId: 5,
    description: "Matte ceramic base paired with an unbleached linen fabric shade. Warm diffused 2700K ambient illumination with stepless rotary dimmer.",
    originalPrice: 110.00,
    discountPrice: 79.99,
    rating: 4.5,
    reviewsCount: 195,
    stockQuantity: 22,
    imageUrl: "/images/prod-7.jpg",
    isFeatured: false
  },
  {
    id: 8,
    name: "Classic Aviator Polarized Sunglasses",
    category: "Accessories",
    categoryId: 6,
    description: "Engineered with ultralight metal frame, 100% UV400 protective polarized lenses reducing glare and improving clarity.",
    originalPrice: 120.00,
    discountPrice: 89.00,
    rating: 4.7,
    reviewsCount: 380,
    stockQuantity: 35,
    imageUrl: "/images/prod-8.jpg",
    isFeatured: false
  },
  {
    id: 9,
    name: "Handcrafted Vintage Leather Messenger Bag",
    category: "Fashion",
    categoryId: 2,
    description: "Full grain vegetable-tanned leather with brass hardware and padded internal sleeve accommodating up to 15-inch laptops.",
    originalPrice: 195.00,
    discountPrice: 149.99,
    rating: 4.9,
    reviewsCount: 290,
    stockQuantity: 15,
    imageUrl: "/images/prod-9.jpg",
    isFeatured: true
  },
  {
    id: 10,
    name: "Smart Fitness Tracker & Heart Monitor",
    category: "Electronics",
    categoryId: 1,
    description: "Continuous SpO2, sleep stages tracking, 14-day battery life, 5ATM water resistance, and vibrant AMOLED always-on display.",
    originalPrice: 89.99,
    discountPrice: 69.99,
    rating: 4.6,
    reviewsCount: 940,
    stockQuantity: 45,
    imageUrl: "/images/prod-10.jpg",
    isFeatured: false
  },
  {
    id: 11,
    name: "Organic Bamboo Bed Sheet Set",
    category: "Home",
    categoryId: 5,
    description: "300 thread count 100% organic bamboo viscose. Silky soft, hypoallergenic, naturally thermo-regulating for cool, breathable nights.",
    originalPrice: 140.00,
    discountPrice: 105.00,
    rating: 4.8,
    reviewsCount: 310,
    stockQuantity: 28,
    imageUrl: "/images/prod-11.jpg",
    isFeatured: false
  },
  {
    id: 12,
    name: "Urban Streetwear Suede High-Tops",
    category: "Shoes",
    categoryId: 3,
    description: "Genuine suede leather upper with reinforced collar, vulcanized gum rubber outsole, and ergonomic memory foam insoles.",
    originalPrice: 135.00,
    discountPrice: 95.00,
    rating: 4.7,
    reviewsCount: 220,
    stockQuantity: 20,
    imageUrl: "/images/prod-12.jpg",
    isFeatured: false
  }
];
