/* ==========================================================================
   script.js — เมนู/ฟังก์ชันทั่วไปของทุกหน้า
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropdowns();
  syncCartBadge();
});

/* — เมนูมือถือ (hamburger) — */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* — เมนูย่อย (วัด / ธรรมชาติ / ตลาด / สินค้า) — */
function initDropdowns() {
  const items = document.querySelectorAll('.nav-menu > li.has-dropdown');

  items.forEach((item) => {
    const btn = item.querySelector('button.nav-link');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');

      // ปิดอันอื่นก่อนเปิดอันใหม่
      items.forEach((i) => i.classList.remove('open'));

      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // คลิกนอกเมนู -> ปิดทั้งหมด
  document.addEventListener('click', () => {
    items.forEach((i) => i.classList.remove('open'));
  });
}

/* — อัปเดตตัวเลขจำนวนสินค้าบนไอคอนตะกร้าที่ header (ทุกหน้า) — */
function syncCartBadge() {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;

  const count = window.CartAPI ? window.CartAPI.getItemCount() : 0;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}
// JavaScript Document