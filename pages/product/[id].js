import React from 'react'
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';

const ProductDetail = () => {
    const { t } = useTranslation("common");

    const router = useRouter();
    const { id } = router.query;
  
    return (
      <Layout title={`${t("product-detail")}`}>
        <p>Post: {id}</p>
      </Layout>
    );
}

export default ProductDetail;
