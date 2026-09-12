document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.hero .eyebrow').textContent = 'From Idukki, Kerala';
  document.querySelector('.hero p').textContent = 'Idukki black pepper and green cardamom, selected for vivid aroma and unmistakable Kerala character.';
  document.querySelector('.intro .eyebrow').textContent = 'Idukki, Kerala';
  document.querySelector('.intro p').textContent = 'Both of our spices come from Idukki — pepper and cardamom chosen for freshness, flavour, and the kind of cooking they inspire.';
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = `
    <article class="flip-card" id="product-pepper" tabindex="0" role="button" aria-label="Show Idukki black pepper grades" aria-pressed="false">
      <div class="flip-inner">
        <section class="flip-face flip-front"><div class="flip-image"><img src="images/spice-04.jpg" alt="Idukki black peppercorns"><span class="flip-tag">Idukki pepper</span></div><div class="flip-copy"><div class="eyebrow">Idukki highlands</div><h3>Black Pepper</h3><p>Rich, aromatic whole peppercorns with a clean warmth and lively citrus lift.</p><span class="flip-hint">Click to view pepper grades →</span></div></section>
        <section class="flip-face flip-back"><div class="eyebrow">Idukki black pepper</div><h3>Pepper grades</h3><p>Available in premium whole-pepper grades for different retail, food-service, and culinary needs.</p><div class="grade-list"><div class="grade"><strong>Bold Pepper</strong><p>Larger, premium-grade whole peppercorns.</p><ul><li>Larger peppercorns</li><li>Higher visual quality and uniformity</li><li>Best for retail packing, premium products and direct consumption</li><li>Ideal when appearance and size matter</li></ul></div><div class="grade"><strong>Cleaned Pepper</strong><p>Processed whole black peppercorns sorted and freed from dust and foreign matter.</p><ul><li>Cleaning and foreign-material removal</li><li>Better appearance and consistency</li><li>Suitable for retailers, food businesses and regular consumption</li></ul></div></div><span class="back-hint">Click to return →</span></section>
      </div>
    </article>
    <article class="flip-card" id="product-cardamom" tabindex="0" role="button" aria-label="Show Idukki green cardamom grades" aria-pressed="false">
      <div class="flip-inner">
        <section class="flip-face flip-front"><div class="flip-image"><img src="images/spice-09.jpg" alt="Idukki green cardamom pods"><span class="flip-tag">Idukki cardamom</span></div><div class="flip-copy"><div class="eyebrow">Idukki hills</div><h3>Green Cardamom</h3><p>Plump, fragrant pods with natural sweetness and a refreshing, distinctive aroma.</p><span class="flip-hint">Click to view cardamom grades →</span></div></section>
        <section class="flip-face flip-back cardamom-back"><div class="eyebrow">Idukki green cardamom</div><h3>Cardamom grades</h3><p>Carefully sourced from Kerala and graded by pod size, appearance, and customer requirements.</p><div class="grade-list"><div class="grade"><strong>8mm+ Bold</strong><p>Large, well-developed pods with attractive appearance and rich aroma; ideal for premium retail, gifting and high-quality spice products.</p></div><div class="grade"><strong>7.5mm</strong><p>Well-sized pods balancing appearance, aroma and value; suitable for retail packing and premium food products.</p></div><div class="grade"><strong>7mm</strong><p>A popular grade with good pod size, aroma and flavour; ideal for everyday retail and commercial requirements.</p></div><div class="grade"><strong>6.5mm</strong><p>A practical, economical grade with good flavour and aroma; suited to bulk buyers, restaurants and regular culinary use.</p></div><div class="grade"><strong>6mm &amp; Small</strong><p>An economical option retaining characteristic green-cardamom flavour and aroma; suitable for bulk use, grinding and processing.</p></div></div><span class="back-hint">Available in grades for your quality and budget requirements · Click to return →</span></section>
      </div>
    </article>`;
  grid.querySelectorAll('.flip-card').forEach(card => {
    const toggle = () => { const flipped = card.classList.toggle('is-flipped'); card.setAttribute('aria-pressed', String(flipped)); };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
  });
});
