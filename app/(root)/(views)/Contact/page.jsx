import ContactForm from "@/components/ContactForm";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
      <ContactForm />
    </div>
  );
};

export default page;
