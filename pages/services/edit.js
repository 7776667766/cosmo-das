import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import ServiceForm from "@/components/Forms/FormLayouts/ServiceForm";
import toast from "react-hot-toast";
import axios from "helper/api";


export default function EditServicePage() {
  const router = useRouter();
  const { id } = router.query;

  const [serviceData, setServiceData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setallproducts] = useState([])
  console.log("products", products)
  console.log("my Getting id", id);


  const userdata = async () => {
    try {
      const response = await axios.get('/product/all');

      console.log("Response from API:", response.data.data);
      setallproducts(response.data.data)
      if (response.status === 200) {
        toast.success("Data fetched !");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error in data fetch:", error);
      toast.error("An error occurred while submitting the form. Please try again later.");
    }
  }
  useEffect(() => {
    userdata()
  }, []);


  useEffect(() => {
    console.log('ID:', id);
  }, [id]);

  useEffect(() => {
    {
      const myService = products?.find(
        (data) => data?._id ==  id 
      );
 
      console.log(myService, "myservice");

      if (myService) {
        setServiceData(myService);
        setIsLoading(false);
      }
    } 
  }, [

    id,
    router,
    products.data,
  ]);
  if (router.isFallback) { 
    return <div>Loading Fallback ...</div>;
  }
  return (
    <>
      <div className={styles.pageTitle}>
        <h1>Edit Products</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Product</li>
        </ul>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ServiceForm formData={serviceData} isEditMode={true} />
      )}
    </>
  );
}

