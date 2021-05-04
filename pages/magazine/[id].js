import React from "react";
import { useRouter } from "next/router";

const MagazineDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>MagazineDetail</h1>
      <p>Post: {id}</p>
    </div>
  );
};

export default MagazineDetail;
