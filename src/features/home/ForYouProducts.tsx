"use client";
import { ShoppingCart } from "lucide-react";
import products from "@/data/for-you-products.json";
import { useCart } from "@/hooks/useCart";
import styles from "./ForYouProducts.module.css";

type DisplayProduct = (typeof products)[number] & { promotion?: boolean };
export function ForYouProducts({ items = products }: { items?: DisplayProduct[] }) {
  const { addItem } = useCart();
  return <div className={styles.grid}>{items.map(p => <article className={`${styles.card} ${p.promotion ? styles.promotion : ""}`} key={p.id}>
    <a href={p.href} title={p.name}>
      <div className={styles.artwork}>
        {p.promotion && <img className={styles.promoGift} src="/images/bestsellers/gift.png" alt="Tặng" />}
        {p.frame && <img className={styles.frame} src={p.frame} alt="" />}
        <div className={`${styles.picture} ${p.gift || p.labelType === "1" || p.labelType === "2" ? styles.asidePicture : ""}`}><img src={p.image} alt={p.name} /></div>
        {p.gift && <div className={styles.gift}><img className={styles.giftLabel} src="/images/bestsellers/gift.png" alt="Tặng" /><img src={p.gift} alt="Quà tặng kèm" /><div className={styles.dots}><i /><i /></div></div>}
        {p.labelType === "1" && <div className={`${styles.diaper} ${p.gift ? styles.half : ""}`}>
          <img src={`/images/bestsellers/${p.top.includes("dán") ? "ta-dan" : "ta-quan"}.png`} alt="" /><small>{p.top}</small>
          {p.gift ? <small>{p.middle} | {p.bottom.split(/\s/)[0]}</small> : <><span>{p.middle}</span><small>{p.center}</small><div className={styles.quantity}>{p.bottom}</div></>}
        </div>}
        {p.labelType === "2" && <div className={`${styles.milk} ${p.gift ? styles.halfMilk : ""}`}><div>{p.top}</div><span>{p.middle}</span></div>}
      </div>
      <h3>{p.name}</h3>
    </a>
    {p.promotion ? <div className={styles.promoCondition}>KM đơn hàng, chi từ:</div> : <div className={styles.rating}><span className={styles.stars} aria-label="5 trên 5 sao" role="img" /><span>Đã bán {p.sold}</span></div>}
    <div className={styles.bottom}><span className={styles.price}>{new Intl.NumberFormat("vi-VN").format(p.price)}đ</span>{p.discount > 0 && <span className={styles.discount}>-{p.discount}%</span>}
      {!p.promotion && <button type="button" aria-label={`Thêm ${p.name} vào giỏ`} onClick={() => addItem({id:p.id,name:p.name,slug:p.href.split('/').pop()?.replace('.html','') || p.id,price:p.price,categorySlug:'san-pham',categoryName:p.category,brand:p.brand,rating:5,reviewCount:0,soldCount:0,image:p.image,images:[p.image],description:p.name,specifications:{},isOfficial:true})}><ShoppingCart size={22} /></button>}
    </div>
  </article>)}</div>;
}

