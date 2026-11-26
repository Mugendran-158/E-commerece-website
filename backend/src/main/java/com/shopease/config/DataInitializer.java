package com.shopease.config;

import com.shopease.entity.Product;
import com.shopease.entity.Role;
import com.shopease.entity.User;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.ReviewRepository;
import com.shopease.repository.UserRepository;
import com.shopease.repository.WishlistItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * DataInitializer — automatically seeds initial sample data (products and demo users)
 * into the database when the application starts for the first time.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReviewRepository reviewRepository;
    private final WishlistItemRepository wishlistItemRepository;

    public DataInitializer(
            ProductRepository productRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ReviewRepository reviewRepository,
            WishlistItemRepository wishlistItemRepository
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.reviewRepository = reviewRepository;
        this.wishlistItemRepository = wishlistItemRepository;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@shopease.com")) {
            logger.info("Seeding demo admin account (admin@shopease.com)...");
            userRepository.save(new User(
                    "Admin",
                    "User",
                    "admin@shopease.com",
                    passwordEncoder.encode("Admin@123"),
                    Role.ADMIN
            ));
        }

        if (!userRepository.existsByEmail("user@shopease.com")) {
            logger.info("Seeding demo user account (user@shopease.com)...");
            userRepository.save(new User(
                    "Jane",
                    "Doe",
                    "user@shopease.com",
                    passwordEncoder.encode("User@123"),
                    Role.USER
            ));
        }
    }

    private void seedProducts() {
        // Re-seed if count is below the expected product count (77 total)
        if (productRepository.count() >= 77) {
            logger.info("Products already fully seeded ({} items). Skipping.", productRepository.count());
            return;
        }
        if (productRepository.count() > 0) {
            logger.info("Found fewer products than expected. Clearing and re-seeding all products...");
            // Delete child records first to avoid FK constraint violations
            reviewRepository.deleteAll();
            wishlistItemRepository.deleteAll();
            productRepository.deleteAll();
        }

        logger.info("Seeding 12 sample products into the database...");

        // ---- Electronics ----
        productRepository.save(new Product(
                "Sony WH-1000XM5 Wireless Headphones",
                "Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality engineered to perfection. Up to 30 hours battery life.",
                new BigDecimal("399.99"),
                new BigDecimal("329.99"),
                25, 4.8, 1420,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "Mechanical RGB Gaming Keyboard",
                "Hot-swappable custom linear switches with per-key customizable RGB lighting, sound-dampening foam, and PBT keycaps. Perfect for gamers.",
                new BigDecimal("130.00"),
                new BigDecimal("99.00"),
                30, 4.8, 680,
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
                false, "Electronics"
        ));

        productRepository.save(new Product(
                "Smart Fitness Tracker & Heart Monitor",
                "Continuous SpO2, sleep stages tracking, 14-day battery life, 5ATM water resistance, and AMOLED always-on display.",
                new BigDecimal("89.99"),
                new BigDecimal("69.99"),
                45, 4.6, 940,
                "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
                false, "Electronics"
        ));

        // ---- Shoes ----
        productRepository.save(new Product(
                "Nike Air Zoom Pegasus Running Shoes",
                "Responsive cushioning in the Pegasus provides an energized ride for everyday road running. Dual Air Zoom units deliver springy step-in cushioning.",
                new BigDecimal("150.00"),
                new BigDecimal("119.99"),
                40, 4.7, 890,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                true, "Shoes"
        ));

        productRepository.save(new Product(
                "Urban Streetwear Suede High-Tops",
                "Genuine suede leather upper with reinforced collar, vulcanized gum rubber outsole, and ergonomic memory foam insoles for all-day comfort.",
                new BigDecimal("135.00"),
                new BigDecimal("95.00"),
                20, 4.7, 220,
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
                false, "Shoes"
        ));

        // ---- Fashion ----
        productRepository.save(new Product(
                "Premium Oversized Cotton Hoodie",
                "Heavyweight 450 GSM French terry cotton with relaxed dropped shoulders and durable ribbed cuffs. Comfy relaxed fit for everyday wear.",
                new BigDecimal("85.00"),
                new BigDecimal("59.99"),
                50, 4.6, 450,
                "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                true, "Fashion"
        ));

        productRepository.save(new Product(
                "Handcrafted Vintage Leather Messenger Bag",
                "Full grain vegetable-tanned leather with brass hardware and padded internal sleeve accommodating up to 15-inch laptops. Ages beautifully.",
                new BigDecimal("195.00"),
                new BigDecimal("149.99"),
                15, 4.9, 290,
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
                true, "Fashion"
        ));

        // ---- Accessories ----
        productRepository.save(new Product(
                "Minimalist Chronograph Quartz Watch",
                "Crafted with 316L stainless steel, sapphire-coated crystal glass, and Italian genuine leather strap. Water resistant to 50 meters.",
                new BigDecimal("220.00"),
                new BigDecimal("165.00"),
                18, 4.9, 310,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                true, "Accessories"
        ));

        productRepository.save(new Product(
                "Classic Aviator Polarized Sunglasses",
                "Engineered with ultralight metal frame, 100% UV400 protective polarized lenses reducing glare and improving visual clarity in bright conditions.",
                new BigDecimal("120.00"),
                new BigDecimal("89.00"),
                35, 4.7, 380,
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
                false, "Accessories"
        ));

        // ---- Beauty ----
        productRepository.save(new Product(
                "Hydrating Botanical Facial Serum",
                "Infused with Hyaluronic acid, Vitamin C, and natural green tea antioxidants for bright, dewy, and revitalized skin texture.",
                new BigDecimal("48.00"),
                new BigDecimal("38.00"),
                65, 4.9, 520,
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
                true, "Beauty"
        ));

        // ---- Home ----
        productRepository.save(new Product(
                "Modern Nordic Ceramic Table Lamp",
                "Matte ceramic base paired with an unbleached linen fabric shade. Warm diffused 2700K ambient illumination for cozy home spaces.",
                new BigDecimal("110.00"),
                new BigDecimal("79.99"),
                22, 4.5, 195,
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
                false, "Home"
        ));

        productRepository.save(new Product(
                "Organic Bamboo Bed Sheet Set",
                "300 thread count 100% organic bamboo viscose. Silky soft, hypoallergenic, and naturally thermo-regulating for a perfect night's sleep.",
                new BigDecimal("140.00"),
                new BigDecimal("105.00"),
                28, 4.8, 310,
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
                false, "Home"
        ));

        // ---- Additional Electronics ----
        productRepository.save(new Product(
                "Apple iPhone 15 Pro Max (256GB)",
                "Titanium design with textured matte glass back, Action button, A17 Pro chip, 48MP camera system with 5x optical zoom, and USB-C.",
                new BigDecimal("1199.99"), new BigDecimal("1099.99"),
                18, 4.9, 310,
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "Samsung Galaxy Tab S9 Ultra (Wi-Fi)",
                "14.6-inch Dynamic AMOLED 2X display, S Pen included, Snapdragon 8 Gen 2 processor, Armor Aluminum casing, and IP68 water resistance.",
                new BigDecimal("999.99"), new BigDecimal("849.99"),
                12, 4.8, 145,
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "Bose QuietComfort 45 Bluetooth Headphones",
                "World-class noise cancellation, Quiet & Aware Modes, high-fidelity audio, lightweight comfort, and up to 24 hours of wireless playtime.",
                new BigDecimal("329.00"), new BigDecimal("279.00"),
                35, 4.7, 520,
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
                false, "Electronics"
        ));

        productRepository.save(new Product(
                "Logitech MX Master 3S Wireless Mouse",
                "Quiet clicks with 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, USB-C rechargeable, and ergonomic thumb rest.",
                new BigDecimal("99.99"), new BigDecimal("89.99"),
                50, 4.9, 840,
                "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "JBL Flip 6 Portable Waterproof Speaker",
                "Powerful sound with deep bass, IP67 waterproof and dustproof, 12 hours of playtime, and PartyBoost pairing capability.",
                new BigDecimal("129.95"), new BigDecimal("99.95"),
                40, 4.6, 680,
                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
                false, "Electronics"
        ));

        productRepository.save(new Product(
                "UltraWide 34-Inch Curved Gaming Monitor 165Hz",
                "WQHD 3440x1440 resolution, 1500R curvature, 1ms response time, HDR400, and AMD FreeSync Premium for an immersive gaming experience.",
                new BigDecimal("499.99"), new BigDecimal("419.99"),
                15, 4.8, 230,
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        // ---- Additional Fashion ----
        productRepository.save(new Product(
                "Classic Denim Trucker Jacket",
                "100% premium rigid cotton denim, dual chest flap pockets, adjustable side tabs, and timeless button-front styling.",
                new BigDecimal("110.00"), new BigDecimal("79.99"),
                28, 4.7, 190,
                "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
                false, "Fashion"
        ));

        productRepository.save(new Product(
                "Tailored Slim-Fit Stretch Chino Trousers",
                "Breathable cotton twill with 2% elastane for flexible comfort. Straight tapered leg cut with reinforced belt loops and welt pockets.",
                new BigDecimal("65.00"), new BigDecimal("49.99"),
                60, 4.5, 310,
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
                false, "Fashion"
        ));

        productRepository.save(new Product(
                "Bohemian Floral Print Maxi Dress",
                "Lightweight tiered silhouette with breathable rayon fabric, flattering V-neckline, self-tie waist, and romantic ruffled flutter sleeves.",
                new BigDecimal("95.00"), new BigDecimal("69.99"),
                22, 4.8, 175,
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
                true, "Fashion"
        ));

        productRepository.save(new Product(
                "Pure Merino Wool Knit Turtleneck Sweater",
                "Ultra-fine Australian Merino wool providing superior warmth and next-to-skin softness. Ribbed collar, hem, and cuffs for shape retention.",
                new BigDecimal("140.00"), new BigDecimal("105.00"),
                20, 4.9, 120,
                "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
                false, "Fashion"
        ));

        productRepository.save(new Product(
                "Organic Heavyweight Pocket Crew T-Shirt",
                "220 GSM combed organic cotton, pre-shrunk for a reliable fit wash after wash. Chest slip pocket and reinforced collar tape.",
                new BigDecimal("38.00"), new BigDecimal("28.00"),
                80, 4.6, 460,
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
                false, "Fashion"
        ));

        // ---- Additional Shoes ----
        productRepository.save(new Product(
                "Adidas Ultraboost Light Running Shoes",
                "Epic energy return with Light BOOST midsole cushioning, Continental rubber outsole grip, and Primeknit+ breathable upper textile.",
                new BigDecimal("190.00"), new BigDecimal("149.99"),
                32, 4.8, 710,
                "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
                true, "Shoes"
        ));

        productRepository.save(new Product(
                "Classic Leather Chelsea Boots",
                "Waterproof burnished full-grain leather with elastic side goring, Goodyear welted construction, and durable non-slip rubber lug soles.",
                new BigDecimal("210.00"), new BigDecimal("165.00"),
                16, 4.9, 290,
                "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80",
                true, "Shoes"
        ));

        productRepository.save(new Product(
                "Puma Suede Classic Low Sneaker",
                "The street icon since 1968. Rich suede upper with synthetic lining, padded collar, and vintage textured off-white rubber midsole.",
                new BigDecimal("85.00"), new BigDecimal("65.00"),
                45, 4.6, 540,
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
                false, "Shoes"
        ));

        productRepository.save(new Product(
                "Handcrafted Italian Leather Oxford Shoes",
                "Closed-lacing formal dress shoe in calfskin leather, hand-stitched leather sole, and cushioned insole suitable for business and black-tie.",
                new BigDecimal("260.00"), new BigDecimal("199.99"),
                14, 4.9, 180,
                "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80",
                false, "Shoes"
        ));

        // ---- Additional Accessories ----
        productRepository.save(new Product(
                "Ray-Ban Aviator Polarized Sunglasses",
                "Gold metal frame with classic G-15 polarized green lenses. 100% UV protection and crystal clear optical clarity.",
                new BigDecimal("180.00"), new BigDecimal("145.00"),
                25, 4.8, 420,
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
                true, "Accessories"
        ));

        productRepository.save(new Product(
                "Slim Bifold RFID Blocking Leather Wallet",
                "Top-grain cowhide leather with advanced RFID shielding technology, 8 card slots, dual currency compartments, and quick-access ID window.",
                new BigDecimal("48.00"), new BigDecimal("34.99"),
                65, 4.7, 880,
                "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
                false, "Accessories"
        ));

        productRepository.save(new Product(
                "Traveler Expandable Laptop Backpack 30L",
                "Water-repellent oxford fabric with TSA-friendly 180-degree flat opening, padded sleeve for up to 17-inch laptop, and USB charging port.",
                new BigDecimal("95.00"), new BigDecimal("69.99"),
                30, 4.7, 390,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                true, "Accessories"
        ));

        productRepository.save(new Product(
                "Insulated Stainless Steel Water Bottle 750ml",
                "Double-wall vacuum insulation keeps drinks ice cold for 24 hours or piping hot for 12 hours. Sweat-free powder coat finish.",
                new BigDecimal("34.99"), new BigDecimal("24.99"),
                90, 4.8, 1100,
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
                false, "Accessories"
        ));

        // ---- Home & Kitchen ----
        productRepository.save(new Product(
                "Barista Touch Espresso Coffee Machine",
                "Automated touchscreen with pre-programmed cafe drinks, integrated precision conical burr grinder, and automatic microfoam milk texturing.",
                new BigDecimal("799.99"), new BigDecimal("679.99"),
                8, 4.9, 260,
                "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
                true, "Home & Kitchen"
        ));

        productRepository.save(new Product(
                "Ceramic Matte Stoneware Dinner Set (16-Piece)",
                "Scratch-resistant stoneware dinner plates, salad plates, cereal bowls, and mugs. Microwave, dishwasher, and oven safe up to 250C.",
                new BigDecimal("120.00"), new BigDecimal("89.99"),
                24, 4.7, 185,
                "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
                false, "Home & Kitchen"
        ));

        productRepository.save(new Product(
                "Minimalist Dimmable LED Desk Lamp with Wireless Charger",
                "Eye-caring anti-glare illumination with 5 color temperatures, slide touch brightness dimmer, and 10W fast wireless charging base.",
                new BigDecimal("65.00"), new BigDecimal("45.00"),
                40, 4.6, 310,
                "https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=800&auto=format&fit=crop&q=80",
                false, "Home & Kitchen"
        ));

        // ---- Sports & Fitness ----
        productRepository.save(new Product(
                "Eco-Friendly Non-Slip Natural Rubber Yoga Mat",
                "6mm thick high-density natural tree rubber with microfiber alignment guides, anti-tear mesh, and moisture-wicking dry grip surface.",
                new BigDecimal("75.00"), new BigDecimal("54.99"),
                45, 4.8, 420,
                "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
                true, "Sports & Fitness"
        ));

        productRepository.save(new Product(
                "Adjustable Quick-Select Dumbbell Set (Pair)",
                "Quick-adjust dial system from 5 lbs up to 52.5 lbs per dumbbell. Replaces 15 pairs of traditional weights. Compact storage tray included.",
                new BigDecimal("399.00"), new BigDecimal("329.00"),
                12, 4.9, 560,
                "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&auto=format&fit=crop&q=80",
                true, "Sports & Fitness"
        ));

        productRepository.save(new Product(
                "Heavy Duty Resistance Bands Workout Kit",
                "Set of 5 stackable tube resistance bands up to 150 lbs resistance with foam handles, ankle straps, door anchor, and travel pouch.",
                new BigDecimal("45.00"), new BigDecimal("29.99"),
                70, 4.7, 680,
                "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80",
                false, "Sports & Fitness"
        ));

        // ---- Beauty & Skincare ----
        productRepository.save(new Product(
                "Retinol Night Repair Face Cream",
                "Advanced formula with 0.5% pure retinol, peptides and niacinamide. Visibly reduces fine lines, evens skin tone, and restores luminosity overnight.",
                new BigDecimal("55.00"), new BigDecimal("42.00"),
                48, 4.8, 630,
                "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80",
                true, "Beauty"
        ));

        productRepository.save(new Product(
                "Vitamin C Brightening Eye Cream",
                "Concentrated 10% Vitamin C serum with caffeine and collagen-boosting peptides that de-puffs, brightens dark circles and firms under-eye skin.",
                new BigDecimal("42.00"), new BigDecimal("32.00"),
                55, 4.7, 410,
                "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80",
                false, "Beauty"
        ));

        productRepository.save(new Product(
                "Rose Gold 12-Piece Makeup Brush Set",
                "Cruelty-free synthetic fibers in a premium rose gold ferrule and handle. Includes foundation, contour, highlight, blending and eyeshadow brushes.",
                new BigDecimal("58.00"), new BigDecimal("39.99"),
                40, 4.7, 520,
                "https://images.unsplash.com/photo-1583241800698-e8ab01830a22?w=800&auto=format&fit=crop&q=80",
                true, "Beauty"
        ));

        productRepository.save(new Product(
                "Argan Oil Hair Repair Mask 500ml",
                "Deep conditioning treatment with 100% pure Moroccan Argan oil and Keratin proteins. Restores shine, eliminates frizz and repairs split ends in 5 minutes.",
                new BigDecimal("36.00"), new BigDecimal("26.99"),
                70, 4.6, 380,
                "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&auto=format&fit=crop&q=80",
                false, "Beauty"
        ));

        // ---- Additional Electronics ----
        productRepository.save(new Product(
                "DJI Mini 4 Pro Camera Drone",
                "Tri-directional obstacle sensing, 4K/60fps video, 48MP RAW photos, and 34-min flight time in a lightweight sub-249g foldable design.",
                new BigDecimal("759.00"), new BigDecimal("699.00"),
                10, 4.9, 290,
                "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "GoPro HERO12 Black Action Camera",
                "5.3K60 and 4K120 video, HyperSmooth 6.0 stabilization, 27MP photos, 70-min waterproof to 10m with no housing required.",
                new BigDecimal("399.99"), new BigDecimal("349.99"),
                18, 4.8, 470,
                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "Portable 20000mAh Power Bank Fast Charge",
                "65W PD output with two USB-C and two USB-A ports. Charges a MacBook to 50% in under 1 hour. LED charge indicator and airline-approved.",
                new BigDecimal("59.99"), new BigDecimal("44.99"),
                75, 4.7, 920,
                "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80",
                false, "Electronics"
        ));

        productRepository.save(new Product(
                "Wireless Noise-Cancelling Earbuds Pro",
                "Active Noise Cancellation, 8-hour playback (32 with case), IPX4 sweat resistance, multipoint connection, and adaptive EQ for perfect in-ear audio.",
                new BigDecimal("149.99"), new BigDecimal("119.99"),
                55, 4.8, 1140,
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "4K Smart Android TV 55-Inch QLED",
                "Quantum Dot technology, Dolby Vision IQ and Atmos, 144Hz Game Mode Pro, Google TV OS with Chromecast built-in and hands-free voice assistant.",
                new BigDecimal("799.00"), new BigDecimal("649.00"),
                9, 4.8, 310,
                "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80",
                true, "Electronics"
        ));

        productRepository.save(new Product(
                "USB-C Hub 10-in-1 Multiport Adapter",
                "4K HDMI, 100W PD pass-through, SD/microSD slots, 3x USB-A 3.0, Ethernet, and 3.5mm audio jack. Compatible with all USB-C laptops and tablets.",
                new BigDecimal("49.99"), new BigDecimal("36.99"),
                90, 4.6, 760,
                "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
                false, "Electronics"
        ));

        // ---- Additional Fashion ----
        productRepository.save(new Product(
                "Linen Wide-Leg Summer Trousers",
                "100% Irish linen in a relaxed palazzo cut. Natural breathability, elasticated waist, and available in earthy neutral tones for effortless summer style.",
                new BigDecimal("72.00"), new BigDecimal("52.99"),
                35, 4.5, 240,
                "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80",
                false, "Fashion"
        ));

        productRepository.save(new Product(
                "Oversized Plaid Flannel Shirt",
                "Warm and cozy brushed flannel with a boxy silhouette, chest patch pockets, and an extended back hem. Perfect layered over a basic tee.",
                new BigDecimal("68.00"), new BigDecimal("48.99"),
                42, 4.6, 290,
                "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&auto=format&fit=crop&q=80",
                false, "Fashion"
        ));

        productRepository.save(new Product(
                "Athletic High-Waist Seamless Leggings",
                "Four-way stretch nylon-spandex with contour seaming, squat-proof 7/8 length, tummy control waistband, and a hidden pocket for your phone.",
                new BigDecimal("58.00"), new BigDecimal("44.99"),
                50, 4.8, 680,
                "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80",
                true, "Fashion"
        ));

        productRepository.save(new Product(
                "Men's Classic Wool Peacoat",
                "80% Italian virgin wool double-breasted peacoat with notch lapels, anchor buttons, welt pockets, and a full satin lining for winter sophistication.",
                new BigDecimal("220.00"), new BigDecimal("169.99"),
                18, 4.9, 145,
                "https://images.unsplash.com/photo-1539533018257-3bac82568ac1?w=800&auto=format&fit=crop&q=80",
                true, "Fashion"
        ));

        // ---- Additional Shoes ----
        productRepository.save(new Product(
                "Converse Chuck Taylor All Star Hi",
                "The timeless canvas high-top with a vulcanized rubber outsole, medial eyelet ventilation, and iconic rubber toe cap. An essential wardrobe staple.",
                new BigDecimal("70.00"), new BigDecimal("55.00"),
                55, 4.7, 850,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                false, "Shoes"
        ));

        productRepository.save(new Product(
                "Waterproof Hiking Trail Boots",
                "GORE-TEX waterproof membrane, Vibram outsole grip, EVA midsole cushioning, and reinforced toe cap for technical trail performance in all weather.",
                new BigDecimal("245.00"), new BigDecimal("195.00"),
                22, 4.9, 310,
                "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
                true, "Shoes"
        ));

        productRepository.save(new Product(
                "Vans Old Skool Skate Shoes",
                "Durable suede and canvas uppers with the iconic side stripe, Waffle sole for board feel, and padded collars for ankle support.",
                new BigDecimal("75.00"), new BigDecimal("59.99"),
                48, 4.6, 710,
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
                false, "Shoes"
        ));

        productRepository.save(new Product(
                "Platform Chunky-Sole Loafers",
                "Premium cruelty-free leather in a penny loafer silhouette elevated with a 4cm platform lug rubber sole. Wear with tailoring or denim.",
                new BigDecimal("125.00"), new BigDecimal("89.99"),
                28, 4.7, 195,
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
                true, "Shoes"
        ));

        // ---- Additional Accessories ----
        productRepository.save(new Product(
                "Luxury Cashmere Scarf",
                "Ultra-soft Grade-A Mongolian cashmere in a generous 200x70cm wrap. Naturally thermo-regulating and hypoallergenic. Gift box included.",
                new BigDecimal("110.00"), new BigDecimal("79.99"),
                30, 4.9, 210,
                "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=80",
                false, "Accessories"
        ));

        productRepository.save(new Product(
                "Crossbody Mini Bag with Chain Strap",
                "Vegan pebbled leather with antique gold-tone hardware, zip closure, and removable chain shoulder strap. Fits essentials for city outings.",
                new BigDecimal("82.00"), new BigDecimal("59.99"),
                38, 4.6, 280,
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
                true, "Accessories"
        ));

        productRepository.save(new Product(
                "Titanium Automatic Dive Watch",
                "Mechanical self-winding movement, 300m water resistance, rotating ceramic bezel, sapphire crystal, and brushed titanium bracelet.",
                new BigDecimal("480.00"), new BigDecimal("390.00"),
                12, 4.9, 165,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                true, "Accessories"
        ));

        productRepository.save(new Product(
                "Sterling Silver Hoop Earrings Set (6-Pairs)",
                "Hypoallergenic 925 sterling silver in six graduated sizes from 10mm to 50mm. Lightweight and comfortable for all-day wear.",
                new BigDecimal("38.00"), new BigDecimal("26.99"),
                60, 4.7, 460,
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
                false, "Accessories"
        ));

        // ---- Home & Kitchen (additional) ----
        productRepository.save(new Product(
                "Non-Stick Ceramic Cookware Set (10-Piece)",
                "PFAS-free ceramic coating on hard-anodized aluminum body. Even heat distribution, induction-compatible, dishwasher safe, with tempered glass lids.",
                new BigDecimal("299.00"), new BigDecimal("239.00"),
                18, 4.8, 360,
                "https://images.unsplash.com/photo-1584990347449-a3d9c0360b14?w=800&auto=format&fit=crop&q=80",
                true, "Home & Kitchen"
        ));

        productRepository.save(new Product(
                "Smart Air Purifier with HEPA & UV-C",
                "Captures 99.97% of airborne particles, allergens, and odors. Covers 500 sq ft. Real-time air quality display, auto mode, and quiet sleep setting.",
                new BigDecimal("189.00"), new BigDecimal("149.99"),
                20, 4.8, 285,
                "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
                true, "Home & Kitchen"
        ));

        productRepository.save(new Product(
                "Bamboo Kitchen Utensil Set (8-Piece)",
                "Heat-resistant 100% organic bamboo. Includes spatula, slotted spoon, ladle, pasta fork, tongs, and more. Hanging storage ring included.",
                new BigDecimal("32.00"), new BigDecimal("22.99"),
                85, 4.5, 510,
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
                false, "Home & Kitchen"
        ));

        productRepository.save(new Product(
                "Electric Kettle 1.7L with Temperature Control",
                "5 preset temperatures (60°-100°C), keep-warm function, 360° swivel base, boil-dry protection, and brushed stainless interior for pure taste.",
                new BigDecimal("64.99"), new BigDecimal("49.99"),
                40, 4.7, 620,
                "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
                false, "Home & Kitchen"
        ));

        productRepository.save(new Product(
                "Memory Foam Mattress Topper Queen Size",
                "3-inch gel-infused memory foam with open-cell structure for cool, pressure-relieving sleep. Hypoallergenic, CertiPUR-US certified, with anchor straps.",
                new BigDecimal("130.00"), new BigDecimal("99.99"),
                25, 4.8, 430,
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80",
                true, "Home"
        ));

        productRepository.save(new Product(
                "Scented Soy Wax Candle Gift Set (3-Pack)",
                "Hand-poured 100% natural soy wax in amber glass jars. Three mood-setting fragrances: Cedarwood & Vanilla, Ocean Breeze, and Lavender Fields.",
                new BigDecimal("42.00"), new BigDecimal("29.99"),
                60, 4.7, 580,
                "https://images.unsplash.com/photo-1602178778451-ce69ccf51a54?w=800&auto=format&fit=crop&q=80",
                false, "Home"
        ));

        // ---- Sports & Fitness (additional) ----
        productRepository.save(new Product(
                "Folding Treadmill with Incline & App Control",
                "2.5 HP motor, 12 preset programs, 0-12 km/h speed range, 5-level manual incline, and a companion app for tracking distance, time, and calories.",
                new BigDecimal("499.00"), new BigDecimal("399.00"),
                8, 4.7, 175,
                "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=800&auto=format&fit=crop&q=80",
                true, "Sports & Fitness"
        ));

        productRepository.save(new Product(
                "Jump Rope Speed Cable with Bearings",
                "Precision ball bearings for tangle-free high-speed rotation. Adjustable steel cable, foam anti-slip handles, and included carry bag.",
                new BigDecimal("24.99"), new BigDecimal("16.99"),
                100, 4.6, 740,
                "https://images.unsplash.com/photo-1598265760575-a5a17c5a7572?w=800&auto=format&fit=crop&q=80",
                false, "Sports & Fitness"
        ));

        productRepository.save(new Product(
                "Cycling Helmet MIPS Safety Certified",
                "In-Mold polycarbonate shell with 22-vent airflow, MIPS brain protection system, adjustable occipital fit, and visor. CE and CPSC certified.",
                new BigDecimal("95.00"), new BigDecimal("72.00"),
                30, 4.8, 220,
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
                false, "Sports & Fitness"
        ));

        productRepository.save(new Product(
                "Whey Protein Powder Chocolate (2kg)",
                "25g protein per serving with 5.5g BCAAs and 4g glutamine. Cold-processed whey concentrate for excellent bioavailability and smooth mixability.",
                new BigDecimal("55.00"), new BigDecimal("44.99"),
                65, 4.7, 890,
                "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80",
                true, "Sports & Fitness"
        ));

        productRepository.save(new Product(
                "Premium Neoprene Kettlebell Set (3-Piece)",
                "Colour-coded neoprene-coated cast iron kettlebells in 8, 12, and 16 kg. Flat base for stable storage, smooth handle finish, and swing-optimized grip.",
                new BigDecimal("129.00"), new BigDecimal("99.99"),
                20, 4.8, 310,
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
                true, "Sports & Fitness"
        ));

        // ---- Books ----
        productRepository.save(new Product(
                "Atomic Habits by James Clear (Hardcover)",
                "The #1 New York Times bestseller. An easy and proven way to build good habits and break bad ones using the Four Laws of Behavior Change framework.",
                new BigDecimal("28.00"), new BigDecimal("18.99"),
                120, 4.9, 2400,
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
                true, "Books"
        ));

        productRepository.save(new Product(
                "The Psychology of Money by Morgan Housel",
                "19 short stories exploring the strange ways people think about money and how timeless lessons on wealth, greed, and happiness apply to modern life.",
                new BigDecimal("22.00"), new BigDecimal("14.99"),
                100, 4.8, 1870,
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80",
                false, "Books"
        ));

        productRepository.save(new Product(
                "Designing Data-Intensive Applications",
                "The definitive guide to building reliable, scalable, and maintainable backend systems. Covers databases, distributed systems, and stream processing.",
                new BigDecimal("55.00"), new BigDecimal("42.00"),
                60, 4.9, 1250,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
                true, "Books"
        ));

        // ---- Toys & Games ----
        productRepository.save(new Product(
                "LEGO Technic 4WD Off-Road Truck (2,000+ Pieces)",
                "Authentic 4-wheel drive with live axles, independent steering, V6 engine with moving pistons, and realistic shock absorbers. For ages 11+.",
                new BigDecimal("179.99"), new BigDecimal("149.99"),
                15, 4.9, 480,
                "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80",
                true, "Toys & Games"
        ));

        productRepository.save(new Product(
                "Catan Board Game (5th Edition)",
                "The beloved strategy game of trading and settlement for 3-4 players. Includes 19 terrain hexes, 6 sea frames, 9 harbor pieces, and 375 playing cards.",
                new BigDecimal("44.99"), new BigDecimal("34.99"),
                45, 4.8, 960,
                "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80",
                false, "Toys & Games"
        ));

        productRepository.save(new Product(
                "Remote Control Racing Car 1:10 Scale",
                "Brushless motor with 60 km/h top speed, independent suspension, oil-filled shocks, waterproof electronics, and 2.4GHz anti-interference controller.",
                new BigDecimal("119.00"), new BigDecimal("89.99"),
                20, 4.7, 330,
                "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop&q=80",
                true, "Toys & Games"
        ));

        // ---- Pet Supplies ----
        productRepository.save(new Product(
                "Orthopedic Memory Foam Dog Bed (Large)",
                "4-inch pressure-relieving memory foam with a water-resistant base, machine-washable micro-velvet cover, and bolster sides for back and joint support.",
                new BigDecimal("89.00"), new BigDecimal("65.99"),
                30, 4.8, 415,
                "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=800&auto=format&fit=crop&q=80",
                false, "Pet Supplies"
        ));

        productRepository.save(new Product(
                "Automatic Pet Feeder with Camera",
                "Schedule up to 6 meals per day via app, 1080p HD camera with two-way audio, voice recorder, and 6L capacity anti-overflow hopper.",
                new BigDecimal("98.00"), new BigDecimal("75.99"),
                22, 4.6, 275,
                "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80",
                true, "Pet Supplies"
        ));

        productRepository.save(new Product(
                "Interactive Cat Toy Laser & Feather Wand",
                "Dual-mode electronic cat teaser with automatic rotating laser, feather attachment, adjustable speed, and 30-min auto-shutoff to protect cat eye safety.",
                new BigDecimal("28.00"), new BigDecimal("19.99"),
                65, 4.5, 510,
                "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&auto=format&fit=crop&q=80",
                false, "Pet Supplies"
        ));

        logger.info("Successfully seeded {} products into shopease_db!", productRepository.count());
    }
}
