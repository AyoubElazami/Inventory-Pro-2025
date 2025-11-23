import Link from 'next/link';
export default function Home(){
  return (
    <div style={{padding:20}}>
      <h1>Inventory App</h1>
      <ul>
        <li><Link href="/products">Produits</Link></li>
        <li><Link href="/orders/create">Créer commande</Link></li>
      </ul>
    </div>
  );
}
