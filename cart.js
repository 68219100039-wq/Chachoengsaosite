/* ==========================================================================
   cart.js — ระบบตะกร้าสินค้า (เก็บข้อมูลใน localStorage ฝั่งเครื่องผู้ใช้)
   ใช้ร่วมกับ: หน้า product-*.html (ปุ่มเพิ่มลงตะกร้า) และ checkout.html
   ========================================================================== */

const CART_STORAGE_KEY = 'chachoengsao_cart';

const CartAPI = (() => {
  function readCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('อ่านข้อมูลตะกร้าไม่สำเร็จ', err);
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
  }

  /**
   * เพิ่มสินค้าลงตะกร้า
   * product: { id, name, price, image, qty }
   */
  function addItem(product) {
    const items = readCart();
    const existing = items.find((i) => i.id === product.id);

    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }

    writeCart(items);
    return items;
  }

  function removeItem(id) {
    const items = readCart().filter((i) => i.id !== id);
    writeCart(items);
    return items;
  }

  function updateQty(id, qty) {
    const items = readCart();
    const item = items.find((i) => i.id === id);
    if (!item) return items;

    item.qty = Math.max(1, qty);
    writeCart(items);
    return items;
  }

  function getItems() {
    return readCart();
  }

  function getItemCount() {
    return readCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getTotal() {
    return readCart().reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  function clearCart() {
    writeCart([]);
  }

  return {
    addItem,
    removeItem,
    updateQty,
    getItems,
    getItemCount,
    getTotal,
    clearCart,
  };
})();

window.CartAPI = CartAPI;

/* — ปุ่ม "เพิ่มลงตะกร้า" บนหน้ารายละเอียดสินค้า —
   ใช้กับปุ่มที่มี data-attribute ครบตามนี้:
   <button class="js-add-to-cart"
           data-id="product-food1"
           data-name="ข้าวหลามบางคล้า"
           data-price="65"
           data-image="../images/products/food1.jpg">เพิ่มลงตะกร้า</button>
*/
document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.js-add-to-cart');

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const qtyInput = document.querySelector('.js-qty-input');
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      CartAPI.addItem({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
        qty,
      });

      showAddedFeedback(btn);
    });
  });
});

function showAddedFeedback(btn) {
  const original = btn.textContent;
  btn.textContent = 'เพิ่มลงตะกร้าแล้ว ✓';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 1400);
}

/* — อัปเดตตัวเลขบนไอคอนตะกร้าทุกครั้งที่ตะกร้าเปลี่ยน — */
document.addEventListener('cart:updated', () => {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;
  const count = CartAPI.getItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
});
// JavaScript Document