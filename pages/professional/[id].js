import React from "react";
import { useRouter } from "next/router";

const ProfessionalDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <div>
      <h1>Professional ID</h1>
      <p>Post: {id}</p>
    </div>
  );
};

export default ProfessionalDetail;
