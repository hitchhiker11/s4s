import React, { useEffect } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, dehydrate, QueryClient } from 'react-query';

// API
import { getCategoryByCode, getCatalogItemsBySubCategoryCode } from '../../../../../lib/api/bitrix';
import { transformCatalogItems } from '../../../../../lib/api/transformers';
import { loadBitrixCore } from '../../../../../lib/auth';

// Components
import Header from '../../../../../components/Header';
import Footer from '../../../../../components/Footer';
import Breadcrumbs from '../../../../../components/Breadcrumbs';
import ProductGrid from '../../../../../components/ProductGrid';
import Pagination from '../../../../../components/Pagination';
import SubscriptionForm from '../../../../../components/SubscriptionForm';
import ResponsiveProductSection from '../../../../../components/ResponsiveProductSection';
import { useBasket } from '../../../../../hooks/useBasket';
import { useRecentlyViewed } from '../../../../../hooks/useRecentlyViewed';

// Styles
import { mediaQueries } from '../../../../../styles/tokens';

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
  margin-bottom: 8px;
  ${mediaQueries.md} {
    font-size: 36px;
    margin-top: 24px;
    margin-bottom: 12px;
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

// Helper
const transformCategory = (apiCategory) => {
  if (!apiCategory) return null;
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    code: apiCategory.fields?.CODE || '',
    // Prefer direct URLs from API if available; fallback to legacy numeric PICTURE id
    image: apiCategory.fields?.PICTURE_PREVIEW_SRC
      || apiCategory.fields?.PICTURE_SRC
      || (apiCategory.fields?.PICTURE ? `/upload/${apiCategory.fields.PICTURE}` : null),
  };
};

const SubSubCategoryProductsPage = ({ initialCategory, initialSubCategory, initialSubSubCategory, initialProducts, seo }) => {
  const router = useRouter();
  const { categoryCode, subCategoryCode, subSubCategoryCode, page = '1' } = router.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 12;

  const { addToBasket } = useBasket({ initialFetch: false, staleTime: 60000 });

  // Recently viewed products hook
  const { recentlyViewed, hasRecentlyViewed } = useRecentlyViewed();

  // Fetch categories
  const { data: categoryData } = useQuery(['category', categoryCode], () => getCategoryByCode(categoryCode, { limit: 1 }), {
    enabled: !!categoryCode,
    staleTime: 1000 * 60 * 5,
  });

  const category = React.useMemo(() => {
    if (categoryData?.data?.length) return transformCategory(categoryData.data[0]);
    return initialCategory || null;
  }, [categoryData, initialCategory]);

  const { data: subCategoryData } = useQuery(['subcategory', subCategoryCode], () => getCategoryByCode(subCategoryCode, { limit: 1 }), {
    enabled: !!subCategoryCode,
    staleTime: 1000 * 60 * 5,
  });

  const subCategory = React.useMemo(() => {
    if (subCategoryData?.data?.length) return transformCategory(subCategoryData.data[0]);
    return initialSubCategory || null;
  }, [subCategoryData, initialSubCategory]);

  const { data: subSubCategoryData } = useQuery(['subSubcategory', subSubCategoryCode], () => getCategoryByCode(subSubCategoryCode, { limit: 1 }), {
    enabled: !!subSubCategoryCode,
    staleTime: 1000 * 60 * 5,
  });

  const subSubCategory = React.useMemo(() => {
    if (subSubCategoryData?.data?.length) return transformCategory(subSubCategoryData.data[0]);
    return initialSubSubCategory || null;
  }, [subSubCategoryData, initialSubSubCategory]);

  // Fetch products for subSubCategory
  const { data: productsData, isLoading: productsLoading } = useQuery(
    ['subSubProducts', categoryCode, subSubCategoryCode, currentPage, ITEMS_PER_PAGE],
    () => getCatalogItemsBySubCategoryCode(categoryCode, subSubCategoryCode, {
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      sort: 'date_create:asc',
      include_subsections: 'Y',
    }),
    {
      enabled: !!categoryCode && !!subSubCategoryCode,
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
    return { totalPages: 1, currentPage: 1, totalItems: products.length };
  }, [productsData, products, currentPage]);

  const handlePageChange = (newPage) => {
    router.push({ pathname: `/catalog/${categoryCode}/${subCategoryCode}/${subSubCategoryCode}`, query: { page: newPage } });
  };

  const handleAddToCart = async (product) => {
    const productId = parseInt(product.ID || product.id, 10);
    try {
      await addToBasket({ product_id: productId, quantity: 1 });
    } catch (e) {
      // console.error(e);
    }
  };

  useEffect(() => { loadBitrixCore(); }, []);

  if (!subSubCategory || !subCategory || !category) {
    return (
      <>
        <Header />
        <Container><EmptyState>Категория не найдена.</EmptyState></Container>
        <Footer />
      </>
    );
  }

  const breadcrumbItems = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: `/catalog/${categoryCode}`, label: category.name },
    { href: `/catalog/${categoryCode}/${subCategoryCode}`, label: subCategory.name },
    { href: `/catalog/${categoryCode}/${subCategoryCode}/${subSubCategoryCode}`, label: subSubCategory.name },
  ];

  return (
    <>
      <Head>
        <title>{seo?.title || `${subSubCategory.name} – ${subCategory.name}`}</title>
        <meta name="description" content={seo?.description || `Товары в категории ${subSubCategory.name}`} />
      </Head>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <Container>
        <Title>{subSubCategory.name}</Title>

        {productsLoading ? (
          <LoadingState>Загрузка товаров...</LoadingState>
        ) : products.length ? (
          <>
            <ProductGrid
              showTitleRow={false}
              showHeaderDivider={false}
              gridSectionStyles={`
                padding: 0px 0px 16px 0px  !important;
                @media (min-width: 768px) {
                  padding: 0px 0px 16px 0px  !important;
                }
                @media (min-width: 1200px) {
                  padding: 0px 0px 16px 0px  !important;
                }
                @media (min-width: 1920px) {
                  padding: 0px 0px 16px 0px  !important;
                }
              `}
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
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} totalItems={pagination.totalItems} onPageChange={handlePageChange} />
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
  const { categoryCode, subCategoryCode, subSubCategoryCode, page = '1' } = context.query;
  const currentPage = parseInt(page, 10) || 1;
  const ITEMS_PER_PAGE = 12;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(['category', categoryCode], () => getCategoryByCode(categoryCode, { limit: 1 }));
    await queryClient.prefetchQuery(['subcategory', subCategoryCode], () => getCategoryByCode(subCategoryCode, { limit: 1 }));
    await queryClient.prefetchQuery(['subSubcategory', subSubCategoryCode], () => getCategoryByCode(subSubCategoryCode, { limit: 1 }));

    const category = transformCategory(queryClient.getQueryData(['category', categoryCode])?.data?.[0]);
    const subCategory = transformCategory(queryClient.getQueryData(['subcategory', subCategoryCode])?.data?.[0]);
    const subSubCategory = transformCategory(queryClient.getQueryData(['subSubcategory', subSubCategoryCode])?.data?.[0]);

    if (!category || !subCategory || !subSubCategory) return { notFound: true };

    await queryClient.prefetchQuery(['subSubProducts', categoryCode, subSubCategoryCode, currentPage, ITEMS_PER_PAGE], () =>
      getCatalogItemsBySubCategoryCode(categoryCode, subSubCategoryCode, {
        limit: ITEMS_PER_PAGE,
        page: currentPage,
        sort: 'date_create:asc',
        include_subsections: 'Y',
      })
    );

    const productsData = queryClient.getQueryData(['subSubProducts', categoryCode, subSubCategoryCode, currentPage, ITEMS_PER_PAGE]);
    const products = productsData?.data ? transformCatalogItems(productsData.data) : [];

    const seo = { title: `${subSubCategory.name} – ${subCategory.name}`, description: `Товары в категории ${subSubCategory.name}` };

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        initialCategory: category,
        initialSubCategory: subCategory,
        initialSubSubCategory: subSubCategory,
        initialProducts: products,
        seo,
      },
    };
  } catch (e) {
    // console.error(e);
    return { notFound: true };
  }
}

export default SubSubCategoryProductsPage; 