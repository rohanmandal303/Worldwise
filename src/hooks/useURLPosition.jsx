import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

async function getCityFromCoords(lat, lng, setIsFormLoading) {
  try {
    setIsFormLoading(true);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    const data = await res.json();
    return data;
  } finally {
    setIsFormLoading(false);
  }
}
function useURLPosition() {
  const [searchParams] = useSearchParams();
  const maplat = searchParams.get("lat");
  const maplng = searchParams.get("lng");
  const [data, setData] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  useEffect(
    function () {
      if (maplat && maplng) {
        getCityFromCoords(maplat, maplng, setIsFormLoading).then(
          (d) => d && setData(d)
        );
      }
    },
    [maplat, maplng]
  );
  return { data, isFormLoading };
}

export { useURLPosition };
