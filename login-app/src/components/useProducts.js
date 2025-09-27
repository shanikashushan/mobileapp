import { useProducts } from "../ProductContext";

function ProductList() {
  const { products, loading } = useProducts();

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} ({p.categories?.name}) - {p.price} บาท
        </li>
      ))}
    </ul>
  );
}
