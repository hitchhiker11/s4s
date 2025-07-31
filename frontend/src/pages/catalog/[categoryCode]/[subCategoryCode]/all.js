import React, { useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, dehydrate, QueryClient } from 'react-query';

// API
import { getCategoryByCode, getCatalogItemsBySubCategoryCode } from '../../../../lib/api/bitrix';
import { transformCatalogItems } from '../../../../lib/api/transformers';
import { loadBitrixCore } from '../../../../lib/auth';

// Components
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import ProductGrid from '../../../../components/ProductGrid';
import Pagination from '../../../../components/Pagination';
import SubscriptionForm from '../../../../components/SubscriptionForm';
import ResponsiveProductSection from '../../../../components/ResponsiveProductSection';
import { useBasket } from '../../../../hooks/useBasket';
import { useRecentlyViewed } from '../../../../hooks/useRecentlyViewed';

// Styles
import { mediaQueries } from '../../../../styles/tokens';

// Styled components
const Container = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  ${mediaQueries.sm} { padding: 0 16px; }
  ${mediaQueries.md} { padding: 0 20px; }
  ${mediaQueries.lg} { padding: 0 40px; }
`;

const Title = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 1em;
  color: #1C1C1C;
  margin-top: 24px;
  margin-bottom: 24px;
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
`;

// Transform category helper (used for breadcrumbs)
const transformCategory = (apiCategory) => {
  if (!apiCategory) return null;
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    code: apiCategory.fields?.CODE || '',
  };
};

const SubCategoryAllProductsPage = ({ initialSubCategory, initialCategory, initialProducts, pagination: initialPagination, seo }) => {
  const router = useRouter();
  const { categoryCode, subCategoryCode, page = '1' } = router.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 12;

  const { addToBasket } = useBasket({ initialFetch: false, staleTime: 60000 });

  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();

  // Fetch category data (parent)
  const { data: categoryData } = useQuery(
    ['category', categoryCode],
    () => getCategoryByCode(categoryCode, { limit: 1 }),
    { enabled: !!categoryCode, staleTime: 1000 * 60 * 5 }
  );

  // Fetch subcategory data
  const { data: subCategoryData } = useQuery(
    ['subcategory', subCategoryCode],
    () => getCategoryByCode(subCategoryCode, { limit: 1 }),
    { enabled: !!subCategoryCode, staleTime: 1000 * 60 * 5 }
  );

  const category = React.useMemo(() => {
    if (categoryData?.data?.length) return transformCategory(categoryData.data[0]);
    return initialCategory || null;
  }, [categoryData, initialCategory]);

  const subCategory = React.useMemo(() => {
    if (subCategoryData?.data?.length) return transformCategory(subCategoryData.data[0]);
    return initialSubCategory || null;
  }, [subCategoryData, initialSubCategory]);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery(
    ['subcategoryProductsAll', categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE],
    () => getCatalogItemsBySubCategoryCode(categoryCode, subCategoryCode, {
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      sort: 'date_create:asc',
      include_subsections: 'Y',
    }),
    {
      enabled: !!categoryCode && !!subCategoryCode,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    }
  );

  const products = React.useMemo(() => {
    if (productsData?.data) return transformCatalogItems(productsData.data);
    return initialProducts || [];
  }, [productsData, initialProducts]);

  const pagination = React.useMemo(() => {
    if (productsData?.meta) {
      return {
        totalPages: productsData.meta.total_pages || Math.ceil(productsData.meta.total_count / ITEMS_PER_PAGE),
        currentPage,
        totalItems: productsData.meta.total_count || 0,
      };
    }
    return initialPagination;
  }, [productsData, currentPage, initialPagination]);

  const handlePageChange = (newPage) => {
    router.push({
      pathname: `/catalog/${categoryCode}/${subCategoryCode}/all`,
      query: { page: newPage },
    });
  };

  const handleAddToCart = async (product) => {
    const productId = parseInt(product.ID || product.id, 10);
    try {
      await addToBasket({ product_id: productId, quantity: 1 });
      console.log('Product added to cart:', productId);
    } catch (e) {
      console.error('Add to cart error:', e);
    }
  };

  useEffect(() => {
    loadBitrixCore();
  }, []);

  if (!subCategory || !category) {
    return (
      <>
        <Header />
        <Container>
          <EmptyState>Категория не найдена.</EmptyState>
        </Container>
        <Footer />
      </>
    );
  }

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: `/catalog/${categoryCode}`, label: category.name },
    { href: `/catalog/${categoryCode}/${subCategoryCode}`, label: subCategory.name },
    { href: `/catalog/${categoryCode}/${subCategoryCode}/all`, label: 'Все товары' },
  ];

  return (
    <>
      <Head>
        <title>{seo?.title || `${subCategory.name} – Все товары | Shop4Shoot`}</title>
        <meta name="description" content={seo?.description || `Все товары в категории ${subCategory.name}`} />
      </Head>

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <Title>{subCategory.name} – Все товары</Title>

        {productsLoading ? (
          <LoadingState>Загрузка товаров...</LoadingState>
        ) : products.length ? (
          <>
            <ProductGrid
              showTitleRow={false}
              products={products.map((p) => ({
                ...p,
                imageUrl: p.image,
                productLink: p.detailUrl,
                CATALOG_AVAILABLE: p.inStock ? 'Y' : 'N',
                CATALOG_QUANTITY: p.quantity ? String(p.quantity) : '0',
                CODE: p.code,
              }))}
            />

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <EmptyState>В этой категории пока нет товаров.</EmptyState>
        )}

        {/* Recently Viewed Products Section */}
        {hasRecentlyViewed && (
          <ResponsiveProductSection 
            title="Недавно просмотренные"
            subtitle=""
            showViewAllLink={false}
            items={recentlyViewed}
            useSliderOnDesktop={true} // Use slider instead of grid on desktop
            showNavigationOnDesktop={true} // Show navigation arrows on hover
            alwaysSlider={true} // Always use slider regardless of screen width
            gridSectionStyles="padding-left: 0px !important; padding-right: 0px !important;"
          />
        )}

        <SubscriptionForm />
      </Container>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context) {
  const { categoryCode, subCategoryCode, page = '1' } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 12;
  const queryClient = new QueryClient();

  try {
    // Категория и подкатегория
    await queryClient.prefetchQuery(['category', categoryCode], () => getCategoryByCode(categoryCode, { limit: 1 }));
    await queryClient.prefetchQuery(['subcategory', subCategoryCode], () => getCategoryByCode(subCategoryCode, { limit: 1 }));

    const categoryData = queryClient.getQueryData(['category', categoryCode]);
    const subCategoryData = queryClient.getQueryData(['subcategory', subCategoryCode]);

    if (!categoryData?.data?.length || !subCategoryData?.data?.length) {
      return { notFound: true };
    }

    const category = transformCategory(categoryData.data[0]);
    const subCategory = transformCategory(subCategoryData.data[0]);

    // Товары
    await queryClient.prefetchQuery(['subcategoryProductsAll', categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE], () =>
      getCatalogItemsBySubCategoryCode(categoryCode, subCategoryCode, {
        limit: ITEMS_PER_PAGE,
        page: currentPage,
        sort: 'date_create:asc',
        include_subsections: 'Y',
      })
    );

    const productsData = queryClient.getQueryData(['subcategoryProductsAll', categoryCode, subCategoryCode, currentPage, ITEMS_PER_PAGE]);
    const products = productsData?.data ? transformCatalogItems(productsData.data) : [];

    const pagination = productsData?.meta ? {
      totalPages: productsData.meta.total_pages || Math.ceil(productsData.meta.total_count / ITEMS_PER_PAGE),
      currentPage,
      totalItems: productsData.meta.total_count || 0,
    } : { totalPages: 1, currentPage: 1, totalItems: products.length };

    const seo = {
      title: `${subCategory.name} – Все товары | Shop4Shoot`,
      description: `Все товары в категории ${subCategory.name} нашего интернет-магазина`,
    };

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialSubCategory: subCategory,
        initialCategory: category,
        initialProducts: products,
        pagination,
        seo,
      },
    };
  } catch (err) {
    console.error('Error in getServerSideProps for subcategory all:', err);
    return { notFound: true };
  }
}

export default SubCategoryAllProductsPage; 