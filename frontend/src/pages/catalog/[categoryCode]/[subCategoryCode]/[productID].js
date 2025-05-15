import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../../../components/Header'; // Adjusted path
import Footer from '../../../../components/Footer'; // Adjusted path
import Breadcrumbs from '../../../../components/Breadcrumbs'; // Adjusted path
// import CartItem from '../../../../components/CartItem'; // Will be replaced by ProductDetailCard
import OrderSummary from '../../../../components/OrderSummary'; // Potentially reusable or adaptable
import ResponsiveProductSection from '../../../../components/ResponsiveProductSection'; // Adjusted path
import ProductCard from '../../../../components/ProductCard'; // Adjusted path
// import ProductGrid from '../../../../components/ProductGrid'; // Adjusted path
// import CartTabs from '../../../../components/CartTabs/CartTabs'; // Not needed for product page
// import DeliveryInfoForm from '../../../../components/DeliveryInfoForm/DeliveryInfoForm'; // Not needed
import ProductDetailCard from '../../../../components/ProductDetailCard'; // New component
import styles from '../../../../styles/pages/ProductPage.module.css'; // New CSS module

// Mock data for demonstration - will be replaced by dynamic data
const mockProductData = {
  id: '1',
  name: 'Полное название продукта, даже если оно дико длинное и какое то супер огромное',
  brand: 'Glock',
  article: 'FX-JSDGFJFSG',
  availability: 'В наличии: 150 шт.',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
  price: 2100,
  images: [
    { id: 'img1', url: '/images/new-products/aim.png', alt: 'Product image 1' },
    { id: 'img2', url: '/images/new-products/aim2.png', alt: 'Product thumbnail 1' },
    { id: 'img3', url: '/images/new-products/aim.png', alt: 'Product thumbnail 2' },
    { id: 'img4', url: '/images/new-products/aim2.png', alt: 'Product thumbnail 3' },
    { id: 'img5', url: '/images/new-products/aim.png', alt: 'Product thumbnail 4' },
  ],
  recommended: true, // "Рекомендуем этот товар"
  // Add other fields from Figma if necessary
};

const mockRecentlyViewedProducts = [
  // Populate with product data similar to ProductGrid's expected format
  {
    id: 'rv1',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА RV1, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    // Example: Assuming rv1 is in 'optics' category, 'red-dots' subcategory
    productLink: '/catalog/optics/red-dots/rv1',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv2',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА RV2, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    // Example: Assuming rv2 is in 'accessories' category, 'magazines' subcategory
    productLink: '/catalog/accessories/magazines/rv2',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv1',
    imageUrl: '/images/new-products/aim.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА RV1, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    // Example: Assuming rv1 is in 'optics' category, 'red-dots' subcategory
    productLink: '/catalog/optics/red-dots/rv1',
    CATALOG_AVAILABLE: 'Y'
  },
  {
    id: 'rv2',
    imageUrl: '/images/new-products/aim2.png',
    brand: 'БРЕНД',
    name: 'НАЗВАНИЕ ТОВАРА RV2, МОЖЕТ БЫТЬ ОЧЕНЬ ДАЖЕ ДЛИННЫМ',
    price: 2100,
    // Example: Assuming rv2 is in 'accessories' category, 'magazines' subcategory
    productLink: '/catalog/accessories/magazines/rv2',
    CATALOG_AVAILABLE: 'Y'
  }
  // ... more mock products
];

const ProductPage = ({ productData = mockProductData }) => { // Receive productData as prop
  console.log('productData', productData);
  const router = useRouter();
  const { productID, categoryCode, subCategoryCode } = router.query;

  // Placeholder add to cart handler for recently viewed, adapt for main product later
  const handleAddToCartRecentlyViewed = (productId) => {
    console.log(`Adding product ${productId} to cart (from ProductPage)`);
    // Add actual cart logic here later
  };

  const renderRecentlyViewedProductCard = (product) => (
    <ProductCard
      key={product.id}
      product={product}
      onAddToCart={handleAddToCartRecentlyViewed}
    />
  );

  // This will be the actual "Add to cart" for the main product on the page
  const handleAddToCart = (productDetails) => {
    console.log('Adding to cart:', productDetails);
    // Implement actual add to cart logic, potentially using Bitrix AJAX
  };

  // Mock category and subcategory names - in production these would come from API
  const categoryNames = {
    'firearms': 'Огнестрельное оружие',
    'optics': 'Оптика',
    'accessories': 'Аксессуары',
    // Add more mappings as needed
  };
  
  const subCategoryNames = {
    'rifles': 'Винтовки',
    'pistols': 'Пистолеты',
    'red-dots': 'Коллиматорные прицелы',
    'magazines': 'Магазины',
    // Add more mappings as needed
  };

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: `/catalog/${categoryCode}`, label: categoryNames[categoryCode] || 'Категория' }, 
    { href: `/catalog/${categoryCode}/${subCategoryCode}`, label: subCategoryNames[subCategoryCode] || 'Подкатегория' }, 
    { href: `/catalog/${categoryCode}/${subCategoryCode}/${productID}`, label: 'Товар' }, 
  ];

  // Dummy data for OrderSummary, will need to be dynamic based on product
  const subtotal = productData.price;
  const shippingCost = 0; // Or calculate based on product/location
  const packagingCost = 0;
  const total = subtotal + shippingCost + packagingCost;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{productData.name} - ShopShoot</title>
        <meta name="description" content={productData.description.substring(0, 160)} />
        {/* Add other SEO meta tags here, e.g., OpenGraph, Twitter Cards */}
      </Head>
      <Header /> {/* Removed breadcrumbs prop, Header likely handles its own */}
      {/* <Breadcrumbs items={breadcrumbItems} /> */}

      <main className={styles.productPageContainer}>
        <div className={styles.productLayout}> {/* Similar to cartLayout but adapted */}
          <section className={styles.productDetailSection}>
            {/* This is where the ProductDetailCard will go */}
            <ProductDetailCard product={productData} onAddToCart={handleAddToCart} />
          </section>

          <aside className={styles.productActionsSection}> {/* Similar to orderDetailsSection */}
            {/*
              The OrderSummary might not be directly applicable here as on the cart page.
              The "Add to cart" button and price are part of the ProductDetailCard.
              This section could be used for related products, upsells, or other actions.
              For now, let's keep it simple or remove if not needed based on Figma.
              The screenshot shows the price and "add to cart" as part of the main card.
            */}
            {/*
            <OrderSummary
              subtotal={subtotal} // This would be the product price
              packagingCost={packagingCost}
              shippingCost={shippingCost}
              total={total} // This would be product price + shipping/packaging
              onCheckout={() => handleAddToCart({ productId: productData.id, quantity: 1 })} // Example action
              buttonText="В корзину" // Or dynamic based on product availability
              // isCheckoutDisabled={!productData.availability} // Example
            />
            */}
            {/* The Figma design integrates price and add-to-cart within the main product card area */}
            {/* So, OrderSummary as a separate block might not be needed here. */}
            {/* We will put pricing and "Add to Cart" button directly in ProductDetailCard */}
          </aside>
        </div>
      </main>

      {/* "Recently Viewed" or "Related Products" Section */}
      <ResponsiveProductSection
        title="Недавно просмотренные" // Or "Сопутствующие товары"
        subtitle=""
        viewAllLink="/catalog?filter=viewed" // Or a relevant link
        items={mockRecentlyViewedProducts}
        showViewAllLink={false}
        renderItem={renderRecentlyViewedProductCard}
        onAddToCart={handleAddToCartRecentlyViewed}
        
      />
      <Footer />
    </>
  );
};

// export async function getStaticPaths() {
//   // Fetch all product IDs from your Bitrix backend or a sitemap
//   // For now, let's mock it. In reality, this would be dynamic.
//   // const products = await fetch('/ajax/get_all_product_ids.php').then(res => res.json());
//   // const paths = products.map(product => ({
//   //   params: {
//   //     categoryCode: product.category,
//   //     subCategoryCode: product.subcategory,
//   //     productID: product.id.toString(),
//   //   },
//   // }));
//   // return { paths, fallback: true }; // fallback: true or 'blocking'
//   return {
//     paths: [
//       // Example path, replace with actual paths from your data
//       { params: { categoryCode: 'firearms', subCategoryCode: 'rifles', productID: '123' } }
//     ],
//     fallback: true, // or 'blocking' or false if all paths are predefined
//   };
// }


// export async function getStaticProps({ params }) {
export async function getServerSideProps({ params }) { // Using SSR as per TRD for dynamic content
  const { productID, categoryCode, subCategoryCode } = params;
  // Fetch product data from Bitrix AJAX endpoint based on productID, categoryCode, subCategoryCode
  // console.log(`Fetching data for product: ${productID} in ${categoryCode}/${subCategoryCode}`);
  try {
    // const response = await fetch(`/ajax/catalog/product_detail.php?ID=${productID}&CATEGORY=${categoryCode}&SUBCATEGORY=${subCategoryCode}`);
    // if (!response.ok) {
    //   throw new Error('Failed to fetch product data');
    // }
    // const productData = await response.json();

    // For now, using mock data. Replace with actual API call.
    const productData = { ...mockProductData, id: productID, name: `Product ${productID} - ${mockProductData.name}` };


    if (!productData) {
      return {
        notFound: true, // Returns a 404 page if product not found
      };
    }

    return {
      props: {
        productData,
      },
      // revalidate: 60, // Optional: ISR - re-generate the page every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {
      //notFound: true, // Or redirect to an error page
       props: { // Fallback to mock data on error for now during dev
        productData: { ...mockProductData, id: productID, name: `Error loading - ${mockProductData.name}` },
      },
    };
  }
}

export default ProductPage; 