// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchProductionById } from '../data';

// const ProductionDetail = () => {
//   const { productionId } = useParams();
//   const [production, setProduction] = useState(null);

//   useEffect(() => {
//     const loadProduction = async () => {
//       const data = await fetchProductionById(productionId);
//       setProduction(data);
//     };

//     loadProduction();
//     const interval = setInterval(loadProduction, 5000);

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, [productionId]);

//   if (!production) {
//     return <div className="text-red-500">Production record not found</div>;
//   }

//   return (
//     <div className="bg-gray-800 p-6 rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold mb-4">Production Detail</h1>
//       <p className="text-xl mb-2"><strong>Production ID:</strong> {production.productionId}</p>
//       <p className="text-xl mb-2"><strong>Product:</strong> {production.product}</p>
//       <p className="text-xl mb-2"><strong>Quantity:</strong> {production.quantity}</p>
//       <p className="text-xl mb-2"><strong>Status:</strong> {production.status}</p>
//       <p className="text-xl mb-2"><strong>Description:</strong> {production.description}</p>
//     </div>
//   );
// };

// export default ProductionDetail;
