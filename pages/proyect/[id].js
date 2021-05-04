import React from "react";
import { useRouter } from "next/router";

const ProyectDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Proyect Detail</h1>
      <p>Post: {id}</p>
    </div>
  );
};

export default ProyectDetail;
