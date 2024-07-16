import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import ServiceForm from "@/components/Forms/FormLayouts/ServiceForm";

export default function AddService() {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Add Product</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Service</li>
        </ul>
      </div>

      <ServiceForm />
    </>
  );
}
